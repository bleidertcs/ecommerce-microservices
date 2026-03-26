import type { INestApplication } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import type { SwaggerCustomOptions } from '@nestjs/swagger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = async (app: INestApplication) => {
    const logger = new Logger('Swagger');

    const documentBuild = new DocumentBuilder()
        .setTitle('Notifications API')
        .setDescription('E-commerce Notifications microservice')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
        .build();

    const document = SwaggerModule.createDocument(app, documentBuild, {
        deepScanRoutes: true,
    });
    const customOptions: SwaggerCustomOptions = {
        swaggerOptions: {
            docExpansion: 'none',
            persistAuthorization: true,
            displayOperationId: true,
            operationsSorter: 'method',
            tagsSorter: 'alpha',
            tryItOutEnabled: true,
            filter: true,
        },
    };
    SwaggerModule.setup('api/v1/notifications/docs', app, document, {
        explorer: true,
        customSiteTitle: 'Notifications API',
        ...customOptions,
    });
    logger.log(`Docs will serve on /api/v1/notifications/docs`);
};
