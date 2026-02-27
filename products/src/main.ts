import { otr_sdk } from './tracing';
// Start SDK before everything else
otr_sdk.start();


import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';
import { setupSwagger } from './swagger';


async function bootstrap() {
    const expressInstance = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance), {
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
    const logger = app.get(Logger);

    // Basic configuration
    const appName = configService.getOrThrow<string>('app.name');
    const env = configService.getOrThrow<string>('app.env');
    const port = configService.getOrThrow<number>('app.http.port');
    const host = configService.getOrThrow<string>('app.http.host');

    // CORS
    app.enableCors({
        origin: configService.get<string[]>('app.cors.origins', ['http://localhost:3000']),
        credentials: true,
    });

    // Security
    app.use(helmet({ contentSecurityPolicy: env === 'production' ? undefined : false }));

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    // Microservices listener for RMQ
    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [configService.get<string>('rabbitmq.url', 'amqp://guest:guest@rabbitmq:5672')],
            queue: 'products_queue',
            queueOptions: {
                durable: true
            },
        },
    });

    await app.startAllMicroservices();

    // Global Prefix
    app.setGlobalPrefix('api', { exclude: ['health'] });

    // API versioning
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
        prefix: 'v',
    });


    // Graceful shutdown
    app.enableShutdownHooks();

    process.on('SIGTERM', () => {
        logger.log('Received SIGTERM, shutting down gracefully');
        app.close();
    });

    process.on('SIGINT', () => {
        logger.log('Received SIGINT, shutting down gracefully');
        app.close();
    });

    // Swagger documentation
    await setupSwagger(app);

    // Start server
    await app.listen(port, host);

    logger.log(`🚀 ${appName} started at http://${host}:${port}`);
    logger.log(`🚀 Swagger: http://${host}:${port}/docs`);
}

bootstrap().catch(err => {
    console.error('Failed to start application:', err);
    process.exit(1);
});
