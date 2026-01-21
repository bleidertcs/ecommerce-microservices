import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from '../../common/common.module';
import { HealthController } from './health.controller';

@Module({
    imports: [
        TerminusModule,
        CommonModule,
    ],
    controllers: [HealthController],
})
export class HealthModule {}
