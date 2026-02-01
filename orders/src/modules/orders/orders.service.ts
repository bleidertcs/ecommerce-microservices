import { Injectable, Logger, OnModuleInit, Inject, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { DatabaseService } from '../../common/services/database.service';

interface IUsersGrpcService {
  findOne(data: { id: string }): Observable<any>;
}

interface IProductsGrpcService {
  findOne(data: { id: string }): Observable<any>;
}

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  private usersService: IUsersGrpcService;
  private productsService: IProductsGrpcService;

  constructor(
    private readonly databaseService: DatabaseService,
    @Inject('USERS_PACKAGE') private usersClient: ClientGrpc,
    @Inject('PRODUCTS_PACKAGE') private productsClient: ClientGrpc,
    @Inject('RABBITMQ_SERVICE') private rmqClient: ClientProxy,
  ) {}

  async onModuleInit() {
    this.usersService = this.usersClient.getService<IUsersGrpcService>('UsersService');
    this.productsService = this.productsClient.getService<IProductsGrpcService>('ProductsService');
  }

  async createOrder(userId: string, items: { productId: string; quantity: number }[]) {
    // 1. Validate User
    try {
      const user = await firstValueFrom(this.usersService.findOne({ id: userId }));
      if (!user) throw new BadRequestException('User not found');
    } catch (e) {
      this.logger.error(`Error validating user: ${e.message}`);
      throw new BadRequestException('User validation failed');
    }

    const processedItems = [];
    let grandTotal = 0;

    // 2. Validate Products and calculate total
    for (const item of items) {
      const product = await firstValueFrom(this.productsService.findOne({ id: item.productId }));
      if (!product || product.stock < item.quantity) {
        throw new BadRequestException(`Product ${item.productId} not available or insufficient stock`);
      }
      processedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
      grandTotal += product.price * item.quantity;
    }

    // 3. Create Order
    const order = await this.databaseService.order.create({
      data: {
        userId,
        total: grandTotal,
        status: OrderStatus.PENDING,
        items: {
          create: processedItems,
        },
      },
      include: { items: true },
    });

    // 4. Publish Event
    this.rmqClient.emit('order.created', {
      orderId: order.id,
      userId: order.userId,
      total: order.total,
      timestamp: order.createdAt,
    });

    this.logger.log(`Order ${order.id} created and event published`);
    return order;
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
