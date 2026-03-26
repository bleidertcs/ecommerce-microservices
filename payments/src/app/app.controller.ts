import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { DatabaseService } from '@/common/services/database.service';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

@ApiTags('health')
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class AppController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: DatabaseService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
  ) { }

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check' })
  check() {
    return this.health.check([
      () => this.db.isHealthy(),
      () =>
        this.microservice.pingCheck('rabbitmq', {
          transport: Transport.RMQ,
          options: {
            urls: [this.configService.get<string>('rabbitmq.url')],
          },
        }),
    ]);
  }
}

