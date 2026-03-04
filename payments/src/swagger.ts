import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Payments API')
    .setDescription('E-commerce Payments microservice')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
    .build();
  const document = SwaggerModule.createDocument(app, config, { deepScanRoutes: true });
  SwaggerModule.setup('api/v1/payments/docs', app, document, {
    swaggerOptions: { docExpansion: 'none', persistAuthorization: true },
  });
}
