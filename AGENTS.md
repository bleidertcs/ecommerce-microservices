# Guía para agentes IA

Al iniciar **cualquier requerimiento, mejora o fix** en este repositorio, aplicar contexto de arquitectura y las reglas por área.

## 1. Contexto de arquitectura

- **Rule** `architecture` (siempre activa): resumen de Kong, Casdoor, NestJS, Next.js, microservicios, Prisma, Docker, SigNoz, UI/UX, buenas prácticas y tests.
- **Skill** `project-architecture` (`.cursor/skills/project-architecture/SKILL.md`): descripción completa de cada área y flujo al iniciar una tarea.

## 2. Reglas por área (usar según archivos tocados)

| Área | Rule | Globs / Alcance |
|------|------|------------------|
| Kong | `kong.mdc` | kong/** |
| Casdoor | `casdoor.mdc` | .env*, auth.config.ts, web-app |
| NestJS / Microservicios | `nestjs-microservices.mdc` | users, products, orders, notifications, payments |
| Next.js | `nextjs-frontend.mdc` | web-app |
| Prisma | `prisma.mdc` | prisma/** |
| Docker | `docker.mdc` | docker-compose.yml, Dockerfile, .env* |
| Observabilidad SigNoz | `observability-signoz.mdc` | tracing.ts, main.ts, monitoring/** |
| UI/UX | `ui-ux.mdc` | web-app (tsx, css) |
| Buenas prácticas | `best-practices.mdc` | Siempre activa |
| Tests | `tests.mdc` | test/**, *.spec.ts |

## 3. Referencia operativa

Para arranque, Casdoor, Kong, observabilidad y pruebas: **MASTER_GUIDE.md**.

---

Con esto las respuestas respetan: **Kong**, **Casdoor**, **NestJS**, **Next.js**, **microservicios**, **buenas prácticas**, **UI/UX**, **observabilidad con SigNoz**, **Docker** y **Prisma**.
