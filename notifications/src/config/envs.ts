import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
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
  RABBITMQ_URL: string;
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
    APP_NAME: joi.string().default('NestJS Notifications Service'),
    APP_DEBUG: joi.boolean().truthy('true').falsy('false').default(false),
    APP_CORS_ORIGINS: joi.string().default('http://localhost:3000'),
    HTTP_ENABLE: joi.boolean().truthy('true').falsy('false').default(true),
    HTTP_HOST: joi.string().default('0.0.0.0'),
    HTTP_PORT: joi.number().port().default(9005),
    HTTP_VERSIONING_ENABLE: joi.boolean().truthy('true').falsy('false').default(false),
    HTTP_VERSION: joi.number().valid(1, 2).default(1),
    SENTRY_DSN: joi.string().allow('').optional(),
    RABBITMQ_URL: joi.string().uri().default('amqp://guest:guest@localhost:5672'),
    GRPC_URL: joi.string().required(),
    GRPC_PACKAGE: joi.string().default('notifications'),
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
  grpcUrl: envVars.GRPC_URL,
  grpcPackage: envVars.GRPC_PACKAGE,

});

