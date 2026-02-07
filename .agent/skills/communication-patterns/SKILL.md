---
name: communication-patterns
description: Instructions for implementing gRPC (synchronous), NATS/RabbitMQ (asynchronous), and resilience patterns.
---

# Communication Patterns Skill

This project uses a hybrid architecture: gRPC for synchronous calls and NATS/RabbitMQ for asynchronous events.

## 📡 Dynamic Transport

Microservices (like `Orders`) switch transports via `.env`:

```env
USERS_TRANSPORT=grpc  # Options: grpc, tcp, nats
PRODUCTS_TRANSPORT=nats
```

## ⚡ Synchronous (gRPC)

Used for direct service-to-service calls (e.g., retrieving user details during order creation).

### Proto Management

- Files in `src/protos/` of each service.
- Generate TS: `npm run proto:generate`.

### Resilience: Circuit Breaker (Opossum)

Wrap gRPC calls to handle failures gracefully:

```typescript
const options = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
};
const breaker = new CircuitBreaker(grpcCall, options);
breaker.fallback(() => defaultValue);
```

## 📩 Asynchronous (NATS & RabbitMQ)

Used for decoupled events (e.g., product updates, order completion).

### Hybrid Implementation

- **NATS**: Preferred for high-performance messaging.
- **RabbitMQ**: Used for complex routing or legacy integration.

**Provider:**

```typescript
client.emit("pattern_name", data);
```

**Consumer:**

```typescript
@EventPattern('pattern_name')
handleEvent(data: any) { ... }
```

## 💾 Transactional Outbox Pattern

Ensures data consistency between DB updates and event publishing.

1. Save entity + event in the same DB transaction.
2. A background worker reads the `outbox` table.
3. Worker publishes the event and marks it as sent.

## Best Practices

- **Shared Interfaces**: Define message payloads in a library or shared module.
- **Idempotency**: Ensure event consumers can handle the same message multiple times.
- **Propagate Trace ID**: Ensure `traceparent` headers are carried through events for OTel.
