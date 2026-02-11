# Orders Service (🛒)

Este microservicio orquestra la creación y gestión de pedidos, garantizando la consistencia mediante patrones de resiliencia y eventos asíncronos.

## 🚀 Características

- **Gestión de Pedidos**: Ciclo de vida completo desde la creación hasta el cumplimiento.
- **Patrones de Resiliencia**: Implementación de **Circuit Breaker** y **Transactional Outbox**.
- **Comunicación Híbrida**: Usa gRPC/TCP/NATS para consultas síncronas y RabbitMQ para eventos.
- **Observabilidad Avanzada**: Trazado distribuido completo para rastrear pedidos a través de múltiples servicios.

---

## 🏗️ Arquitectura y Tecnologías

- **Backend**: NestJS 10.
- **Persistencia**: PostgreSQL + Prisma ORM.
- **Messaging**: RabbitMQ + NATS.
- **Observabilidad**: OpenTelemetry SDK + SigNoz.

---

## 🛠️ Configuración

### Variables de Entorno Clave

- `DATABASE_URL`: Conexión a Postgres.
- `OTEL_EXPORTER_OTLP_ENDPOINT`: IP del SigNoz Collector (172.18.0.15:4317).
- `RABBITMQ_URL`: Endpoint de RabbitMQ para publicación de eventos.

---

## 📊 Observabilidad

Este servicio es crítico para el flujo de negocio. Puedes monitorizar la creación de pedidos en **SigNoz**:

1. Accede a `http://localhost:8080`.
2. Filtra por `service.name="orders-service"`.
3. Usa la vista de **Traces** para visualizar cómo una orden invoca a los servicios de `Users` y `Products`.

---

## 📊 Salud y Documentación

- **Endpoint de salud**: `http://localhost:9003/health`
- **Swagger**: `http://localhost:9003/api/v1/docs`
