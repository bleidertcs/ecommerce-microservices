import { Injectable, Logger, OnModuleInit, Inject, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { DatabaseService } from '../../common/services/database.service';
import { CircuitBreakerService } from '../../common/services/circuit-breaker.service';

import { ConfigService } from '@nestjs/config';

interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface IUsersService {
  findOne(data: { id: string }): Observable<IUser>;
}

interface IProductsService {
  findOne(data: { id: string }): Observable<IProduct>;
}

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  private usersService: IUsersService;
  private productsService: IProductsService;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly circuitBreakerService: CircuitBreakerService,
    private readonly configService: ConfigService,
    @Inject('USERS_PACKAGE') private usersClient: any,
    @Inject('PRODUCTS_PACKAGE') private productsClient: any,
    @Inject('RABBITMQ_SERVICE') private rmqClient: ClientProxy,
  ) {}

  async onModuleInit() {
    const usersTransport = this.configService.get<string>('USERS_TRANSPORT', 'grpc');
    const productsTransport = this.configService.get<string>('PRODUCTS_TRANSPORT', 'grpc');

    if (usersTransport === 'grpc') {
      this.usersService = (this.usersClient as ClientGrpc).getService<IUsersService>('UsersService');
    } else {
      this.usersService = {
        findOne: (data: { id: string }) => (this.usersClient as ClientProxy).send<IUser>('FindOne', data),
      };
    }

    if (productsTransport === 'grpc') {
      this.productsService = (this.productsClient as ClientGrpc).getService<IProductsService>('ProductsService');
    } else {
      this.productsService = {
        findOne: (data: { id: string }) => (this.productsClient as ClientProxy).send<IProduct>('FindOne', data),
      };
    }
  }

  async createOrder(userId: string, items: { productId: string; quantity: number }[]) {
    return this.databaseService.$transaction(async (tx) => {
      // 1. Validate User with Circuit Breaker
      try {
        const user = await this.circuitBreakerService.fire(
          'users-service',
          (id: string) => firstValueFrom(this.usersService.findOne({ id })),
          userId,
        );
        if (!user) throw new BadRequestException('User not found');
      } catch (e) {
        this.logger.error(`Error validating user with Circuit Breaker: ${e.message}`);
        throw new BadRequestException('User validation failed or service unavailable');
      }

      const processedItems = [];
      let grandTotal = 0;

      // 2. Validate Products and calculate total with Circuit Breaker
      for (const item of items) {
        const product = await this.circuitBreakerService.fire(
          'products-service',
          (id: string) => firstValueFrom(this.productsService.findOne({ id })),
          item.productId,
        );

        if (!product || product.stock < item.quantity) {
          throw new BadRequestException(`Product ${item.productId} not available or insufficient stock`);
        }
        processedItems.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
        });
        grandTotal += product.price * item.quantity;
      }

      // 3. Create Order
      const order = await tx.order.create({
        data: {
          userId,
          subtotal: grandTotal,
          total: grandTotal,
          status: OrderStatus.PENDING,
          shippingAddress: {}, // Default empty for now
          paymentMethod: 'Credit Card',
          items: {
            create: processedItems,
          },
        },
        include: { items: true },
      });

      // 4. Create Outbox Event (Consistencia de Datos)
      await tx.outbox.create({
        data: {
          type: 'order.created',
          payload: {
            orderId: order.id,
            userId: order.userId,
            total: order.total,
            timestamp: order.createdAt,
          },
        },
      });

      this.logger.log(`Order ${order.id} and outbox event created within transaction`);
      return order;
    });
  }

  async findAll() {
    return this.databaseService.order.findMany({ include: { items: true } });
  }

  async findByUser(userId: string) {
    return this.databaseService.order.findMany({
      where: { userId },
      include: { items: true },
    });
  }
}
