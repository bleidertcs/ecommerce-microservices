# Guía de Observabilidad (Grafana Stack)

Este repositorio ha sido integrado con un stack completo de observabilidad basado en Grafana.

## Componentes del Stack

| Componente     | Puerto     | Descripción                                |
| -------------- | ---------- | ------------------------------------------ |
| **Grafana**    | 3000       | Visualización de logs, métricas y trazas   |
| **Loki**       | 3100       | Almacenamiento centralizado de logs        |
| **Promtail**   | -          | Agente recolector de logs de Docker        |
| **Tempo**      | 3200, 4317 | Almacenamiento de trazas distribuidas      |
| **Mimir**      | 9009       | Almacenamiento de métricas a largo plazo   |
| **Prometheus** | 9090       | Scraper de métricas (remote-write a Mimir) |

## Cómo levantar el stack

```bash
docker-compose up -d --build
```

### Accesos

- **Grafana**: `http://localhost:3000` (User: `admin`, Pass: `admin`)
- **Prometheus**: `http://localhost:9090`
- **Loki API**: `http://localhost:3100`
- **Tempo API**: `http://localhost:3200`
- **Mimir API**: `http://localhost:9009`

## Integración técnica en NestJS

### 1. Tracing (Tempo)

Se utiliza el SDK de OpenTelemetry (`otr_sdk`) en `src/tracing.ts`. Se inicializa en el `main.ts` antes de que arranque la aplicación para capturar todas las instrumentaciones automáticas (HTTP, gRPC, Prisma, Redis).

**Configuración requerida en `docker-compose.yml`:**

```yaml
environment:
  - OTEL_SERVICE_NAME=mi-servicio
  - OTEL_EXPORTER_OTLP_ENDPOINT=tempo:4317
  - OTEL_EXPORTER_OTLP_INSECURE=true # Requerido para conexión sin TLS
```

> **Importante**: La variable `OTEL_EXPORTER_OTLP_INSECURE=true` es **obligatoria** para que el exportador gRPC se conecte correctamente a Tempo en un entorno de desarrollo sin TLS.

### 2. Logs (Loki)

Se ha configurado `winston` con `nest-winston` para emitir logs en formato JSON por la consola. Promtail lee estos logs y les añade etiquetas como `service_name` y `container_name`.

Los logs incluyen automáticamente el `trace_id` generado por OpenTelemetry, permitiendo correlacionar logs con trazas.

### 3. Métricas (Prometheus/Mimir)

El SDK de OpenTelemetry expone un endpoint de métricas en el puerto `9464`. Prometheus hace scrape de cada microservicio en sus respectivos puertos.

**Puertos de métricas:**

- `auth-service`: Puerto host `9464`
- `post-service`: Puerto host `9465`

## Dashboards Incluidos

En Grafana encontrarás dashboards pre-configurados para:

- **Logs de Microservicios**: Filtra por contenedor y busca dentro de los logs.
- **Métricas NestJS**: Visualiza el uso de CPU, Memoria y rate de peticiones HTTP.
- **Tracing**: Integrado en el visor de logs (puedes saltar de un log a su traza correspondiente).

## Cómo usar Tempo (Trazas)

### Búsqueda por TraceQL

En Grafana → Explore → Tempo, usa la sintaxis TraceQL:

```
{resource.service.name="auth-service"}
```

> **Nota**: Los valores con guiones (como `auth-service`) **deben ir entre comillas dobles**.

### Búsqueda visual

1. En Grafana, ve a **Explore** → selecciona **Tempo**.
2. Cambia a la pestaña **Search**.
3. Selecciona "Service Name" y elige tu servicio de la lista.
4. Haz clic en **Run Query**.

### Correlación Logs → Trazas

Los logs en Loki incluyen un campo `trace_id`. Al hacer clic en un log, verás un enlace directo para saltar a la traza correspondiente en Tempo.

## Extensión para nuevos servicios

Para cada nuevo microservicio:

1. **Copia el archivo `src/tracing.ts`** desde auth o post service.

2. **Importa e inicializa el SDK en `main.ts`:**

   ```typescript
   import { otr_sdk } from "./tracing";
   otr_sdk.start();
   // ... resto del código
   ```

3. **Añade el servicio a `docker-compose.yml`:**

   ```yaml
   mi-servicio:
     # ... configuración base
     ports:
       - "XXXX:XXXX" # Puerto HTTP
       - "YYYY:9464" # Puerto Métricas (único por servicio)
     environment:
       - OTEL_SERVICE_NAME=mi-servicio
       - OTEL_EXPORTER_OTLP_ENDPOINT=tempo:4317
       - OTEL_EXPORTER_OTLP_INSECURE=true
   ```

4. **Añade el job de scrape en `monitoring/prometheus/prometheus.yml`:**
   ```yaml
   - job_name: "mi-servicio"
     metrics_path: "/metrics"
     static_configs:
       - targets: ["mi-servicio:9464"]
   ```

## Solución de problemas comunes

### Las trazas no aparecen en Tempo

1. Verifica que `OTEL_EXPORTER_OTLP_INSECURE=true` esté configurado.
2. Comprueba que el endpoint sea `tempo:4317` (sin `http://`).
3. Revisa los logs del microservicio buscando errores de conexión gRPC.

### Error "unknown identifier" en TraceQL

Asegúrate de usar comillas dobles en valores con caracteres especiales:

- ❌ `{resource.service.name=auth-service}`
- ✅ `{resource.service.name="auth-service"}`

### Loki no recibe logs

1. Verifica que Promtail esté corriendo: `docker-compose logs promtail`
2. Reinicia Promtail después de reiniciar Loki: `docker-compose restart promtail`

### Mimir muestra "connection refused"

Asegúrate de que Mimir esté iniciado con el flag `-target=all` para modo all-in-one.
