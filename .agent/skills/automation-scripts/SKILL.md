---
name: automation-scripts
description: Guidelines on how to use the automation scripts located in the /scripts directory.
---

# Automation Scripts

This skill documents the automated scripts placed in the `scripts/` directory, designed to simplify local development, deployment, and testing.

## Available Scripts

1. **`fetch-casdoor-cert.sh` / `fetch-casdoor-cert.js`**
   - **Purpose**: Fetches the public certificate from Casdoor to be used by Kong or microservices for JWT validation.
   - **Usage**: Run it to download the `casdoor.pem` or `.crt` into the appropriate configuration folders before starting the gateway.

2. **Seeding Scripts** (Located in `prisma/seed.ts`)
   - **Purpose**: Populated the database with initial fake data using Faker.
   - **Usage**: Use `pnpm prisma db seed` locally, or rely on `prisma-ops/SKILL.md` instructions.

## Adding New Scripts

When creating a new script:
- Place it in the `scripts/` folder.
- If it's a Node script, ensure it runs independently or has a specific `pnpm run` command.
- If it's a Bash script, ensure it is documented in this `SKILL.md` and has the correct execute permissions (`chmod +x`).

Avoid placing random shell files in the root directory. Keep the workspace clean.
