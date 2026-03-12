# Users Service (👤)

Este microservicio gestiona la identidad, perfiles y seguridad de los usuarios en el ecosistema e-commerce.

## 🚀 Características

- **Gestión de Perfiles**: CRUD completo de usuarios con roles y permisos.
- **Autenticación gRPC**: Provee métodos síncronos para validación de identidad a otros servicios.
- **Seguridad**: Integración con Casdoor para la gestión de identidades centralizada.
- **Observabilidad Nativa**: Exportación de logs, trazas y métricas directamente a SigNoz.

---

## 🏗️ Arquitectura y Tecnologías

- **Backend**: NestJS 10.
- **Persistencia**: PostgreSQL + Prisma ORM.
- **Observabilidad**: OpenTelemetry SDK + SigNoz.
- **Inter-comunicación**: Servidor gRPC para peticiones síncronas.

---

## 🛠️ Configuración

### Variables de Entorno Clave

- `DATABASE_URL`: Conexión a Postgres.
- `OTEL_EXPORTER_OTLP_ENDPOINT`: IP del SigNoz Collector (172.18.0.15:4317).
- `REDIS_URL`: Endpoint de Redis para caché de sesiones.

---

## 📊 Observabilidad

Este servicio está instrumentado con **OpenTelemetry**. Puedes ver su rendimiento en tiempo real en **SigNoz**:

1. Accede a `http://localhost:8080`.
2. Filtra por `service.name="users-service"`.
3. Explora **Logs** y **Traces** correlacionados.

---

## 📊 Salud y Documentación

- **Endpoint de salud**: `http://localhost:9001/health`
- **Swagger**: `http://localhost:9001/api/v1/docs`
