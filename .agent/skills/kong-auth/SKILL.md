---
name: kong-auth
description: Instructions for managing API Gateway security with Kong and Casdoor.
---

# Kong & Casdoor Security Skill

This project uses **Kong Gateway** in DB-less mode and **Casdoor** as the Identity Provider (OIDC).

## 🔐 OIDC / JWT FLOW

1. **Casdoor**: Issues RS256 JWT tokens.
2. **Kong**: Validates the token signature using a public key.
3. **Microservices**: Receive identity via `x-user-id` header.

### Configuration (`kong/config.yml`)

Add the `jwt` plugin to routes:

```yaml
plugins:
  - name: jwt
    config:
      key_claim_name: kid
      claims_to_verify: [exp]
```

## ⏳ Rate Limiting

Configured at the Gateway level using **Redis** for persistence.

### Per User (Authenticated)

```yaml
- name: rate-limiting
  config:
    minute: 30
    policy: redis
    limit_by: header
    header_name: x-user-id
```

### Per IP (Public)

```yaml
- name: rate-limiting
  config:
    minute: 100
    policy: redis
    limit_by: ip
```

## 🛠️ Management

### Reloading Kong

Since it's DB-less, restart the container after editing `config.yml`:

```bash
docker-compose restart kong
```

### Extracting Public Key

To allow Kong to verify Casdoor tokens:

1. Go to Casdoor Dashboard -> Certs.
2. Select the certificate used by your application.
3. Copy the Public Key.
4. Add to Kong's `jwt_secrets` in `kong/config.yml`.
