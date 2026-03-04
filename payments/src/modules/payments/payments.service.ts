import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentStatus } from '@prisma/client';
import { DatabaseService } from '../../common/services/database.service';

export interface OrderCreatedPayload {
  orderId: string;
  userId?: string;
  total: number;
  paymentMethod?: string;
  items?: unknown[];
  shippingAddress?: unknown;
  timestamp?: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    @Inject('RABBITMQ_SERVICE') private readonly rmqClient: ClientProxy,
  ) { }

  async processPayment(orderData: OrderCreatedPayload): Promise<void> {
    const { orderId, userId = 'system', total, paymentMethod = 'CARD' } = orderData;
    this.logger.log(`Processing payment for Order: ${orderId}, Amount: ${total}`);

    const existing = await this.databaseService.payment.findFirst({
      where: { orderId, status: PaymentStatus.PAID },
    });
    if (existing) {
      this.logger.log(`Order ${orderId} already paid, skipping`);
      return;
    }

    const payment = await this.databaseService.payment.create({
      data: {
        orderId,
        userId,
        amount: total,
        currency: 'USD',
        status: PaymentStatus.PROCESSING,
        paymentMethod,
        metadata: orderData.items ? ({ items: orderData.items } as import('@prisma/client').Prisma.InputJsonValue) : undefined,
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));
    const success = true;
    const transactionId = `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    if (success) {
      await this.databaseService.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.PAID, transactionId },
      });
      this.logger.log(`Payment successful for Order: ${orderId}`);
      this.rmqClient.emit('order.paid', {
        orderId,
        userId,
        paymentStatus: 'PAID',
        transactionId,
      });
    } else {
      await this.databaseService.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });
      this.logger.error(`Payment failed for Order: ${orderId}`);
    }
  }

  async findAll() {
    return this.databaseService.payment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.databaseService.payment.findUnique({
      where: { id },
    });
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

