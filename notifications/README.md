# Notifications Service

Microservicio encargado del envío de comunicaciones (Emails, Notificaciones Push simuladas) a los usuarios.

## 🚀 Características

- **Email Simulation**: Genera logs estructurados simulando el envío de correos electrónicos.
- **Event-Driven Architecture**:
    - Reacciona a `order.created` (Confirmación de Orden).
    - Reacciona a `order.paid` (Confirmación de Pago).
- **gRPC Interface**: Permite el envío de notificaciones bajo demanda desde otros servicios.

## ⚙️ Variables de Entorno

```env
NODE_ENV=development
HTTP_PORT=9005
GRPC_URL=0.0.0.0:50055
RABBITMQ_URL="amqp://admin:admin@rabbitmq:5672"
OTEL_SERVICE_NAME=notifications-service
OTEL_EXPORTER_OTLP_ENDPOINT=http://signoz-otel-collector:4317
```

## 🧪 Pruebas de Funcionamiento

Las notificaciones se pueden verificar revisando los logs del contenedor:

```bash
docker compose logs -f notifications-service
```
