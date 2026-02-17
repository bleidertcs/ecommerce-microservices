---
name: general-standards
description: General standards, architecture patterns, and best practices for the entire microservices ecosystem.
---

# General Standards Skill

This skill defines the overarching standards and architectural principles for this project. All other specialized skills build upon these fundamentals.

## 🏗️ Core Technology Stack

- **Backend**: [NestJS](https://nestjs.com/) (Modular Architecture)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **API Gateway**: [Kong Gateway](https://konghq.com/kong) (DB-less mode)
- **Identity Provider**: [Casdoor](https://casdoor.org/) (OIDC)
- **Observability**: [SigNoz](https://signoz.io/) (OpenTelemetry-first)
- **Communication**: gRPC (Sync), NATS/RabbitMQ (Async)

## 📐 Architecture Principles

### 1. Unified Modular Monorepo

Each subdirectory in root represents a standalone microservice or component.

### 2. Environment-Driven Configuration

- Local development uses `.env` files.
- Docker orchestration overrides via `docker-compose.yml`.
- Always use `@nestjs/config` for accessing variables.

### 3. Synchronous vs Asynchronous Communication

- **Synchronous**: Use gRPC for critical, real-time data needs.
- **Asynchronous**: Use NATS or RabbitMQ for event-driven consistency (Transactional Outbox Pattern).

## 🛠️ Performance & Scalability

- **Caching**: Use Redis for high-frequency low-latency data access.
- **Resilience**: Implement Circuit Breakers (Opossum) for all external/inter-service calls.
- **Statelessness**: Services must be stateless to allow horizontal scaling.

## 🔒 Security Fundamentals

- **Defense in Depth**: Gateway handles JWT validation; services handle granular RBAC.
- **Identity**: Casdoor is the single source of truth for users and permissions.
- **Secrets**: Never commit `.env` files; use environment variables in CI/CD.

## 📊 Observability

- **Tracing**: Follow OpenTelemetry standards. Every request must have a `trace_id`.
- **Logs**: Structured JSON logging only.
- **Monitoring**: All telemetry flows to SigNoz OTel Collector.
