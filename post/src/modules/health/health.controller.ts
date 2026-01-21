import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DatabaseService } from '../../common/services/database.service';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: DatabaseService,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.db.isHealthy(),
        ]);
    }
}
