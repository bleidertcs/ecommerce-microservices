import { registerAs } from '@nestjs/config';
import { ITcpConfig } from '../interfaces/config.interface';

export default registerAs('tcp', (): ITcpConfig => ({
    port: parseInt(process.env.TCP_PORT || '3003', 10),
}));
