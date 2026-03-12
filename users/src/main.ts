import { otr_sdk } from './tracing';
// Start SDK before everything else
otr_sdk.start();

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import helmet from 'helmet';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AppModule } from './app/app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
    const expressInstance = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance) as any, {
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
    if (env === 'production') {
        // In production, use Helmet defaults (including default CSP)
        app.use(helmet());
    } else {
        // In non-production, keep CSP enabled but more permissive to ease development
        app.use(
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        scriptSrc: ["'self'", "'unsafe-inline'", 'localhost:3000'],
                        styleSrc: ["'self'", "'unsafe-inline'"],
                        imgSrc: ["'self'", 'data:'],
                        connectSrc: ["'self'", 'ws://localhost:3000', 'http://localhost:3000'],
                        objectSrc: ["'none'"],
                        frameAncestors: ["'self'"],
                    },
                },
            }),
        );
    }

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    // Microservices
    // gRPC server — native NestJS transport (replaces buggy nestjs-grpc library)
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: configService.get<string>('grpc.package', 'users'),
            // At runtime __dirname = /app/dist, so proto is at /app/src/protos/
            protoPath: join(__dirname, '../src/protos/users.proto'),
            url: configService.get<string>('grpc.url', '0.0.0.0:50051'),
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

    // Swagger for development
    if (env !== 'production') {
        setupSwagger(app);
    }

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

    // Start server
    await app.listen(port, host);

    logger.log(`🚀 ${appName} started at http://${host}:${port}`);
    logger.log(`🔌 gRPC server started at ${configService.get<string>('grpc.url')}`);

    if (env !== 'production') {
        logger.log(`📖 Swagger: http://${host}:${port}/docs`);
    }
}

bootstrap().catch(err => {
    console.error('Failed to start application:', err);
    process.exit(1);
});
