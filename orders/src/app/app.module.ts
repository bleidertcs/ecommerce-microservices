import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { CommonModule } from '../common/common.module';
import { OrdersModule } from '../modules/orders/orders.module';
import { AppController } from './app.controller';
import { OrdersGrpcController } from './orders.grpc.controller';
import { GrpcModule } from 'nestjs-grpc';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
    imports: [
        CommonModule,
        OrdersModule,
        TerminusModule,
        // Server registration
        GrpcModule.forProviderAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                protoPath: join(__dirname, '../protos/orders.proto'),
                package: configService.get<string>('grpc.package', 'orders'),
                url: configService.get<string>('grpc.url', '0.0.0.0:50053'),
                logging: {
                  enabled: true,
                  context: 'OrdersService',
                }
            }),
        }),
    ],
    controllers: [AppController, OrdersGrpcController],
    providers: [],
})
export class AppModule {}
