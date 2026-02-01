import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { PeriodicExportingMetricReader, MeterProvider } from '@opentelemetry/sdk-metrics';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { diag, DiagConsoleLogger, DiagLogLevel, metrics } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';

// Enable OpenTelemetry debug logging
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const resource = new Resource({
  [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'nestjs-service',
});

const traceExporter = new OTLPTraceExporter();
const metricExporter = new OTLPMetricExporter();

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 15000, // Reduced to 15 seconds for faster updates
});

export const otr_sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
      // Enable HTTP instrumentation to generate metrics
      '@opentelemetry/instrumentation-http': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-express': {
        enabled: true,
      },
    }),
  ],
});

// Graceful shutdown
process.on('SIGTERM', () => {
  otr_sdk.shutdown()
    .then(() => console.log('Tracing and metrics terminated'))
    .catch((error) => console.error('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

console.log('OpenTelemetry SDK initialized with metrics export interval: 15s');
