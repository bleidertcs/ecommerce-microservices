import { GrpcController, GrpcMethod } from 'nestjs-grpc';
import { MessagePattern } from '@nestjs/microservices';
import { OrdersService } from '../modules/orders/orders.service';

@GrpcController('OrdersService')
export class OrdersGrpcController {
  constructor(private readonly ordersService: OrdersService) {}

  @GrpcMethod('FindByUser')
  @MessagePattern('FindByUser')
  async findByUser(data: { userId: string }) {
    const orders = await this.ordersService.findByUser(data.userId);
    return {
      orderIds: orders.map(o => o.id),
    };
  }
}
