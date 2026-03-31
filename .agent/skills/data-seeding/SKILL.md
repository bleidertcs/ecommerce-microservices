---
name: data-seeding
description: Guidelines for managing static database seed data with JSON files.
---

# Data Seeding Skill

This skill provides instructions for managing static, predefined test data using structured JSON files.

## Overview

Each service has its own seed script in `prisma/seed.ts` that imports pre-defined JSON generic objects from `prisma/data/*.json` and populates the database.

## Seed Scripts and Data Locations

- **Users**:
  - Script: `users/prisma/seed.ts`
  - Data: `users/prisma/data/users.json`
- **Products**:
  - Script: `products/prisma/seed.ts`
  - Data: `products/prisma/data/products.json`
- **Orders**:
  - Script: `orders/prisma/seed.ts`
  - Data: `orders/prisma/data/orders.json`

## Running Seeders

### Locally

```bash
cd [service-name]
pnpm prisma:seed
```

### In Docker Containers

```bash
docker exec bw-users-service pnpm run prisma:seed
docker exec bw-products-service pnpm run prisma:seed
docker exec bw-orders-service pnpm run prisma:seed
```

### Automated Script

Use the setup script in project root:

```powershell
.\setup-ecommerce.ps1
```

## Adding new Seed Data

Instead of generating data in loops, populate the `data/*.json` files directly.

Example `users/prisma/data/users.json`:

```json
[
  {
    "email": "customer@example.com",
    "username": "customer",
    "role": "CUSTOMER"
  }
]
```

## Reset and Reseed

To completely reset and reseed a database:

```bash
# Inside container
docker exec bw-users-service sh -c "
  pnpm exec dotenv -e .env.docker -- prisma db push --force-reset --accept-data-loss &&
  pnpm run prisma:seed
"
```

## Data Consistency Across Microservices

- Seed IDs (like User UUIDs or Product UUIDs) are set deterministically in `users.json` and `products.json`.
- `orders.json` refers directly to the deterministic IDs specified in those files to form valid relations.

## Troubleshooting

### Nested Database Inserts Failing

When testing data constraints with specific IDs, check that `users.json`, `products.json` are seeded first BEFORE `orders.json`.
Missing linked product IDs in Orders seeding could lead to Prisma foreign key violations.

### Prisma Client Not Found

```bash
# Regenerate Prisma Client
pnpm prisma:generate
```
