# Payments Service

Microservicio de gestión de pagos y transacciones del ecosistema.

## 🚀 Características

- **Procesamiento de Pagos**: Simulación de pasarela de pagos con retardos realistas.
- **Transactional Consistency**: Persistencia en PostgreSQL vía Prisma.
- **Event-Driven**:
    - Consumidor de `order.created` para iniciar procesos de cobro.
    - Emisor de `order.paid` tras confirmación exitosa.
- **gRPC Server**: Interfaz síncrona para consultas de estado de pago.

## 🛠️ Tecnologías

- NestJS
- Prisma (PostgreSQL)
- RabbitMQ
- gRPC
- OpenTelemetry (SigNoz)

## ⚙️ Variables de Entorno

```env
NODE_ENV=development
HTTP_PORT=9006
GRPC_URL=0.0.0.0:50056
DATABASE_URL="postgresql://admin:master123@payments-db:5432/payments"
RABBITMQ_URL="amqp://admin:admin@rabbitmq:5672"
OTEL_SERVICE_NAME=payments-service
OTEL_EXPORTER_OTLP_ENDPOINT=http://signoz-otel-collector:4317
```

## 📖 API Endpoints (vía Kong)

- `GET /api/v1/payments`: Lista global de transacciones.
- `GET /api/v1/payments/my-payments`: Pagos del usuario autenticado.
- `GET /api/v1/payments/order/:orderId`: Consulta por ID de orden.
