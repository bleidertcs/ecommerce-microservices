import { registerAs } from '@nestjs/config';
import { IRabbitMQConfig } from '../interfaces/config.interface';

export default registerAs(
    'rabbitmq',
    (): IRabbitMQConfig => ({
        url: process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672',
        queue: process.env.RABBITMQ_QUEUE || 'ecommerce_events',
    }),
);
