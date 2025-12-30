# Guía de Observabilidad (Grafana Stack)

Este repositorio ha sido integrado con un stack completo de observabilidad basado en Grafana.

## Componentes del Stack

1.  **Loki**: Almacenamiento centralizado de logs. Los microservicios envían logs en formato JSON que Loki indexa automáticamente.
2.  **Promtail**: Agente que recolecta los logs de los contenedores Docker y los envía a Loki.
3.  **Tempo**: Almacenamiento de trazas distribuidas (Distributed Tracing). Permite ver el camino de una petición a través de múltiples servicios.
4.  **Mimir**: Almacenamiento de métricas a largo plazo, compatible con Prometheus.
5.  **Prometheus**: Scraper de métricas que luego las envía (remote-write) a Mimir.
6.  **Grafana**: Herramienta de visualización donde se consolidan logs, métricas y trazas.

## Cómo levantar el stack

Para levantar todos los servicios de infraestructura y los microservicios, ejecuta:

```bash
docker-compose up -d --build
```

Esto levantará los siguientes puertos clave:

- **Grafana**: `http://localhost:3000` (User: `admin`, Pass: `admin`)
- **Prometheus**: `http://localhost:9090`
- **Loki API**: `http://localhost:3100`
- **Mimir API**: `http://localhost:9009`

## Integración técnica en NestJS

### 1. Tracing (Tempo)

Se utiliza el SDK de OpenTelemetry (`otr_sdk`) en `src/tracing.ts`. Se inicializa en el `main.ts` antes de que arranque la aplicación para capturar todas las instrumentaciones automáticas (HTTP, gRPC, Prisma, Redis).

### 2. Logs (Loki)

Se ha configurado `winston` con `nest-winston` para emitir logs en formato JSON por la consola. Promtail lee estos logs y les añade etiquetas como `service_name` y `container_name`.

### 3. Métricas (Prometheus/Mimir)

El SDK de OpenTelemetry también expone un endpoint de métricas en el puerto `9464` (por defecto) o integrado en el microservicio. Prometheus hace scrape de cada microservicio en sus respectivos puertos HTTP.

## Dashboards Incluidos

En Grafana encontrarás dashboards pre-configurados para:

- **Logs de Microservicios**: Filtra por contenedor y busca dentro de los logs.
- **Métricas NestJS**: Visualiza el uso de CPU, Memoria y rate de peticiones HTTP.
- **Tracing**: Integrado en el visor de logs (puedes saltar de un log a su traza correspondiente).

## Cómo probar

1.  Realiza una petición a la API Gateway (o microservicios directamente).
2.  Abre Grafana (`http://localhost:3000`).
3.  Ve a "Explore" y selecciona el Data Source **Loki** para ver logs.
4.  Busca un `traceId` en los logs y haz clic en el enlace lateral para ver la traza completa en **Tempo**.
5.  Selecciona el Data Source **Prometheus** o **Mimir** para ver gráficas de métricas.

## Extensión para nuevos servicios

Para cada nuevo microservicio:

1.  Copia el archivo `src/tracing.ts`.
2.  Importa e inicializa `otr_sdk` en `main.ts`.
3.  Añade el servicio a `docker-compose.yml` con las etiquetas (labels) de logging y variables de entorno de OTEL.
4.  Añade el job de scrape en `monitoring/prometheus/prometheus.yml`.
