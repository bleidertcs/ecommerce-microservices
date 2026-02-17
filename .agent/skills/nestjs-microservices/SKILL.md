---
name: nestjs-microservices
description: Guidelines for managing and creating NestJS microservices in this project.
---

# NestJS Microservices Skill

This project follows a modular, environment-driven microservices architecture using NestJS.

## 🏗️ Service Architecture

Each microservice is a standalone application with its own database and internal structure:

- **Modules**: Domain-specific logic encapsulated in NestJS modules.
- **Transport**: Hybrid support for gRPC, NATS, and RabbitMQ.
- **Observability**: OTel-first instrumentation in `main.ts` and `tracing.ts`.

## 🛠️ Creating a New Service

1. Generate app: `npx nest generate app <name>`.
2. Move to root directory: `/service-name`.
3. Standard structure:
   - `src/main.ts`: Bootstrap with OTel and Hybrid transports.
   - `src/tracing.ts`: OTel SDK configuration.
   - `prisma/`: Prisma schema and migrations.
4. Add to `docker-compose.yml`.

## 🔄 Standard Patterns

- **Circuit Breaker**: Use Opossum for external service calls.
- **Transactional Outbox**: For reliable event publishing.
- **Health Checks**: Use `@nestjs/terminus` on `GET /health`.
- **Validation**: Global `ValidationPipe` for DTOs.

## 🌐 Environment Strategy

- **Local**: `.env` (maps DB to localhost ports like `15431`).
- **Docker**: Environment variables defined in `docker-compose.yml` (overlap `.env`).

## 💻 Useful Commands

- `pnpm run start:dev`: Local development with watch.
- `docker-compose up <service> --build`: Run within the ecosystem.
- `npx prisma migrate dev`: Handle DB changes.
- `pnpm run test`: Execute unit tests.
