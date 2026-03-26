import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
  // Payments might not have a specific queue it listens to if it only PUBLISHES,
  // but let's check if it connects as a microservice.
}));
