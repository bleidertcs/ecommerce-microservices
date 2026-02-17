---
name: prisma-ops
description: Common commands and procedures for Prisma migrations, schema updates, and seeding.
---

# Prisma Operations Skill

This skill provides instructions for managing the database schema and data using Prisma ORM.

## Architecture

- Each service (e.g., `users`, `products`, `orders`) has its own Prisma schema located in its `prisma/` folder.
- Migrations are service-specific.

## Common Workflows

### Generating Client

Run after changes to `schema.prisma`:

```bash
npm run prisma:generate
```

### Creating Migrations

To create and apply a migration in development:

```bash
npm run prisma:migrate
```

_Note: This typically runs `prisma migrate dev`._

### Database Studio

To visualize and edit data:

```bash
npm run prisma:studio
```

## Production Guidelines

- Never use `migrate dev` in production. Use `npm run prisma:migrate:prod` which executes `prisma migrate deploy`.
- Ensure the `DATABASE_URL` matches the environment (Docker internal vs Host).

## Integration in NestJS

- Use a `PrismaService` that extends `PrismaClient` and handles `$connect()` on application bootstrap.
