import { otr_sdk } from './tracing';
// Start SDK before everything else
otr_sdk.start();

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.ms(),
                        winston.format.json(),
                    ),
                }),
                new OpenTelemetryTransportV3(),
            ],
        }),
    });

    const configService = app.get(ConfigService);
    const logger = new Logger('Bootstrap');

    const appName = configService.get<string>('APP_NAME', 'Payments Service');
    const port = configService.get<number>('PORT', 9006);
    const env = configService.get<string>('NODE_ENV', 'development');
    const rabbitmqUrl = configService.getOrThrow<string>('RABBITMQ_URL');

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    // Connect RabbitMQ Microservice
    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [rabbitmqUrl],
            queue: 'ecommerce_events',
            queueOptions: {
                durable: true,
            },
        },
    });

    await app.startAllMicroservices();

    // Global Prefix (exclude health for Kong/load balancers)
    app.setGlobalPrefix('api', { exclude: ['health'] });

    // API versioning
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
        prefix: 'v',
    });

    // Swagger (non-production)
    if (env !== 'production') {
        setupSwagger(app);
    }

    // Graceful shutdown
    app.enableShutdownHooks();

    await app.listen(port, '0.0.0.0');

    logger.log(`🚀 ${appName} started on port ${port}`);
    logger.log(`🔌 RabbitMQ listener started for queue: ecommerce_events`);
    if (env !== 'production') logger.log(`📖 Swagger: http://0.0.0.0:${port}/api/v1/payments/docs`);
}

bootstrap().catch(err => {
    console.error('Failed to start application:', err);
    process.exit(1);
});
