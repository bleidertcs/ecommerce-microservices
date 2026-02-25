import { registerOTel } from '@vercel/otel';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// Enable OpenTelemetry debug logging if needed
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);

export function register() {
  registerOTel({
    serviceName: process.env.OTEL_SERVICE_NAME || 'web-app',
  });
}
