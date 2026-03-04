import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { GrpcModule, GrpcLogLevel } from 'nestjs-grpc';
import { join } from 'path';
import { DatabaseModule } from './common/database.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TerminusModule,
    DatabaseModule,
    GrpcModule.forProviderAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        protoPath: join(__dirname, 'protos', 'payments.proto'),
        package: configService.get<string>('grpc.package', 'payments'),
        url: configService.get<string>('grpc.url', '0.0.0.0:50056'),
        logging: {
          enabled: true,
          level: configService.get<string>('APP_ENV') === 'development' ? GrpcLogLevel.DEBUG : GrpcLogLevel.LOG,
          context: 'PaymentsService',
          logErrors: true,
          logPerformance: configService.get<string>('APP_ENV') === 'development',
          logDetails: configService.get<string>('APP_ENV') === 'development',
        },
      }),
    }),
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }


