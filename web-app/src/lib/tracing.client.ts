"use client";

export const initTracing = async () => {
  if (typeof window === "undefined") return;

  try {
    const [
      { WebTracerProvider },
      { BatchSpanProcessor },
      { OTLPTraceExporter },
      { registerInstrumentations },
      { FetchInstrumentation },
      { XMLHttpRequestInstrumentation },
      { ZoneContextManager },
      { Resource },
      { SEMRESATTRS_SERVICE_NAME },
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

    const provider = new WebTracerProvider({
      resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: serviceName,
      }),
    });

    const exporter = new OTLPTraceExporter({
      url: "http://localhost:4318/v1/traces",
    });

    provider.addSpanProcessor(new BatchSpanProcessor(exporter));

    provider.register({
      contextManager: new ZoneContextManager(),
    });

    registerInstrumentations({
      instrumentations: [
        new FetchInstrumentation({
          propagateTraceHeaderCorsUrls: [
            /http:\/\/localhost:8000\/.*/, // Kong Gateway
          ],
        }),
        new XMLHttpRequestInstrumentation({
          propagateTraceHeaderCorsUrls: [
            /http:\/\/localhost:8000\/.*/, // Kong Gateway
          ],
        }),
      ],
    });

    console.log("🔭 Web RUM Tracing initialized for", serviceName);
  } catch (error) {
    console.error("❌ Failed to initialize Web RUM Tracing:", error);
  }
};
