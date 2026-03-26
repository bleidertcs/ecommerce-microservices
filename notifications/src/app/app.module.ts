import { Module } from '@nestjs/common';
import { CommonModule } from '@/common/common.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { AppController } from '@/app/app.controller';
import { TerminusModule } from '@nestjs/terminus';
import { GrpcModule } from 'nestjs-grpc';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NotificationsGrpcController } from '@/app/notifications.grpc.controller';

@Module({
    imports: [
        CommonModule,
        NotificationsModule,
        TerminusModule,
        GrpcModule.forProviderAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                protoPath: join(__dirname, '../protos/notifications.proto'),
                package: configService.get<string>('grpcPackage', 'notifications'),
                url: configService.get<string>('grpcUrl', '0.0.0.0:50055'),
                logging: {
                    enabled: true,
                    level: (configService.get<string>('nodeEnv') === 'development' ? 'debug' : 'log') as any,
                    context: 'NotificationsService',
                    logErrors: true,
                    logPerformance: configService.get<string>('nodeEnv') === 'development',
                    logDetails: configService.get<string>('nodeEnv') === 'development',
                },
            }),
        }),
    ],
    controllers: [AppController, NotificationsGrpcController],
    providers: [],
})
export class AppModule {}
