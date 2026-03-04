---
name: project-architecture
description: Describes the e-commerce monorepo: Kong, Casdoor, NestJS, Next.js, microservices, Prisma, Docker, SigNoz observability, UI/UX, best practices. Use at the start of any requirement, improvement, or fix so the agent aligns changes with the project.
---

# Arquitectura del proyecto

Este skill resume la arquitectura del monorepo para que la IA la tenga en cuenta al iniciar **cualquier requerimiento, mejora o fix**. Cubre: **Kong**, **Casdoor**, **NestJS**, **Next.js**, **microservicios**, **buenas prácticas**, **UI/UX**, **observabilidad SigNoz**, **Docker**, **Prisma**.

## Cuándo usar este skill

- Al recibir un nuevo requerimiento funcional o no funcional.
- Al proponer una mejora (refactor, performance, seguridad).
- Al abordar un fix (bug, incidente).
- Antes de tocar múltiples servicios, gateway, frontend o infraestructura.

## Áreas cubiertas (y rules asociadas)

| Área | Descripción breve | Rule |
|------|-------------------|------|
| **Kong** | API Gateway :8010, JWT Casdoor, rate limiting Redis, CORS, OpenTelemetry | `kong.mdc` |
| **Casdoor** | IdP :8000, JWT para Kong, OAuth/Password en web-app, certificados | `casdoor.mdc` |
| **NestJS** | Backend por servicio: controllers, services, DTOs, health, versionado | `nestjs-microservices.mdc` |
| **Next.js** | web-app React 19, Tailwind, API vía Kong, env vars | `nextjs-frontend.mdc` |
| **Microservicios** | users, products, orders, notifications, payments; gRPC/TCP/NATS, RabbitMQ, Outbox | `nestjs-microservices.mdc` + `architecture.mdc` |
| **Buenas prácticas** | TypeScript strict, seguridad, API REST, errores, logging, Git | `best-practices.mdc` |
| **UI/UX** | Accesibilidad, consistencia, feedback, responsive, Tailwind | `ui-ux.mdc` |
| **Observabilidad SigNoz** | OpenTelemetry, OTLP, traces/métricas/logs, collector, ClickHouse | `observability-signoz.mdc` |
| **Docker** | docker-compose, servicios, healthchecks, env, builds | `docker.mdc` |
| **Prisma** | Schema, migraciones, seeds, Outbox en orders | `prisma.mdc` |
| **Tests** | Jest, test/unit, mocks, cobertura | `tests.mdc` |

## Mapa rápido del repositorio

| Ruta | Rol |
|------|-----|
| `users/`, `products/`, `orders/`, `notifications/`, `payments/` | Microservicios NestJS (Prisma, gRPC/NATS/RMQ) |
| `kong/` | Config Kong (rutas, JWT, rate limiting, CORS, OpenTelemetry) |
| `web-app/` | Frontend Next.js 16 (React 19, Tailwind); API vía Kong |
| `monitoring/signoz/` | SigNoz: OTel Collector, ClickHouse |
| `docker-compose.yml` | Orquestación de todos los servicios |
| `MASTER_GUIDE.md` | Guía operativa: arranque, Casdoor, Kong, observabilidad, pruebas |

## Infraestructura y comunicación

- **Kong**: Rutas `/api/v1/{users|products|orders}`. JWT (Casdoor RS256), header `x-user-id` inyectado. Rate limiting por Redis. Ver `kong.mdc`.
- **Casdoor**: Tokens JWT; Kong valida con clave pública. Web-app: login y callback. Ver `casdoor.mdc`.
- **Entre microservicios**: gRPC/TCP/NATS (configurable en orders); RabbitMQ cola `ecommerce_events`; Orders con **Transactional Outbox** + OutboxWorker. Ver `nestjs-microservices.mdc`, `prisma.mdc`.
- **Docker**: Contenedores `bw-*`, redes, healthchecks, variables por servicio. Ver `docker.mdc`.

## Observabilidad (SigNoz)

- OpenTelemetry (OTLP) → SigNoz Collector → ClickHouse. UI :8080. Variables `OTEL_SERVICE_NAME`, `OTEL_EXPORTER_OTLP_ENDPOINT`. SDK al inicio de `main.ts` en servicios; Winston con `OpenTelemetryTransportV3`. Kong con plugin opentelemetry. Ver `observability-signoz.mdc`.

## Clean code, UI/UX y buenas prácticas

- **Backend**: Controllers delgados; lógica en services; Prisma por servicio; tests en `test/unit/`. Ver `nestjs-microservices.mdc`, `prisma.mdc`.
- **Frontend**: Componentes reutilizables, estados de carga/error, accesibilidad, responsive. Ver `nextjs-frontend.mdc`, `ui-ux.mdc`.
- **Transversal**: TypeScript strict, seguridad (bcrypt, no loguear secretos), API coherente, excepciones Nest, commits convencionales. Ver `best-practices.mdc`, `.agent/rules/CORE_RULES.md`.

## Flujo recomendado al iniciar una tarea

1. **Alcance**: qué área afecta (Kong, Casdoor, NestJS, Next.js, Prisma, Docker, SigNoz, UI/UX).
2. **Comunicación**: si hay interacción entre servicios, revisar transportes y eventos (Outbox).
3. **Auth**: JWT en Kong; `x-user-id` en servicios protegidos.
4. **Observabilidad**: mantener OTEL; no loguear PII.
5. **Tests**: actualizar o añadir en `test/unit/`; ejecutar en contenedor si aplica.

## Referencias rápidas

- Operativa: `MASTER_GUIDE.md`
- Reglas Cursor: `.cursor/rules/` — architecture, kong, casdoor, nestjs-microservices, nextjs-frontend, prisma, docker, observability-signoz, ui-ux, best-practices, tests
- Estándares ampliados: `.agent/rules/CORE_RULES.md`
