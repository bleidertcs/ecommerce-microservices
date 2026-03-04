import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';

import { CommonModule } from '../common/common.module';
import { ProductsModule } from '../modules/products/products.module';
import { AppController } from './app.controller';
import { ProductsGrpcController } from './products.grpc.controller';
import { GrpcModule } from 'nestjs-grpc';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { GrpcExceptionFilter } from '../common/filters/grpc-exception.filter';

@Module({
    imports: [
        CommonModule,
        ProductsModule,
        TerminusModule,
        GrpcModule.forProviderAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                protoPath: join(__dirname, '../protos/products.proto'),
                package: configService.get<string>('grpc.package', 'products'),
                url: configService.get<string>('grpc.url', '0.0.0.0:50052'),
                logging: {
                    enabled: true,
                    level: (configService.get<string>('app.env') === 'development' ? 'debug' : 'log') as any,
                    context: 'ProductsService',
                    logErrors: true,
                    logPerformance: configService.get<string>('app.env') === 'development',
                    logDetails: configService.get<string>('app.env') === 'development',
                },
            }),
        }),
    ],
    controllers: [AppController, ProductsGrpcController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: GrpcExceptionFilter,
        },
    ],
})
export class AppModule {}
