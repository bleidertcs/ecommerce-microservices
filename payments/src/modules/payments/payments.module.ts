import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentsGrpcController } from './payments.grpc.controller';
import { UserIdMiddleware } from '../../common/middlewares/user-id.middleware';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL', 'amqp://rabbitmq:5672')],
            queue: 'ecommerce_events',
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PaymentsController, PaymentsGrpcController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(UserIdMiddleware).forRoutes('*');
  }
}
