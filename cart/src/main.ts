import { otr_sdk } from '@/tracing';
// Start SDK before everything else
otr_sdk.start();

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { join } from 'path';
import helmet from 'helmet';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AppModule } from '@/app/app.module';

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
    const logger = new Logger('Bootstrap');

    // Basic configuration
    const appName = configService.get<string>('appName', 'Cart Service');
    const env = configService.get<string>('nodeEnv', 'development');
    const port = configService.get<number>('httpPort', 9007);
    const host = configService.get<string>('httpHost', '0.0.0.0');

    // CORS
    app.enableCors({
        origin: configService.get<string[]>('corsOrigins', ['http://localhost:3000']),
        credentials: true,
    });

    // Security
    app.use(helmet());

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    // Microservices
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'cart',
            protoPath: join(__dirname, 'protos', 'cart.proto'),
            url: configService.get<string>('GRPC_URL', '0.0.0.0:50057'),
        },
    });

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [configService.get<string>('rabbitmq.url')],
            queue: configService.get<string>('rabbitmq.queue'),
            queueOptions: {
                durable: true,
            },
        },
    });


    await app.startAllMicroservices();

    // Global Prefix
    app.setGlobalPrefix('api', { exclude: ['/health'] });

    // API versioning
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
        prefix: 'v',
    });

    // Graceful shutdown
    app.enableShutdownHooks();

    // Start server
    await app.listen(port, host);

    logger.log(`🚀 ${appName} started at http://${host}:${port}`);
}

bootstrap().catch(err => {
    console.error('Failed to start application:', err);
    process.exit(1);
});
