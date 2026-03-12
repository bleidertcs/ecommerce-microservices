import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { CartModule } from '../modules/cart/cart.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          app: {
            name: process.env.APP_NAME || 'cart-service',
            env: process.env.NODE_ENV || 'development',
            http: {
              host: '0.0.0.0',
              port: parseInt(process.env.HTTP_PORT || '9007', 10),
            },
          },
          rabbitmq: {
            url: process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672',
          },
          redis: {
            url: process.env.REDIS_URL || 'redis://redis:6379',
          },
        }),
      ],
    }),
    TerminusModule,
    CartModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
