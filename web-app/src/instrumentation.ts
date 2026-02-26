import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const sdk = new NodeSDK({
      resource: new Resource({
        'service.name': process.env.OTEL_SERVICE_NAME || 'web-app',
      }),
      traceExporter: new OTLPTraceExporter({
        // SigNoz OTLP HTTP receiver on port 4318
        url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://signoz-otel-collector:4318'}/v1/traces`,
      }),
      instrumentations: [
        new FetchInstrumentation(),
      ],
    });
    sdk.start();
  }
}
