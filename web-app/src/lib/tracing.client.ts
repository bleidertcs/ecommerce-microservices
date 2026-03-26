import { trace, type Span, SpanStatusCode } from "@opentelemetry/api";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";

// --- Configuration & Constants ---
const SERVICE_NAME = "web-app";
const TRACER_NAME = "web-app-client";

const CORS_URLS = [
  /http:\/\/localhost:8010\/.*/,
  /http:\/\/localhost:8000\/.*/,
  /http:\/\/localhost:3000\/.*/,
  /http:\/\/localhost:3004\/.*/,
];

// --- State ---
let isInitialized = false;

/**
 * Initializes OpenTelemetry tracing for the browser (RUM).
 * Uses dynamic imports to avoid bundling Node.js SDKs in the client.
 */
export const initTracing = async () => {
  if (typeof window === "undefined" || isInitialized) return;

  try {

    const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";
    const environment = process.env.NEXT_PUBLIC_ENV || "development";
    const otlpEndpoint = 
      process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT?.replace(/\/$/, "") || 
      "http://localhost:4318";

    const exporter = new OTLPTraceExporter({
      url: `${otlpEndpoint}/v1/traces`,
    });

    const provider = new WebTracerProvider({
      resource: resourceFromAttributes({
        [SEMRESATTRS_SERVICE_NAME]: SERVICE_NAME,
        [SEMRESATTRS_SERVICE_VERSION]: appVersion,
        ["deployment.environment"]: environment,
      }),
      spanProcessors: [new SimpleSpanProcessor(exporter)],
    });

    provider.register({ 
      contextManager: new ZoneContextManager() 
    });

    registerInstrumentations({
      instrumentations: [
        new FetchInstrumentation({ propagateTraceHeaderCorsUrls: CORS_URLS }),
        new XMLHttpRequestInstrumentation({ propagateTraceHeaderCorsUrls: CORS_URLS }),
      ],
    });

    isInitialized = true;
    console.log(`🔭 Web RUM Tracing initialized: ${SERVICE_NAME} (${environment})`);
  } catch (error) {
    console.error("❌ initTracing failed:", error);
  }
};

/**
 * Helper to record business events as spans.
 * Automatically handles tracer retrieval and span lifecycle.
 */
export const trackEvent = (name: string, attributes: Record<string, any> = {}) => {
  if (!isInitialized) return;
  
  const tracer = trace.getTracer(TRACER_NAME);
  tracer.startActiveSpan(name, { attributes }, (span: Span) => {
    try {
      span.setStatus({ code: SpanStatusCode.OK });
    } finally {
      span.end();
    }
  });
};
