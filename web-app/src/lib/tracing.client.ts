import { trace, type Span, SpanStatusCode } from "@opentelemetry/api";

const tracerName = "web-app-client";

export const initTracing = async () => {
  if (typeof window === "undefined") return;

  try {
    const [
      { WebTracerProvider },
      { SimpleSpanProcessor },
      { OTLPTraceExporter },
      { registerInstrumentations },
      { FetchInstrumentation },
      { XMLHttpRequestInstrumentation },
      { ZoneContextManager },
      { Resource },
      { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION },
    ] = await Promise.all([
      import("@opentelemetry/sdk-trace-web"),
      import("@opentelemetry/sdk-trace-base"),
      import("@opentelemetry/exporter-trace-otlp-http"),
      import("@opentelemetry/instrumentation"),
      import("@opentelemetry/instrumentation-fetch"),
      import("@opentelemetry/instrumentation-xml-http-request"),
      import("@opentelemetry/context-zone"),
      import("@opentelemetry/resources"),
      import("@opentelemetry/semantic-conventions"),
    ]);

    const serviceName = "web-app";
    const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";
    const environment = process.env.NEXT_PUBLIC_ENV || "development";

    const provider = new WebTracerProvider({
      resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: serviceName,
        [SEMRESATTRS_SERVICE_VERSION]: appVersion,
        ["deployment.environment"]: environment,
      }),
    });

    const otlpEndpoint =
      process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT?.replace(/\/$/, "") ||
      "http://localhost:4318";

    const exporter = new OTLPTraceExporter({
      url: `${otlpEndpoint}/v1/traces`,
    });

    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register({ contextManager: new ZoneContextManager() });

    const corsUrls = [
      /http:\/\/localhost:8010\/.*/,
      /http:\/\/localhost:8000\/.*/,
      /http:\/\/localhost:3000\/.*/,
      /http:\/\/localhost:3004\/.*/,
    ];

    registerInstrumentations({
      instrumentations: [
        new FetchInstrumentation({ propagateTraceHeaderCorsUrls: corsUrls }),
        new XMLHttpRequestInstrumentation({ propagateTraceHeaderCorsUrls: corsUrls }),
      ],
    });

    console.log(`🔭 Web RUM Tracing initialized: ${serviceName} (${environment})`);
  } catch (error) {
    console.error("❌ initTracing failed:", error);
  }
};

/**
 * Helper to record business events as spans
 */
export const trackEvent = (name: string, attributes: Record<string, any> = {}) => {
  const tracer = trace.getTracer(tracerName);
  const span = tracer.startSpan(name, { attributes });
  span.end();
};
