# CORE RULES: NestJS Microservices Project

This document defines the strict development standards for this workspace.

## 1. Directory Structure

```text
/root
  /.agent         - Bot skills and rules
  /.github        - CI/CD workflows
  /auth           - Auth microservice
  /post           - Post microservice
  /kong           - API Gateway config
  /monitoring     - Monitoring stack
  docker-compose.yml
```

## 2. Coding Standards

### NestJS

- Always use `@nestjs/config` for environment variables.
- Prefer `Class` based DTOs with `class-validator` decorators.
- Controllers should handle HTTP/gRPC routing; logic belongs in Services.

### TypeScript

- Use `strict: true` in `tsconfig.json`.
- Avoid `any`. Use interfaces or types for all payloads.

### Inter-service Patterns

- **Sync (gRPC)**: Define service interfaces in Shared Protos when possible.
- **Async (RabbitMQ)**: Use consistent naming for event patterns (e.g., `user.created`, `post.created`).

## 3. Database & Migrations

- Each service manages its own migrations.
- Always run `npm run prisma:generate` after schema changes.
- Seeding data should be done via `prisma/seed.ts` if provided.

## 4. Docker & DevOps

- Docker Compose is the source of truth for local infrastructure.
- Respect container names (e.g., `bw-postgres`, `bw-rabbitmq`).
- Application port mapping must be documented in `docker-compose.yml`.

## 5. Testing

- Unit tests: `jest` on `src/**/*.spec.ts`.
- Integration tests: `test/` directory within each service.
- Keep tests isolated; use `Mock` providers for external dependencies.
