---
name: nestjs-microservices
description: Guidelines for managing and creating NestJS microservices in this project.
---

# NestJS Microservices Skill

This skill provides instructions for maintaining and extending the NestJS microservices architecture used in this project.

## Core Principles

- **Modular Architecture**: Each service is organized into features/modules.
- **Dependency Injection**: Use NestJS DI for services, controllers, and providers.
- **Environment Driven**: Configuration must always be pulled from `@nestjs/config`.

## Creating a New Service

1. Use the Nest CLI to generate a new app: `npx nest generate app <service-name>`.
2. Move the app to a top-level directory (e.g., `/my-new-service`).
3. Configure `packageManager: yarn@4.5.1` (or the version currently used in `auth/package.json`).
4. Update `docker-compose.yml` to include the new service.

## Code Style

- Follow the ESLint and Prettier rules defined in the root and service subfolders.
- Use `npx nest build` to verify compilation.
- Ensure all services provide a health check endpoint via `@nestjs/terminus`.

## Useful Commands

- `npm run build`: Build the service.
- `npm run start`: Run in production mode.
- `npm run dev`: Run in development mode with watch.
- `npm run test`: Run unit tests.
