---
name: security-auth
description: Guidelines for implementing authentication, authorization, and security best practices.
---

# Security & Authentication Skill

This skill provides instructions for implementing security measures and authentication in the microservices.

## Authentication Flow

```
Client → Kong Gateway (JWT validation) → Service
                ↓
         Authentik (Identity Provider)
```

## Authentik Configuration

**URL**: http://localhost:9000
**Admin**: Configurable in docker-compose

### OAuth2/OIDC Application Setup

1. Navigate to Applications > Providers
2. Create OAuth2/OpenID Connect Provider
3. Configure:
   - Client Type: Confidential
   - Redirect URIs: Your application URLs
   - Signing Key: Auto-generated
4. Note the Client ID and Client Secret

### Kong Integration

Kong validates JWTs using the public key from Authentik.

Configuration in `kong/config.yml`:

```yaml
jwt_secrets:
  - consumer: test-user
    key: http://localhost:9000/application/o/gateway-api/
    algorithm: RS256
    rsa_public_key: |
      -----BEGIN PUBLIC KEY-----
      [Your actual public key]
      -----END PUBLIC KEY-----
```

## Obtaining JWT Tokens

### Client Credentials Flow

```bash
curl -X POST "http://localhost:9000/application/o/token/" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

Response:

```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## Using JWT in Requests

### HTTP Headers

```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/v1/users
```

### NestJS JWT Guard

```typescript
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Controller("protected")
export class ProtectedController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getProtectedResource() {
    return { message: "Authenticated!" };
  }
}
```

## JWT Claims

Standard claims in tokens:

```json
{
  "sub": "user-id", // Subject (User ID)
  "iss": "authentik", // Issuer
  "aud": "gateway-api", // Audience
  "exp": 1234567890, // Expiration
  "iat": 1234567880, // Issued At
  "email": "user@example.com",
  "roles": ["customer"]
}
```

## Extracting User from Request

Kong injects `x-user-id` header:

```typescript
@Controller("users")
export class UsersController {
  @Get("me")
  getCurrentUser(@Headers("x-user-id") userId: string) {
    return this.usersService.findOne(userId);
  }
}
```

## Role-Based Access Control (RBAC)

```typescript
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Usage
@Get('admin')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
adminOnly() {
  return { message: 'Admin access' };
}
```

## Security Best Practices

### 1. Password Hashing

Always hash passwords with bcrypt:

```typescript
import * as bcrypt from "bcryptjs";

const saltRounds = 10;
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

// Verify
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

### 2. Input Validation

Use class-validator:

```typescript
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### 3. Rate Limiting

Configured in Kong for public endpoints:

```yaml
plugins:
  - name: rate-limiting
    config:
      minute: 100
      policy: local
```

### 4. CORS Configuration

```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(","),
  credentials: true,
});
```

### 5. Helmet for Security Headers

```typescript
import helmet from "helmet";

app.use(helmet());
```

### 6. Environment Variables

Never commit sensitive data:

```env
# .env (NOT in git)
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

## Service-to-Service Authentication

### gRPC Metadata

```typescript
const metadata = new Metadata();
metadata.add("authorization", `Bearer ${internalToken}`);

this.grpcClient.findOne({ id: "1" }, metadata);
```

## Common Security Issues

### SQL Injection

✅ **Good** - Use Prisma (parameterized queries):

```typescript
await prisma.user.findFirst({ where: { email } });
```

❌ **Bad** - Raw SQL with string interpolation:

```typescript
await prisma.$executeRaw`SELECT * FROM users WHERE email = '${email}'`;
```

### XSS Prevention

- Sanitize user input
- Use Content Security Policy headers
- Escape output in templates

### CSRF Protection

- Use CSRF tokens for state-changing operations
- Validate origin headers
- SameSite cookies

## Rotating Secrets

1. Generate new secret in Authentik
2. Update Kong configuration with both old and new keys
3. Deploy changes
4. Remove old key after grace period

## Monitoring Security

- Log authentication failures
- Monitor for brute force attempts
- Alert on unusual access patterns
- Track token usage

## Troubleshooting

### Token Validation Fails

1. Check token expiration
2. Verify public key matches in Kong and Authentik
3. Ensure algorithm matches (RS256)
4. Check audience and issuer claims

### CORS Errors

1. Verify ALLOWED_ORIGINS env var
2. Check Kong CORS plugin configuration
3. Ensure credentials are handled correctly
