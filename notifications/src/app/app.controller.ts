import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class AppController {
    constructor(
        private health: HealthCheckService,
        private microservice: MicroserviceHealthIndicator,
        private configService: ConfigService,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
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
