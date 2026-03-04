import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DatabaseService } from './common/services/database.service';

@ApiTags('health')
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class AppController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: DatabaseService,
  ) { }

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check' })
  check() {
    return this.health.check([() => this.db.isHealthy()]);
  }
}
