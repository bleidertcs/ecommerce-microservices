# Guía de Observabilidad (SigNoz)

Este repositorio utiliza **SigNoz** como plataforma all-in-one de observabilidad, basada en **OpenTelemetry** de forma nativa.

## Componentes del Stack

| Componente                | Contenedor                 | Puerto    | Descripción                           |
| ------------------------- | -------------------------- | --------- | ------------------------------------- |
| **SigNoz**                | `bw-signoz`                | 8080      | UI + API de observabilidad            |
| **SigNoz OTel Collector** | `bw-signoz-otel-collector` | 4317/4318 | Receptor OTLP (gRPC/HTTP)             |
| **ClickHouse**            | `bw-clickhouse`            | -         | Database para logs, trazas y métricas |
| **ZooKeeper**             | `bw-zookeeper`             | -         | Coordinación requerida por ClickHouse |

## Cómo levantar el stack

```bash
docker-compose up -d --build
```

### Acceso

- **SigNoz UI**: `http://localhost:8080`

> Al acceder por primera vez, SigNoz pedirá crear un usuario administrador.

## Integración técnica en NestJS

### 1. Tracing

Se utiliza el SDK de OpenTelemetry (`otr_sdk`) en `src/tracing.ts`. Se inicializa en `main.ts` antes de arrancar la aplicación para capturar instrumentaciones automáticas (HTTP, gRPC, Prisma, Redis).

**Configuración en `docker-compose.yml`:**

```yaml
environment:
  - OTEL_SERVICE_NAME=mi-servicio
  - OTEL_EXPORTER_OTLP_ENDPOINT=signoz-otel-collector:4317
  - OTEL_EXPORTER_OTLP_PROTOCOL=grpc
  - OTEL_EXPORTER_OTLP_INSECURE=true
```

### 2. Logs

Se usa `winston` con `nest-winston` para emitir logs en formato JSON. El `OpenTelemetryTransportV3` de `@opentelemetry/winston-transport` envía los logs al OTel Collector vía OTLP, que los almacena en ClickHouse.

Los logs incluyen automáticamente el `trace_id`, permitiendo correlación directa con trazas en SigNoz.

### 3. Métricas

Las métricas se exportan vía OTLP desde el SDK de OpenTelemetry directamente al SigNoz OTel Collector. **No se necesita Prometheus ni prom-client.**

## Cómo usar SigNoz

### Trazas

1. Ir a **Traces** en el menú lateral
2. Filtrar por `service.name` para seleccionar el microservicio
3. Hacer clic en una traza para ver el flame graph y spans individuales

### Logs

1. Ir a **Logs** en el menú lateral
2. Usar filtros como `service.name=users-service` para acotar resultados
3. Hacer clic en un log para ver sus atributos y saltar a la traza asociada

### Métricas

1. Ir a **Dashboards** → crear un nuevo dashboard o usar los precreados
2. Usar **Metrics Explorer** para buscar métricas como:
   - `http.server.duration` — Duración de requests HTTP
   - `system.cpu.utilization` — Uso de CPU
   - `runtime.nodejs.heap.size` — Tamaño del heap de Node.js

### Alertas

1. Ir a **Alerts** → **New Alert**
2. Seleccionar el tipo de alerta (Metric, Log, Trace, Exceptions)
3. Configurar la query, umbral y canales de notificación

## Extensión para nuevos servicios

Para cada nuevo microservicio:

1. **Copia `src/tracing.ts`** desde cualquier servicio existente.

2. **Importa e inicializa en `main.ts`:**

   ```typescript
   import { otr_sdk } from "./tracing";
   otr_sdk.start();
   // ... resto del código
   ```

3. **Añade en `docker-compose.yml`:**

   ```yaml
   mi-servicio:
     # ... configuración base
     environment:
       - OTEL_SERVICE_NAME=mi-servicio
       - OTEL_EXPORTER_OTLP_ENDPOINT=signoz-otel-collector:4317
       - OTEL_EXPORTER_OTLP_PROTOCOL=grpc
       - OTEL_EXPORTER_OTLP_INSECURE=true
   ```

## Solución de problemas

### Las trazas no aparecen

1. Verifica que `OTEL_EXPORTER_OTLP_ENDPOINT` apunte a `signoz-otel-collector:4317`
2. Comprueba que `OTEL_EXPORTER_OTLP_INSECURE=true` esté configurado
3. Revisa los logs del collector: `docker-compose logs signoz-otel-collector`
4. Verifica estado del collector: `http://localhost:13133` (health check)

### SigNoz UI no carga

1. Verifica que ClickHouse esté healthy: `docker-compose ps clickhouse`
2. Revisa logs: `docker-compose logs signoz`
3. Los schema migrators deben completarse exitosamente antes de que SigNoz arranque

### ClickHouse errores de conexión

1. Verifica que ZooKeeper esté healthy: `docker-compose ps zookeeper`
2. Los schema migrators se ejecutan una vez y terminan — es normal que aparezcan como `Exited (0)`
