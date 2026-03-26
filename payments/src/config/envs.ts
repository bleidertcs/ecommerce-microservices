import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  DATABASE_URL: string;
  NODE_ENV: string;
  APP_NAME: string;
  APP_DEBUG: boolean;
  APP_CORS_ORIGINS: string;
  HTTP_ENABLE: boolean;
  HTTP_HOST: string;
  HTTP_PORT: number;
  HTTP_VERSIONING_ENABLE: boolean;
  HTTP_VERSION: number;
  SENTRY_DSN?: string;
  REDIS_URL: string;
  REDIS_KEY_PREFIX: string;
  REDIS_TTL: number;
  GRPC_URL: string;
  GRPC_PACKAGE: string;
  CASDOOR_PUBLIC_KEY: string;
  CASDOOR_ISSUER: string;
}

const envsSchema = joi
  .object({
    NODE_ENV: joi.string()
      .valid('development', 'staging', 'production', 'local')
      .default('development'),
    APP_NAME: joi.string().default('NestJS Payments Service'),
    APP_DEBUG: joi.boolean().truthy('true').falsy('false').default(false),
    APP_CORS_ORIGINS: joi.string().default('http://localhost:3000'),
    HTTP_ENABLE: joi.boolean().truthy('true').falsy('false').default(true),
    HTTP_HOST: joi.string().default('0.0.0.0'),
    HTTP_PORT: joi.number().port().default(9005),
    HTTP_VERSIONING_ENABLE: joi.boolean().truthy('true').falsy('false').default(false),
    HTTP_VERSION: joi.number().valid(1, 2).default(1),
    SENTRY_DSN: joi.string().allow('').optional(),
    DATABASE_URL: joi.string().uri().required(),
    REDIS_URL: joi.string().uri().default('redis://localhost:6379'),
    REDIS_KEY_PREFIX: joi.string().default('payments:'),
    REDIS_TTL: joi.number().default(3600),
    GRPC_URL: joi.string().required(),
    GRPC_PACKAGE: joi.string().default('payments'),
    CASDOOR_PUBLIC_KEY: joi.string().required(),
    CASDOOR_ISSUER: joi.string().uri().default('http://localhost:8000'),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export default () => ({
  databaseUrl: envVars.DATABASE_URL,
  nodeEnv: envVars.NODE_ENV,
  appName: envVars.APP_NAME,
  appDebug: envVars.APP_DEBUG,
  corsOrigins: envVars.APP_CORS_ORIGINS.split(',').map(origin => origin.trim()),
  httpEnable: envVars.HTTP_ENABLE,
  httpHost: envVars.HTTP_HOST,
  httpPort: envVars.HTTP_PORT,
  versioningEnable: envVars.HTTP_VERSIONING_ENABLE,
  version: envVars.HTTP_VERSION,
  sentryDsn: envVars.SENTRY_DSN,
  redisUrl: envVars.REDIS_URL,
  redisKeyPrefix: envVars.REDIS_KEY_PREFIX,
  redisTtl: envVars.REDIS_TTL,
  grpcUrl: envVars.GRPC_URL,
  grpcPackage: envVars.GRPC_PACKAGE,
});

