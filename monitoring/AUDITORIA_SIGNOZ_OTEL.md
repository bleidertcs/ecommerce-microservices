# Auditoría de Observabilidad SigNoz/OpenTelemetry

Auditoría exhaustiva de la configuración de **métricas, traces, logs y eventos** del monorepo frente a mejores prácticas DevOps/OTEL y compatibilidad con SigNoz.

---

## 1. Resumen Ejecutivo

| Aspecto | Valor |
|---------|--------|
| **Estado general** | Parcial |
| **Score** | 7/10 |
| **Conclusión** | La base está bien implementada: trazas, logs y métricas se exportan por OTLP al collector; propagación W3C y Kong integrado. Faltan atributos de recurso (`service.version`, `deployment.environment`), URL del frontend configurable, eventos personalizados y métricas RED explícitas en código. Con las mejoras propuestas se alcanza un nivel adecuado para producción. |

---

## 2. Análisis Detallado

### 2.1 Métricas (Metrics)

| Criterio | Verdicto | Detalle |
|----------|----------|---------|
| Métricas esenciales (RED, host) | Parcial | RED derivada de spans vía `signozspanmetrics/delta` en el collector (latency buckets p50/p95/p99). Host (CPU, memoria, disco, red) vía `hostmetrics` en collector. No hay contadores/gauges/histogramas custom en código. |
| Contadores, gauges, histograms | Parcial | Auto-instrumentación Node (runtime, HTTP) exporta métricas. Collector genera histogramas de latencia desde trazas. Falta métricas de negocio (ej. `orders.created.total`). |
| Atributos semánticos | Parcial | Collector usa `service.name`, `deployment.environment`, `host.name`. En SDK solo se envía `service.name`; faltan `service.version` y `deployment.environment` en el resource. |
| Exporter OTLP | Correcto | `OTLPMetricExporter` gRPC a `OTEL_EXPORTER_OTLP_ENDPOINT` (4317). `PeriodicExportingMetricReader` cada 60s. |
| Sampling / límites | Parcial | Batch en collector (send_batch_size 10000, timeout 10s). No hay sampling adaptativo ni límites de cardinalidad en SDK. |

**Citas de código:**  
- `orders/src/tracing.ts`: `metricReader: new PeriodicExportingMetricReader({ exporter: metricExporter, exportIntervalMillis: 60_000 })`  
- `monitoring/signoz/otel-collector-config.yaml`: `signozspanmetrics/delta`, `hostmetrics`, pipelines `metrics`, `metrics/host`

### 2.2 Traces (Rastros)

| Criterio | Verdicto | Detalle |
|----------|----------|---------|
| Propagación (Traceparent, Baggage) | Correcto | Kong CORS incluye `traceparent`, `tracestate`, `baggage`. Auto-instrumentación HTTP/Express propaga contexto. |
| Spans HTTP/DB/external | Correcto | HTTP y Express instrumentados; health excluido (`/health`, `/api/health`). gRPC deshabilitado en Node para evitar doble instrumentación. |
| Atributos ricos (user.id, error) | Parcial | Atributos estándar de HTTP. No se añaden `user.id` ni atributos de negocio en spans manuales. |
| Sampling | Parcial | Sin sampling explícito; se exporta todo. |
| Instrumentación auto/manual | Parcial | Auto-instrumentación correcta. No hay spans manuales para hitos (order.created, user.login). |

**Citas de código:**  
- `kong/config.yml`: `headers: [..., traceparent, tracestate, baggage]`  
- `orders/src/tracing.ts`: `ignoreIncomingRequestHook: (req) => url === '/health' || url === '/api/health'`

### 2.3 Logs

| Criterio | Verdicto | Detalle |
|----------|----------|---------|
| Estructurados (JSON) + trace_id/span_id | Correcto | Winston con `format.json()` y `OpenTelemetryTransportV3`; `WinstonInstrumentation` correlaciona logs con trazas. |
| Niveles y contexto | Correcto | Niveles estándar (debug, info, warn, error) vía Nest Logger; timestamp y contexto en formato. |
| Exporter OTLP + batch | Correcto | `OTLPLogExporter` gRPC; `BatchLogRecordProcessor`. Collector pipeline `logs` con batch. |
| Logs sampled | N/A | Volumen moderado; no se aplica sampling de logs. |

**Citas de código:**  
- `orders/src/main.ts`: `OpenTelemetryTransportV3()`, `winston.format.json()`  
- `orders/src/tracing.ts`: `logRecordProcessors: [new BatchLogRecordProcessor(logExporter)]`

### 2.4 Eventos y Otros

| Criterio | Verdicto | Detalle |
|----------|----------|---------|
| Eventos personalizados | Ausente | No hay spans de evento o logs estructurados para hitos (user.login, order.created, deployment). |
| Health / SLIs-SLOs | Parcial | Health checks en servicios y collector (13133). No hay SLOs definidos en SigNoz ni alertas de latencia/errores. |

### 2.5 Configuración General

| Criterio | Verdicto | Detalle |
|----------|----------|---------|
| Recursos OTEL (service.name, version, env) | Parcial | Solo `service.name` en SDK. Faltan `service.version` y `deployment.environment`. |
| Seguridad (TLS, auth) | Parcial | Canal inseguro (`credentials.createInsecure()`) hacia el collector; aceptable en desarrollo. |
| Batch, timeouts, retries | Correcto | Collector: batch 10k, timeout 10s. SDK: export cada 60s para métricas. |
| Compatibilidad SigNoz (4317, 4318) | Correcto | Backend: gRPC 4317. Frontend: HTTP 4318; URL hardcodeada en `tracing.client.ts`. |

---

## 3. Código Mejorado

### 3.1 Resource con `service.version` y `deployment.environment` (tracing.ts)

En cada microservicio (`orders`, `users`, `products`, `cart`, `notifications`, `payments`), sustituir el resource actual por uno que incluya atributos semánticos adicionales:

```diff
 const resource = resourceFromAttributes({
   [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'orders-service',
+  'service.version': process.env.OTEL_SERVICE_VERSION || process.env.npm_package_version || '0.0.0',
+  'deployment.environment': process.env.DEPLOYMENT_ENVIRONMENT || process.env.NODE_ENV || 'development',
 });
```

Variables recomendadas en `docker-compose` (por servicio):  
`OTEL_SERVICE_VERSION`, `DEPLOYMENT_ENVIRONMENT` (o `NODE_ENV`).

### 3.2 URL OTLP configurable en frontend (tracing.client.ts)

Sustituir la URL fija por variable de entorno con fallback:

```diff
-    const exporter = new OTLPTraceExporter({
-      url: "http://localhost:4318/v1/traces",
-    });
+    const otlpEndpoint =
+      typeof process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT !== 'undefined'
+        ? process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT.replace(/\/$/, '')
+        : 'http://localhost:4318';
+    const exporter = new OTLPTraceExporter({
+      url: `${otlpEndpoint}/v1/traces`,
+    });
```

En `web-app/.env`:  
`NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318` (desarrollo). En Docker, usar la URL del collector accesible desde el navegador (ej. `http://localhost:4318` si se expone el puerto).

### 3.3 (Opcional) Span manual para evento `order.created`

En `orders.service.ts`, al crear la orden correctamente, añadir un span con atributos de negocio:

```typescript
import { trace } from '@opentelemetry/api';

// Tras crear la orden en la transacción (antes del return):
const tracer = trace.getTracer('orders-service', process.env.OTEL_SERVICE_VERSION || '0.0.0');
const span = tracer.startSpan('order.created', {
  attributes: {
    'order.id': order.id,
    'order.total': order.total,
    'user.id': userId,
  },
});
span.end();
```

Esto permite filtrar en SigNoz por el evento `order.created` y por atributos como `user.id`.

---

## 4. Pasos de Implementación

1. **Resource attributes (backend)**  
   - Editar `tracing.ts` en: `orders`, `users`, `products`, `cart`, `notifications`, `payments`.  
   - Añadir las dos líneas del diff 3.1 al objeto `resourceFromAttributes`.  
   - Opcional: en `docker-compose.yml`, para cada servicio, añadir en `environment`:  
     `OTEL_SERVICE_VERSION=1.0.0`, `DEPLOYMENT_ENVIRONMENT=local`.

2. **Frontend OTLP URL**  
   - Editar `web-app/src/lib/tracing.client.ts` según el diff 3.2.  
   - En `web-app/.env` (o `.env.local`) definir:  
     `NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318`.  
   - Rebuild de la web-app: `pnpm build` o `docker-compose up -d --build web-app`.

3. **Span opcional order.created**  
   - En `orders/src/modules/orders/orders.service.ts`, añadir `import { trace } from '@opentelemetry/api'` y el bloque del span tras crear la orden.  
   - Reiniciar `orders-service`.

4. **Verificación en SigNoz**  
   - Trazas: filtrar por `service.name` y, tras los cambios, por `deployment.environment`.  
   - Logs: comprobar que siguen llegando y que la correlación con trazas funciona.  
   - Métricas: en Metrics Explorer, comprobar `http.server.duration` y métricas de host.  
   - Si se añade el span: en Traces, buscar por nombre de span `order.created` o por atributo `order.id`.

5. **Health del collector**  
   - `curl -s http://localhost:13133` (o el puerto expuesto del health_check del collector).

---

## 5. Mejoras Avanzadas

- **Sampling:** En producción, valorar sampling head-based (ej. 10–20 %) o tail-based para reducir volumen manteniendo trazas de error. Configurable en SDK con `ParentBasedSampler` o en el collector.
- **SLOs en SigNoz:** Definir SLOs de latencia (p99 &lt; 2s) y tasa de error (&lt; 0.1 %) en la sección Alerts y crear dashboards asociados.
- **Dashboards:** Crear un dashboard por servicio con: request rate, error rate, latencia p50/p95/p99 (RED) y, si se añaden, métricas de negocio (órdenes creadas, etc.).
- **TLS al collector:** En producción, exponer el collector con TLS y configurar en los servicios `OTEL_EXPORTER_OTLP_ENDPOINT=https://...` y credenciales adecuadas (no usar `createInsecure()`).
- **OTEL_RESOURCE_ATTRIBUTES:** Alternativa a variables sueltas: en `docker-compose` definir una sola variable  
  `OTEL_RESOURCE_ATTRIBUTES=service.name=orders-service,service.version=1.0.0,deployment.environment=local`  
  y usar el resource por defecto del SDK (que lee esta variable si se usa el constructor estándar de Resource).
- **Eventos adicionales:** Considerar spans o logs estructurados para `user.login`, `user.logout`, `payment.completed` para análisis de funnel y soporte.

---

## Referencias

- [GUIA_OBSERVABILIDAD.md](./GUIA_OBSERVABILIDAD.md) — Guía operativa del stack SigNoz en el repo.
- [observability-signoz.mdc](../.cursor/rules/observability-signoz.mdc) — Reglas Cursor para observabilidad.
- Configuración del collector: [monitoring/signoz/otel-collector-config.yaml](./signoz/otel-collector-config.yaml).
