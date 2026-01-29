---
name: communication-patterns
description: Instructions for implementing gRPC (synchronous) and RabbitMQ (asynchronous) communication.
---

# Communication Patterns Skill

This project uses two primary communication patterns: gRPC for synchronous requests and RabbitMQ for asynchronous events.

## gRPC (Synchronous)

Used for direct service-to-service calls where an immediate response is required.

### Proto Files

Located in `src/protos/` of each service.

### Generation

The `auth` service and others use `nestjs-grpc` to generate TS interfaces:

```bash
npm run proto:generate
```

### Implementation

- **Provider**: Decorate methods with `@GrpcMethod()`.
- **Consumer**: Use `ClientGrpc` and `getService<T>()` from `@nestjs/microservices`.

## RabbitMQ (Asynchronous)

Used for event-driven decoupled communication (e.g., notifying `post` service when a user is updated).

### Implementation

- **Provider**: Use `ClientProxy` and `@nestjs/microservices`.
  ```typescript
  client.emit("pattern_name", data);
  ```
- **Consumer**: Use `@EventPattern('pattern_name')` or `@MessagePattern()`.

### Configuration

- Ensure `RABBITMQ_URL` is set in `.env`.
- Use `amqp-connection-manager` and `amqplib` (standard for NestJS RabbitMQ).

## Best Practices

- Define shared interfaces for message payloads.
- Use Circuit Breakers for gRPC calls to ensure resilience.
- Implement retries for idempotent RabbitMQ consumers.
