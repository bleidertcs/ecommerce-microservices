"use client";

console.log("🔥 tracing.client.ts: File loaded");

export const initTracing = async () => {
  console.log("🔍 initTracing: Function entry");
  if (typeof window === "undefined") {
    console.log("🔍 initTracing: Server-side skip");
    return;
  }

  console.log("🔍 initTracing: Client-side execution starting...");

  try {
    console.log("📦 initTracing: Starting Promise.all for imports");
    const [
      sdkTraceWeb,
      sdkTraceBase,
      exporterOtlp,
      instrumentation,
      instrFetch,
      instrXhr,
      contextZone,
      resources,
      semconv,
    ] = await Promise.all([
      import("@opentelemetry/sdk-trace-web").catch(e => { console.error("❌ Failed import: sdk-trace-web", e); throw e; }),
      import("@opentelemetry/sdk-trace-base").catch(e => { console.error("❌ Failed import: sdk-trace-base", e); throw e; }),
      import("@opentelemetry/exporter-trace-otlp-http").catch(e => { console.error("❌ Failed import: exporter-otlp", e); throw e; }),
      import("@opentelemetry/instrumentation").catch(e => { console.error("❌ Failed import: instrumentation", e); throw e; }),
      import("@opentelemetry/instrumentation-fetch").catch(e => { console.error("❌ Failed import: instr-fetch", e); throw e; }),
      import("@opentelemetry/instrumentation-xml-http-request").catch(e => { console.error("❌ Failed import: instr-xhr", e); throw e; }),
      import("@opentelemetry/context-zone").catch(e => { console.error("❌ Failed import: context-zone", e); throw e; }),
      import("@opentelemetry/resources").catch(e => { console.error("❌ Failed import: resources", e); throw e; }),
      import("@opentelemetry/semantic-conventions").catch(e => { console.error("❌ Failed import: semconv", e); throw e; }),
    ]);

    const { WebTracerProvider } = sdkTraceWeb;
    const { SimpleSpanProcessor } = sdkTraceBase;
    const { OTLPTraceExporter } = exporterOtlp;
    const { registerInstrumentations } = instrumentation;
    const { FetchInstrumentation } = instrFetch;
    const { XMLHttpRequestInstrumentation } = instrXhr;
    const { ZoneContextManager } = contextZone;
    const { Resource } = resources;
    const { SEMRESATTRS_SERVICE_NAME } = semconv;

    console.log("✅ initTracing: OTel modules loaded successfully");

    const serviceName = "web-app";

    const provider = new WebTracerProvider({
      resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: serviceName,
      }),
    });

    const exporter = new OTLPTraceExporter({
      url: "http://localhost:4318/v1/traces",
    });

    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

    provider.register({
      contextManager: new ZoneContextManager(),
    });

    registerInstrumentations({
      instrumentations: [
        new FetchInstrumentation({
          propagateTraceHeaderCorsUrls: [
            /http:\/\/localhost:8010\/.*/,
            /http:\/\/localhost:8000\/.*/,
            /http:\/\/localhost:3000\/.*/,
            /http:\/\/localhost:3004\/.*/,
          ],
        }),
        new XMLHttpRequestInstrumentation({
          propagateTraceHeaderCorsUrls: [
            /http:\/\/localhost:8010\/.*/,
            /http:\/\/localhost:8000\/.*/,
            /http:\/\/localhost:3000\/.*/,
            /http:\/\/localhost:3004\/.*/,
          ],
        }),
      ],
    });

    console.log("🔭 initTracing: Web RUM Tracing initialized for", serviceName);
  } catch (error) {
    console.error("❌ initTracing: Fatal error during initialization:", error);
  }
};
