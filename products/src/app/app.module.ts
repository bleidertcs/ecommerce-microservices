import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { CommonModule } from '../common/common.module';
import { ProductsModule } from '../modules/products/products.module';
import { AppController } from './app.controller';
import { ProductsGrpcController } from './products.grpc.controller';
import { GrpcModule } from 'nestjs-grpc';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

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
                    level: configService.get<string>('app.env') === 'development' ? 'debug' : 'log',
                    context: 'ProductsService',
                    logErrors: true,
                    logPerformance: configService.get<string>('app.env') === 'development',
                    logDetails: configService.get<string>('app.env') === 'development',
                },
            }),
        }),
    ],
    controllers: [AppController, ProductsGrpcController],
    providers: [],
})
export class AppModule {}
