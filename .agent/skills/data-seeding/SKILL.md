---
name: data-seeding
description: Guidelines for creating and managing database seed data with Faker.
---

# Data Seeding Skill

This skill provides instructions for generating and managing realistic test data using Faker.

## Overview

Each service has its own seed script in `prisma/seed.ts` that generates realistic e-commerce data using `@faker-js/faker`.

## Seed Scripts Location

- **Users**: `users/prisma/seed.ts`
- **Products**: `products/prisma/seed.ts`
- **Orders**: `orders/prisma/seed.ts`

## Running Seeders

### Locally

```bash
cd [service-name]
pnpm prisma:seed
```

### In Docker Containers

```bash
docker exec bw-users-service pnpm exec ts-node prisma/seed.ts
docker exec bw-products-service pnpm exec ts-node prisma/seed.ts
docker exec bw-orders-service pnpm exec ts-node prisma/seed.ts
```

### Automated Script

Use the setup script in project root:

```powershell
.\setup-ecommerce.ps1
```

## Creating a Seed Script

### Basic Structure

```typescript
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data (optional)
  // await prisma.model.deleteMany({});

  const items = [];

  // Generate data
  for (let i = 0; i < 100; i++) {
    items.push({
      name: faker.commerce.productName(),
      email: faker.internet.email(),
      // ... other fields
    });
  }

  // Insert data
  for (const item of items) {
    await prisma.model.create({ data: item });
  }

  console.log(`✅ Created ${items.length} items`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

## Useful Faker Methods

### Personal Data

```typescript
faker.person.firstName();
faker.person.lastName();
faker.person.fullName();
faker.internet.email();
faker.internet.username();
faker.phone.number();
faker.image.avatar();
```

### Address Data

```typescript
faker.location.streetAddress();
faker.location.city();
faker.location.state();
faker.location.zipCode();
faker.location.country();
```

### Commerce Data

```typescript
faker.commerce.productName();
faker.commerce.productDescription();
faker.commerce.price({ min: 10, max: 1000, dec: 2 });
faker.commerce.department();
faker.commerce.productAdjective();
```

### Dates and Numbers

```typescript
faker.date.past();
faker.date.recent();
faker.number.int({ min: 0, max: 500 });
faker.number.float({ min: 0, max: 5, fractionDigits: 1 });
faker.datatype.boolean({ probability: 0.8 });
```

### Random Selection

```typescript
faker.helpers.arrayElement(["A", "B", "C"]);
faker.helpers.multiple(() => item, { count: { min: 1, max: 5 } });
```

## Data Relationships

When seeding data with relationships across services:

```typescript
// Option 1: Use mock IDs (simple)
const MOCK_USER_IDS = ["user-1", "user-2", "user-3"];
const userId = faker.helpers.arrayElement(MOCK_USER_IDS);

// Option 2: Query other service via gRPC (advanced)
// Make gRPC call to get real IDs from other service
```

## Seed Configuration in package.json

```json
{
  "scripts": {
    "prisma:seed": "dotenv -e .env.docker -- ts-node prisma/seed.ts"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

## Reset and Reseed

To completely reset and reseed a database:

```bash
# Inside container
docker exec bw-users-service sh -c "
  pnpm exec dotenv -e .env.docker -- prisma db push --force-reset --accept-data-loss &&
  pnpm exec ts-node prisma/seed.ts
"
```

## Current Seed Data

### Users Service (50 users)

- 10 Administrators
- 40 Customers
- All with addresses, payment methods, and profiles

### Products Service (100 products)

- 10 categories
- Price range: $10 - $1,000
- Stock levels: 0 - 500
- Ratings and reviews

### Orders Service (200 orders)

- Linked to users and products
- Realistic status distribution
- Complete shipping and payment info

## Best Practices

1. **Idempotent Seeds**: Make seeds safe to run multiple times
2. **Realistic Data**: Use appropriate Faker methods for each field
3. **Unique Constraints**: Be careful with unique fields (email, SKU, username)
4. **Performance**: Batch inserts when possible
5. **Dependencies**: Seed services in order if there are dependencies
6. **Documentation**: Comment seed data quantities and distributions

## Troubleshooting

### Unique Constraint Violations

```typescript
// Use unique usernames
const username = faker.internet.username({ firstName, lastName }).toLowerCase();

// Or use UUIDs
const sku = `${category}-${faker.string.uuid()}`;
```

### Prisma Client Not Found

```bash
# Regenerate Prisma Client
pnpm prisma:generate
```

### Slow Seeding

```typescript
// Use Promise.all for parallel inserts
await Promise.all(items.map((item) => prisma.model.create({ data: item })));

// Or use createMany
await prisma.model.createMany({ data: items });
```
