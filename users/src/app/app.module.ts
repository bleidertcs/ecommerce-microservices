import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { CommonModule } from '../common/common.module';
import { UsersModule } from '../modules/users/users.module';
import { AppController } from './app.controller';
import { UsersGrpcController } from './users.grpc.controller';
import { GrpcModule } from 'nestjs-grpc';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
    imports: [
        CommonModule,
        UsersModule,
        TerminusModule,
        GrpcModule.forProviderAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                protoPath: join(__dirname, '../protos/users.proto'),
                package: configService.get<string>('grpc.package', 'users'),
                url: configService.get<string>('grpc.url', '0.0.0.0:50051'),
                logging: {
                    enabled: true,
                    level: configService.get<string>('app.env') === 'development' ? 'debug' : 'log',
                    context: 'UsersService',
                    logErrors: true,
                    logPerformance: configService.get<string>('app.env') === 'development',
                    logDetails: configService.get<string>('app.env') === 'development',
                },
            }),
        }),
    ],
    controllers: [AppController, UsersGrpcController],
    providers: [],
})
export class AppModule {}
