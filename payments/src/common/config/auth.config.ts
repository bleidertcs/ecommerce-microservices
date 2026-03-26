import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  publicKey: (process.env.CASDOOR_PUBLIC_KEY || '').replace(/\\n/g, '\n'),
  issuer: process.env.CASDOOR_ISSUER || 'http://localhost:8000',
}));
