import { registerAs } from '@nestjs/config';
import { INatsConfig } from '../interfaces/config.interface';

export default registerAs('nats', (): INatsConfig => ({
    url: process.env.NATS_URL || 'nats://localhost:4222',
}));
