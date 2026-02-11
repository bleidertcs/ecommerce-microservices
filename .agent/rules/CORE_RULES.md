---
trigger: always_on
---

# CORE RULES: NestJS E-commerce Microservices Project

This document defines the strict development standards for this workspace.

## 1. Directory Structure

```text
/root
  /.agent              - Agent skills and rules
  /users               - Users microservice
  /products            - Products microservice
  /orders              - Orders microservice
  /kong                - API Gateway config
  /monitoring          - Grafana observability stack
  /authentik           - Identity provider config
  /web-app             - Web app for e-commerce UI
  docker-compose.yml   - Infrastructure orchestration
```

## 2. Coding Standards

### NestJS Best Practices

- Always use `@nestjs/config` for environment variables via `ConfigModule`
- Use Class-based DTOs with `class-validator` and `class-transformer` decorators
- Controllers handle HTTP/gRPC routing only; business logic belongs in Services
- Use Dependency Injection for all services, repositories, and providers
- Implement health checks using `@nestjs/terminus` on `/health` endpoint
- Follow modular architecture: one feature per module

### TypeScript

- Use `strict: true` in tsconfig.json
- Avoid `any` type - use proper interfaces, types, or generics
- Use `readonly` for properties that shouldn't change
- Prefer `const` over `let`, never use `var`
- Use async/await instead of raw promises or callbacks
- Enable all strict compiler options

### Code Organization

```typescript
// Correct order in files
1. Imports
2. Interfaces/Types
3. Constants
4. Class decorators
5. Class definition
6. Constructor
7. Lifecycle hooks (if any)
8. Public methods
9. Private methods
```

## 3. Inter-Service Communication

### gRPC (Synchronous)

- Use `nestjs-grpc` package for gRPC integration
- Define proto files in `src/protos/` directory
- Use `@GrpcController('ServiceName')` for controllers
- Use `@GrpcMethod('MethodName')` for individual methods
- Keep gRPC methods focused and single-purpose
- Always handle errors and return appropriate gRPC status codes

Example:

```typescript
@GrpcController("UsersService")
export class UsersGrpcController {
  @GrpcMethod("FindOne")
  async findOne(data: FindOneRequest): Promise<UserResponse> {
    // Implementation
  }
}
```

### RabbitMQ (Asynchronous)

- Use consistent event naming: `entity.action` (e.g., `order.created`, `user.updated`)
- Publish events for state changes, not queries
- Implement idempotent event handlers
- Use dead letter queues for failed messages
- Log all published and consumed events

## 4. Database & Migrations

### Prisma ORM

- Each service manages its own database and migrations
- Always run `pnpm prisma:generate` after schema changes
- Use migrations for schema changes, never `db push` in production
- Use descriptive migration names: `pnpm prisma migrate dev --name add_user_roles`
- Never edit generated migration files manually

### Schema Design

- Use UUID for primary keys (`@id @default(uuid())`)
- Always include `createdAt` and `updatedAt` timestamps
- Implement soft deletes with `isDeleted` and `deletedAt` fields
- Use enums for fixed sets of values
- Define relationships clearly with foreign keys
- Use JSON fields sparingly, prefer proper relations

### Seed Data

- Seed scripts must be idempotent
- Use Faker for realistic test data
- Document seed data quantities in comments
- Place seed files in `prisma/seed.ts`
- Configure seed command in package.json

## 5. Docker & DevOps

### Docker Compose

- Docker Compose is the source of truth for local infrastructure
- Use health checks for all services
- Respect container naming convention: `bw-{service-name}`
- Document all port mappings
- Use `.env.docker` files for container environment variables
- Never commit `.env` or `.env.docker` with sensitive data

### Environment Variables

Required in each service:

```env
NODE_ENV=development|production
HTTP_PORT=9001
GRPC_URL=0.0.0.0:50051
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
RABBITMQ_URL=amqp://...
OTEL_SERVICE_NAME=service-name
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
```

## 6. Testing Requirements

### Unit Tests

- Minimum 80% code coverage
- Place tests alongside source: `*.spec.ts`
- Use AAA pattern: Arrange, Act, Assert
- Mock all external dependencies
- Test edge cases and error scenarios

### Integration Tests

- Test service-to-service communication
- Test database operations with test database
- Test gRPC endpoints
- Place in `test/` directory

### E2E Tests

- Test complete user flows
- Test via Kong Gateway when applicable
- Verify authentication and authorization

## 7. Security Standards

### Authentication

- All protected endpoints must validate JWT
- Use Authentik as identity provider
- Never log or expose tokens
- Implement token refresh mechanisms
- Use HTTPS in production

### Data Protection

- Hash all passwords with bcrypt (10 rounds minimum)
- Never log sensitive data (passwords, tokens, PII)
- Validate all user input with class-validator
- Sanitize output to prevent XSS
- Use parameterized queries (Prisma handles this)

### API Security

- Implement rate limiting on public endpoints
- Use CORS with specific origins
- Enable Helmet for security headers
- Implement request size limits
- Log authentication failures

## 8. Logging & Monitoring

### Logging Standards

- Use structured logging (JSON format)
- Include correlation IDs for tracing
- Log levels:
  - ERROR: Failures requiring attention
  - WARN: Unexpected but handled situations
  - INFO: Significant business events
  - DEBUG: Detailed diagnostic information
- Never log sensitive information

### OpenTelemetry

- All services must export traces and metrics
- Use OpenTelemetry auto-instrumentation
- Configure OTEL collector endpoint in environment
- Implement custom spans for business operations

### Metrics

- Track request duration, error rates, throughput
- Monitor database query performance
- Monitor message queue lag
- Set up alerts for SLO violations

## 9. API Design

### REST Endpoints

- Use standard HTTP methods correctly (GET, POST, PUT, PATCH, DELETE)
- Use plural nouns for resources: `/users`, `/products`, `/orders`
- Use nested routes sparingly: `/orders/:id/items`
- Return appropriate status codes:
  - 200: OK
  - 201: Created
  - 204: No Content
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 500: Internal Server Error

### Response Format

```typescript
// Success
{
  "id": "uuid",
  "data": { ... },
  "metadata": { "timestamp": "ISO8601" }
}

// Error
{
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "ISO8601",
  "path": "/api/endpoint"
}
```

## 10. Documentation

### Code Documentation

- Document complex business logic
- Use JSDoc for public APIs
- Keep comments up-to-date
- Explain "why", not "what"

### API Documentation

- Use Swagger/OpenAPI via `@nestjs/swagger`
- Document all DTOs with `@ApiProperty`
- Provide request/response examples
- Document authentication requirements

### README Files

- Each service must have README.md
- Include setup instructions
- Document environment variables
- Provide usage examples

## 11. Git Workflow

### Commits

- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- Write descriptive commit messages
- Keep commits focused and atomic
- Reference issues in commits

### Branches

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `fix/*`: Bug fixes
- `hotfix/*`: Urgent production fixes

### Pull Requests

- Require code review before merge
- Run all tests in CI/CD
- Ensure build passes
- Update documentation

## 12. Performance

- Use connection pooling for databases
- Implement caching with Redis for frequent queries
- Paginate large result sets
- Use database indexing appropriately
- Optimize N+1 queries
- Monitor and profile slow operations

## 13. Error Handling

- Use NestJS exception filters
- Return user-friendly error messages
- Log errors with full stack traces
- Implement global exception handler
- Use custom exceptions for business errors

```typescript
throw new NotFoundException("User not found");
throw new BadRequestException("Invalid input");
throw new UnauthorizedException("Invalid credentials");
```

## 14. Versioning

- API versioning in URL: `/api/v1/`
- Maintain backward compatibility
- Deprecate endpoints gracefully
- Document breaking changes

## 15. Dependency Management

- Use pnpm as package manager
- Keep dependencies up-to-date
- Review security advisories
- Lock dependency versions
- Minimize dependencies

## Enforcement

These rules are enforced through:

- ESLint and Prettier configuration
- Husky pre-commit hooks
- CI/CD pipelines
- Code review process
