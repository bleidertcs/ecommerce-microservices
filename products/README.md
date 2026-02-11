# Products Service (🏷️)

Este microservicio gestiona el catálogo de productos, inventario y reseñas en el sistema e-commerce.

## 🚀 Características

- **Catálogo de Productos**: CRUD completo de productos con categorías y atributos.
- **Gestión de Stock**: Seguimiento de inventario en tiempo real.
- **Integración SigNoz**: Instrumentación nativa para rastreo de latencia en consultas de catálogo.
- **Búsqueda Eficiente**: Implementación de filtros y paginación para optimizar la experiencia del usuario.

---

## 🏗️ Arquitectura y Tecnologías

- **Backend**: NestJS 10.
- **Persistencia**: PostgreSQL + Prisma ORM.
- **Caché**: Redis para respuestas rápidas de catálogo.
- **Observabilidad**: OpenTelemetry SDK + SigNoz.

---

## 🛠️ Configuración

### Variables de Entorno Clave

- `DATABASE_URL`: Conexión a Postgres.
- `OTEL_EXPORTER_OTLP_ENDPOINT`: IP del SigNoz Collector (172.18.0.15:4317).
- `REDIS_URL`: Endpoint de Redis para caché de productos.

---

## 📊 Observabilidad

Este servicio utiliza **SigNoz** para monitorizar el rendimiento de las búsquedas y la salud del catálogo:

1. Accede a `http://localhost:8080`.
2. Filtra por `service.name="products-service"`.
3. Revisa los **Trace Spans** para identificar consultas lentas a la base de datos o Redis.

---

## 📊 Salud y Documentación

- **Endpoint de salud**: `http://localhost:9002/health`
- **Swagger**: `http://localhost:9002/api/v1/docs`
