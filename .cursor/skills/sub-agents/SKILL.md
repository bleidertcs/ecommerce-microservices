---
name: sub-agents
description: Index of specialized sub-agents for this codebase. Use when the user asks for sub-agents, specialists, or when routing a task to the right domain (Kong, Casdoor, NestJS, Next.js, Prisma, Docker, observability, frontend, tests, security).
---

# Sub-agentes del proyecto

Define los **sub-agentes** (especialistas) disponibles para este monorepo. Invoca el que corresponda según el tipo de tarea o archivos tocados.

## Cómo usar un sub-agente

- **En Cursor**: Menciona el contexto con @ (ej. `@kong-auth` + archivos en `kong/`) o pide explícitamente "actúa como el especialista de Kong".
- **Reglas**: Las rules (`.cursor/rules/*.mdc`) se aplican por glob; al tocar un área, aplicar la rule indicada en la tabla.
- **Skill**: Cargar el skill asociado para conocimiento de dominio (`.agent/skills/` o este `.cursor/skills/`).

## Índice de sub-agentes

| Sub-agente | Cuándo invocar | Skill(s) | Rule | Rutas / alcance |
|------------|----------------|----------|------|------------------|
| **Kong / Gateway** | Rutas, plugins, JWT, rate limiting, CORS, OpenTelemetry en gateway | `kong-auth` | `kong.mdc` | `kong/**` |
| **Casdoor / Identidad** | Login, OAuth, JWT, certificados, variables Casdoor, callback web-app | `kong-auth`, `security-auth` | `casdoor.mdc` | `.env*`, auth, `web-app` auth |
| **NestJS / Microservicios** | Nuevos servicios, controllers, DTOs, transport (gRPC/NATS/RMQ), health, Outbox | `nestjs-microservices`, `communication-patterns` | `nestjs-microservices.mdc` | `users/`, `products/`, `orders/`, `notifications/`, `payments/`, `cart/` |
| **Next.js / Frontend** | Páginas, componentes, API calls vía Kong, estado, estilos | `nextjs-frontend` | `nextjs-frontend.mdc`, `ui-ux.mdc` | `web-app/**` |
| **Prisma / Datos** | Schema, migraciones, seeds, Outbox (orders), consultas | `prisma-ops`, `data-seeding` | `prisma.mdc` | `**/prisma/**` |
| **Docker / Infra** | docker-compose, Dockerfiles, healthchecks, variables de entorno | `docker-deployment`, `infrastructure-management` | `docker.mdc` | `docker-compose.yml`, `**/Dockerfile`, `.env*` |
| **Observabilidad** | Traces, métricas, logs, OTLP, SigNoz, `tracing.ts`, `main.ts` | `monitoring-observability` | `observability-signoz.mdc` | `**/tracing.ts`, `**/main.ts`, `monitoring/**` |
| **Tests** | Unit tests, mocks, cobertura, Jest | `testing-quality` | `tests.mdc` | `test/**`, `*.spec.ts` |
| **Seguridad** | Auth, bcrypt, validación, no exponer secretos, RBAC | `security-auth` | `best-practices.mdc` (siempre) | Transversal |
| **Scripts / Automatización** | Setup, migraciones, seeds, limpieza, workflows | `automation-scripts` | — | `scripts/**`, `.agent/workflows/**` |
| **Guía general** | Arquitectura, flujo de tarea, qué área tocar | `project-architecture`, `agent-guidance` | `architecture.mdc`, `best-practices.mdc` | Cualquier tarea de arranque |

## Ejemplos de invocación

- *"Añade una ruta en Kong para /api/v1/cart"* → Sub-agente **Kong**: usar `@kong-auth`, rule `kong.mdc`, editar `kong/config.yml`.
- *"Implementa login con Casdoor en la web-app"* → Sub-agente **Casdoor** + **Next.js**: `@kong-auth` + `@nextjs-frontend`, rules `casdoor.mdc` y `nextjs-frontend.mdc`.
- *"Nuevo endpoint en orders con validación"* → Sub-agente **NestJS**: `@nestjs-microservices`, rule `nestjs-microservices.mdc`, DTOs y controller en `orders/`.
- *"Migración Prisma para nuevo campo en users"* → Sub-agente **Prisma**: `@prisma-ops`, rule `prisma.mdc`, `users/prisma/`.
- *"Traces de OpenTelemetry en payments"* → Sub-agente **Observabilidad**: `@monitoring-observability`, rule `observability-signoz.mdc`, `payments/src/tracing.ts` y `main.ts`.

## Referencias

- Mapa de arquitectura y reglas: `AGENTS.md`.
- Operativa (arranque, Casdoor, Kong, observabilidad): `MASTER_GUIDE.md`.
- Estándares ampliados: `.agent/rules/CORE_RULES.md`.
