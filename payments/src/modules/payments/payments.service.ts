import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentStatus, Prisma } from '@prisma/client';
import { DatabaseService } from '@/common/services/database.service';
import { CircuitBreakerService } from '@/common/services/circuit-breaker.service';
import { QueryBuilderService } from '@/common/services/query-builder.service';
import { Currency, PaymentMethod } from '@/common/enums/payment-method.enum';
import { OrderCreatedPayloadDto } from '@/modules/payments/dtos/create-payment.dto';
import { PaymentQueryDto } from '@/modules/payments/dtos/payment-query.dto';
import { IPaginatedData } from '@/common/interfaces/response.interface';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly allowedSortFields = ['createdAt', 'amount', 'status', 'paymentMethod'];

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly circuitBreakerService: CircuitBreakerService,
    private readonly queryBuilderService: QueryBuilderService,
    @Inject('RABBITMQ_SERVICE') private readonly rmqClient: ClientProxy,
  ) {}

  async processPayment(orderData: OrderCreatedPayloadDto): Promise<void> {
    const { orderId, userId = 'system', total, paymentMethod = PaymentMethod.CARD } = orderData;
    this.logger.log(`[PROCESS] Payment for Order: ${orderId}, Amount: ${total}`);

    const existing = await this.databaseService.payment.findFirst({
      where: { orderId, status: PaymentStatus.PAID },
    });
    if (existing) {
      this.logger.warn(`[SKIP] Order ${orderId} already paid`);
      return;
    }

    const payment = await this.databaseService.payment.create({
      data: {
        orderId,
        userId,
        amount: total,
        currency: Currency.USD,
        status: PaymentStatus.PROCESSING,
        paymentMethod,
        metadata: orderData.items ? ({ items: orderData.items } as Prisma.InputJsonValue) : undefined,
      },
    });

    try {
      const result = await this.circuitBreakerService.fire(
        'payment-gateway',
        () => this.callPaymentGateway({ orderId, amount: total, method: paymentMethod })
      );

      if (result.success) {
        await this.databaseService.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.PAID, transactionId: result.transactionId },
        });
        this.logger.log(`[SUCCESS] Payment for Order: ${orderId} - Transaction: ${result.transactionId}`);
        this.rmqClient.emit('order.paid', {
          orderId,
          userId,
          userName: orderData.userName,
          userEmail: orderData.userEmail,
          total,
          paymentStatus: PaymentStatus.PAID,
          transactionId: result.transactionId,
        });
      }
    } catch (error) {
      await this.databaseService.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });
      this.logger.error(`[FAILED] Payment for Order: ${orderId}`, error);
      this.rmqClient.emit('payment.failed', { orderId, userId, reason: (error as Error).message });
    }
  }

  private async callPaymentGateway(params: { orderId: string; amount: number; method: PaymentMethod }): Promise<{ success: boolean; transactionId: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        });
      }, 1500);
    });
  }

  async findAll(query: PaymentQueryDto): Promise<IPaginatedData<any>> {
    const { page = 1, limit = 10, sortBy, sortOrder, status, paymentMethod, userId, orderId } = query;

    const where = this.queryBuilderService.buildWhereClause(
      { status, paymentMethod, userId, orderId },
      [],
    );

    const orderBy = this.queryBuilderService.buildOrderBy(sortBy, sortOrder, this.allowedSortFields);
    const { skip, take } = this.queryBuilderService.buildPagination(page, limit);

    const [items, total] = await Promise.all([
      this.databaseService.payment.findMany({ where, orderBy, skip, take }),
      this.databaseService.payment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    return this.databaseService.payment.findUnique({ where: { id } });
  }

  async findByUser(userId: string) {
    return this.databaseService.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByOrderId(orderId: string) {
    return this.databaseService.payment.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

