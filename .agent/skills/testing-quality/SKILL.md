---
name: testing-quality
description: Guidelines for writing and running tests in the NestJS microservices.
---

# Testing & Quality Assurance Skill

This skill provides instructions for testing practices and quality assurance in this project.

## Test Types

### Unit Tests

Located in: `src/**/*.spec.ts`

```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test:cov

# Run in watch mode
pnpm test:watch
```

### Integration Tests

Located in: `test/**/*.e2e-spec.ts`

```bash
# Run e2e tests
pnpm test:e2e
```

## Writing Tests

### Unit Test Example

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";

describe("UsersService", () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should find user by id", async () => {
    const mockUser = { id: "1", email: "test@test.com" };
    jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);

    const result = await service.findOne("1");
    expect(result).toEqual(mockUser);
  });
});
```

### E2E Test Example

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("ProductsController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/products (GET)", () => {
    return request(app.getHttpServer())
      .get("/products")
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## Testing gRPC Services

```typescript
import { ClientGrpc } from "@nestjs/microservices";
import { UsersService } from "./users-grpc.interface";

describe("Users gRPC", () => {
  let client: ClientGrpc;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: "USERS_PACKAGE",
          useValue: createMockGrpcClient(),
        },
      ],
    }).compile();

    client = module.get("USERS_PACKAGE");
    usersService = client.getService<UsersService>("UsersService");
  });

  it("should call FindOne via gRPC", (done) => {
    jest
      .spyOn(usersService, "findOne")
      .mockReturnValue(of({ id: "1", email: "test@test.com" }));

    usersService.findOne({ id: "1" }).subscribe({
      next: (result) => {
        expect(result.id).toBe("1");
        done();
      },
    });
  });
});
```

## Code Quality Tools

### ESLint

```bash
# Run linter
pnpm lint

# Fix auto-fixable issues
pnpm lint --fix
```

### Prettier

```bash
# Format code
pnpm format
```

### Pre-commit Hooks

Configured with Husky and lint-staged in `package.json`:

```json
{
  "lint-staged": {
    "*.ts": ["prettier --write", "eslint --fix"]
  }
}
```

## Test Coverage Goals

- **Unit Tests**: Aim for >80% coverage
- **E2E Tests**: Cover all critical user flows
- **Integration Tests**: Test service-to-service communication

## Running Tests in Docker

```bash
# Inside container
docker exec bw-users-service pnpm test

# With coverage
docker exec bw-users-service pnpm test:cov
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Mock External Dependencies**: Use mocks for databases, external APIs, and gRPC
3. **Descriptive Names**: Test names should describe what they test
4. **Arrange-Act-Assert**: Follow AAA pattern
5. **Clean Up**: Always clean up resources in `afterEach`/`afterAll`

## CI/CD Integration

Tests run automatically in GitHub Actions/GitLab CI on:

- Pull requests
- Merges to main
- Before deployment

## Debugging Tests

```typescript
// Add focused test
it.only("should test this specifically", () => {
  // ...
});

// Skip test temporarily
it.skip("work in progress", () => {
  // ...
});
```

## Database Testing

Use test database for integration tests:

```typescript
beforeAll(async () => {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;
});
```
