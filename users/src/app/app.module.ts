import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';

import { CommonModule } from '../common/common.module';
import { UsersModule } from '../modules/users/users.module';
import { AppController } from './app.controller';
import { UsersGrpcController } from './users.grpc.controller';
import { GrpcExceptionFilter } from '../common/filters/grpc-exception.filter';

@Module({
    imports: [
        CommonModule,
        UsersModule,
        TerminusModule,
    ],
    controllers: [AppController, UsersGrpcController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: GrpcExceptionFilter,
        },
    ],
})
export class AppModule {}
