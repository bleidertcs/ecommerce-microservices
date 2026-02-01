---
name: monitoring-observability
description: Guidelines for implementing and managing monitoring, logging, and tracing with Grafana stack.
---

# Monitoring & Observability Skill

This skill provides instructions for working with the Grafana observability stack in this microservices project.

## Stack Components

- **Grafana**: Visualization and dashboards (http://localhost:3000)
- **Loki**: Log aggregation and query
- **Tempo**: Distributed tracing
- **Mimir**: Metrics storage (Prometheus-compatible)
- **OpenTelemetry Collector**: Metrics and traces collection
- **Alertmanager**: Alert management

## OpenTelemetry Integration

### Service Instrumentation

Each service is instrumented with OpenTelemetry SDK. The configuration is in `src/tracing.ts`:

```typescript
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
// ... other imports

const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader,
  instrumentations: [getNodeAutoInstrumentations()],
});
```

### Environment Variables

Required in each service's `.env.docker`:

```env
OTEL_SERVICE_NAME=users-service
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
OTEL_EXPORTER_OTLP_INSECURE=true
```

## Accessing Grafana

1. Open http://localhost:3000
2. Login with `admin` / `admin`
3. Data sources are pre-configured:
   - Loki (logs)
   - Tempo (traces)
   - Mimir (metrics)

## Viewing Logs

Using Loki in Grafana Explore:

```logql
{service_name="users-service"} |= "error"
{service_name="products-service"} | json | line_format "{{.message}}"
```

## Viewing Traces

Using Tempo in Grafana Explore or via trace ID from logs.

## Viewing Metrics

Using Mimir/Prometheus queries:

```promql
http_request_duration_seconds_bucket{service_name="orders-service"}
rate(http_requests_total[5m])
```

## Creating Dashboards

1. Go to Dashboards > New Dashboard
2. Add panels with queries to Loki/Tempo/Mimir
3. Save dashboard with descriptive name
4. Export JSON to `monitoring/grafana/provisioning/dashboards/`

## Troubleshooting

### No Data in Grafana

1. Check OTEL Collector logs: `docker logs bw-otel-collector`
2. Verify services are sending telemetry (check service logs)
3. Ensure data source connections in Grafana are healthy

### Missing Metrics

- Verify OpenTelemetry dependencies are installed
- Check `tracing.ts` is imported in `main.ts` before app bootstrap
- Confirm environment variables are set correctly

## Best Practices

- **Structured Logging**: Use JSON format for logs
- **Trace Context**: Propagate trace IDs across service boundaries
- **Meaningful Metrics**: Instrument business-critical operations
- **Alerts**: Set up alerts for error rates and latency thresholds
