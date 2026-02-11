---
name: monitoring-observability
description: Guidelines for implementing and managing monitoring, logging, and tracing with SigNoz.
---

# Monitoring & Observability Skill

This skill provides instructions for working with the SigNoz observability stack in this microservices project.

## Stack Components

- **SigNoz**: All-in-one observability UI (http://localhost:8080)
- **SigNoz OTel Collector**: Receives OTLP telemetry from microservices
- **ClickHouse**: Data storage for logs, traces, and metrics
- **ZooKeeper**: Coordination service for ClickHouse

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

Required in docker-compose.yml for each service:

```yaml
environment:
  - OTEL_SERVICE_NAME=users-service
  - OTEL_EXPORTER_OTLP_ENDPOINT=signoz-otel-collector:4317
  - OTEL_EXPORTER_OTLP_PROTOCOL=grpc
  - OTEL_EXPORTER_OTLP_INSECURE=true
```

## Accessing SigNoz

1. Open http://localhost:8080
2. Create admin user on first access
3. All data (logs, traces, metrics) is available in one unified UI

## Viewing Logs

In SigNoz → **Logs**:

- Filter by `service.name` to select a specific service
- Use search operators to filter log content
- Click on a log entry to see its attributes and jump to the associated trace

## Viewing Traces

In SigNoz → **Traces**:

- Filter by service name, duration, status code
- Click traces to see the flame graph with individual spans
- Traces are auto-correlated with logs via `trace_id`

## Viewing Metrics

In SigNoz → **Dashboards** or **Metrics Explorer**:

- Common metrics: `http.server.duration`, `system.cpu.utilization`
- Create custom dashboards from the UI

## Creating Dashboards

1. Go to **Dashboards** → **New Dashboard**
2. Add panels with metric, log, or trace queries
3. Save dashboard with descriptive name
4. Dashboards are stored in SigNoz's ClickHouse database

## Creating Alerts

1. Go to **Alerts** → **New Alert**
2. Choose alert type: Metric, Log, Trace, or Exceptions
3. Configure query, threshold, and notification channel
4. SigNoz supports Slack, Email, PagerDuty, and webhook notifications

## Troubleshooting

### No Data in SigNoz

1. Check SigNoz OTel Collector logs: `docker logs bw-signoz-otel-collector`
2. Verify collector health: `http://localhost:13133`
3. Verify services are sending telemetry (check service logs for OTLP errors)
4. Ensure ClickHouse is healthy: `docker-compose ps clickhouse`

### SigNoz UI Not Loading

1. Check if schema migrators completed: `docker-compose ps` (should show `Exited (0)`)
2. Check SigNoz logs: `docker logs bw-signoz`
3. Verify ClickHouse is running and healthy

### Missing Metrics

- Verify OpenTelemetry dependencies are installed
- Check `tracing.ts` is imported in `main.ts` before app bootstrap
- Confirm environment variables are set correctly

## Best Practices

- **Structured Logging**: Use JSON format for logs
- **Trace Context**: Propagate trace IDs across service boundaries
- **Meaningful Metrics**: Instrument business-critical operations
- **Alerts**: Set up alerts for error rates and latency thresholds via SigNoz UI
