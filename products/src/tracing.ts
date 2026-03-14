import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { credentials } from '@grpc/grpc-js';

// Enable OpenTelemetry diagnostics logging (WARN level in production)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'products-service',
  'service.version': process.env.OTEL_SERVICE_VERSION || process.env.npm_package_version || '0.0.0',
  'deployment.environment': process.env.DEPLOYMENT_ENVIRONMENT || process.env.NODE_ENV || 'development',
});

// Normalize endpoint: gRPC exporters in Node expect http://host:port format
const rawEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://signoz-otel-collector:4317';
const otlpEndpoint =
  rawEndpoint.startsWith('http://') || rawEndpoint.startsWith('https://')
    ? rawEndpoint
    : `http://${rawEndpoint}`;

// Insecure channel credentials for gRPC (required for non-TLS collectors)
const insecureCreds = credentials.createInsecure();

const traceExporter = new OTLPTraceExporter({
  url: otlpEndpoint,
  credentials: insecureCreds,
});

const logExporter = new OTLPLogExporter({
  url: otlpEndpoint,
  credentials: insecureCreds,
});

// Explicit metric exporter — prevents auto-instrumentation from creating
// an unconfigured PeriodicExportingMetricReader (which causes ECONNREFUSED)
const metricExporter = new OTLPMetricExporter({
  url: otlpEndpoint,
  credentials: insecureCreds,
});

export const otr_sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 60_000, // export every 60s
  }),
  logRecordProcessors: [new BatchLogRecordProcessor(logExporter)],
  instrumentations: [
    ...getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false, // Disable noisy fs instrumentation
      },
      '@opentelemetry/instrumentation-http': {
        enabled: true,
        ignoreIncomingRequestHook: (req) => {
          const url = req.url || '';
          return url === '/health' || url === '/api/health';
        },
      },
      '@opentelemetry/instrumentation-express': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-grpc': {
        enabled: false, // Disabled to avoid double-instrumentation issues
      },
    }).filter((instr) => !instr.instrumentationName.includes('grpc')),
    new WinstonInstrumentation(),
  ],
});

// Graceful shutdown
process.on('SIGTERM', () => {
  otr_sdk
    .shutdown()
    .then(() => console.log('Tracing, metrics, and logging terminated'))
    .catch((error) => console.error('Error terminating OpenTelemetry SDK', error))
    .finally(() => process.exit(0));
});

console.log(`OpenTelemetry SDK initialized → ${otlpEndpoint}`);
