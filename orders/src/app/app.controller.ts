import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { PublicRoute } from 'src/common/decorators/public.decorator';
import { DatabaseService } from 'src/common/services/database.service';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

@ApiTags('health')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/health',
})
export class AppController {
    constructor(
        private readonly healthCheckService: HealthCheckService,
        private readonly databaseService: DatabaseService,
        private readonly microservice: MicroserviceHealthIndicator,
        private readonly configService: ConfigService,
    ) {}

    @Get()
    @HealthCheck()
    @PublicRoute()
    @ApiOperation({
        summary: 'Check application health',
        description: 'Returns the health status of the application',
    })
    public getHealth() {
        return this.healthCheckService.check([
            () => this.databaseService.isHealthy(),
            () =>
                this.microservice.pingCheck('rmq', {
                    transport: Transport.RMQ,
                    options: {
                        urls: [this.configService.get<string>('rabbitmq.url')],
                    },
                }),
        ]);
    }
}
