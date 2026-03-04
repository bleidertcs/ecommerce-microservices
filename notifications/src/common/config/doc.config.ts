import { registerAs } from '@nestjs/config';
import { IDocConfig } from '../interfaces/config.interface';

export default registerAs(
    'doc',
    (): IDocConfig => ({
        name: process.env.APP_NAME || 'Notifications Service',
        description: 'The Notifications Service API description',
        version: '1.0',
        prefix: '/docs',
    }),
);
