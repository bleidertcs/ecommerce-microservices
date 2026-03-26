import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { GrpcModule, GrpcLogLevel } from 'nestjs-grpc';
import { join } from 'path';
import { CommonModule } from '@/common/common.module';
import { PaymentsModule } from '@/modules/payments/payments.module';
import { AppController } from '@/app/app.controller';
import { PaymentsGrpcController } from '@/app/payments.grpc.controller';

@Module({
  imports: [
    CommonModule,
    TerminusModule,
    GrpcModule.forProviderAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        protoPath: join(__dirname, '../protos/payments.proto'),
        package: configService.get<string>('grpcPackage', 'payments'),
        url: configService.get<string>('grpcUrl', '0.0.0.0:50056'),
        logging: {
          enabled: true,
          level: configService.get<string>('nodeEnv') === 'development' ? GrpcLogLevel.DEBUG : GrpcLogLevel.LOG,
          context: 'PaymentsService',
          logErrors: true,
          logPerformance: configService.get<string>('nodeEnv') === 'development',
          logDetails: configService.get<string>('nodeEnv') === 'development',
        },
      }),
    }),
    PaymentsModule,
  ],
  controllers: [AppController, PaymentsGrpcController],
  providers: [],
})
export class AppModule {}
