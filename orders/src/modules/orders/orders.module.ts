import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OutboxWorker } from './outbox.worker';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL', 'amqp://rabbitmq:5672')],
            queue: 'ecommerce_events',
            queueOptions: { durable: true },
          },
        }),
      },
      {
        name: 'USERS_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'users',
            protoPath: join(__dirname, '../../protos/users.proto'),
            url: 'bw-users-service:50051',
          },
        }),
      },
      {
        name: 'PRODUCTS_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'products',
            protoPath: join(__dirname, '../../protos/products.proto'),
            url: 'bw-products-service:50052',
          },
        }),
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OutboxWorker],
  exports: [OrdersService],
})
export class OrdersModule {}
