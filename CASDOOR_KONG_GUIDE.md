# 🔐 Casdoor & Kong Gateway Integration Guide

This comprehensive guide details the end-to-end configuration for using **Casdoor** as an Identity Provider and **Kong** as the API Gateway to secure your microservices architecture.

---

## 📑 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Casdoor Setup (The Identity Provider)](#2-casdoor-setup)
3. [Kong Integration (The Security Guard)](#3-kong-integration)
4. [Public Key Extraction (Two Methods)](#4-public-key-extraction)
5. [Web App Configuration](#5-web-app-configuration)
6. [Microservice Implementation](#6-microservice-implementation)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Prerequisites

- Docker & Docker Compose installed.
- Root `.env` file initialized with database and application secrets.
- Kong running in DB-less mode (configured via `kong/config.yml`).

---

## 2. Casdoor Setup

### A. Organization Configuration

1. Access Casdoor at `http://localhost:8000`.
2. Login with `admin` / `123123` (default).
3. Go to **Identity > Organizations** and edit `built-in` or create a new one.
4. **Key Settings**:
   - **Display Name**: e.g., "Lumina Commerce".
   - **Password type**: `plain` for development, `bcrypt` for production.
   - **Enable registration**: Checked.
   - **Enable privilege consent**: [IMPORTANT] Must be **Checked**. This allows users to authorize the app.

### B. Application Configuration

1. Go to **Identity > Applications** and edit `app-built-in`.
2. **Redirect URLs**: Add `http://localhost:3000/callback`.
3. **Grant Types**:
   - `Authorization Code` (Main flow for Web Apps).
   - `Refresh Token` (To maintain sessions).
4. **Copy Credentials**: Note the **Client ID** and **Client Secret**.

---

## 3. Kong Integration

Kong must be configured to validate JWTs issued by Casdoor and pass the user identity to the microservices.

### Step 1: JWT Plugin Setup

In `kong/config.yml`, add the `jwt` plugin to your protected routes:

```yaml
plugins:
  - name: jwt
    config:
      key_claim_name: iss # Kong will match the 'iss' claim against jwt_secrets
      claims_to_verify: ["exp"]
```

### Step 2: Request Transformer (Header Injection)

This plugin extracts the `sub` (User ID) from the JWT and injects it as an `x-user-id` header for your services.

```yaml
- name: request-transformer
  config:
    add:
      headers:
        - "x-user-id:$(jwt_claims.sub)"
        - "x-user-name:$(jwt_claims.name)"
```

---

## 4. Public Key Extraction

Kong needs the Casdoor Public Key to verify token signatures. Use one of the two methods below.

### Method A: Manual (Via UI)

1. In Casdoor, go to the **Certs** tab.
2. Find the active `RS256` certificate.
3. Click **Edit** and copy the entire contents of the **Public Key** field.
4. Paste it into `kong/config.yml` under `jwt_secrets` (see [Method B](#method-b-automated-via-script) for the YAML format).

### Method B: Automated (Via Script)

We provide a PowerShell script to fetch the key and format it for Kong automatically.

1. Open a PowerShell terminal.
2. Run the script:
   ```powershell
   ./scripts/fetch-casdoor-certs.ps1 -CasdoorUrl "http://localhost:8000"
   ```
3. Copy the output and update your `kong/config.yml`:

```yaml
jwt_secrets:
  - consumer: test-user
    key: "http://localhost:8000" # Must match exactly the 'iss' claim in your token
    algorithm: RS256
    rsa_public_key: |
      -----BEGIN PUBLIC KEY-----
      [YOUR_FETCHED_KEY_CONTENT]
      -----END PUBLIC KEY-----
```

---

## 5. Web App Configuration

Ensure your `web-app/.env` (and root `.env`) matches the Casdoor application settings:

| Variable                  | Value                                  |
| :------------------------ | :------------------------------------- |
| `CASDOOR_CLIENT_ID`       | Your Application Client ID             |
| `CASDOOR_CLIENT_SECRET`   | Your Application Client Secret         |
| `CASDOOR_ORGANIZATION`    | `built-in` (or your name)              |
| `CASDOOR_APPLICATION`     | `app-built-in`                         |
| `NEXT_PUBLIC_CASDOOR_URL` | `http://localhost:8000`                |
| `NEXT_PUBLIC_API_URL`     | `http://localhost:8010` (Kong Gateway) |

---

## 6. Microservice Implementation

Your microservices (NestJS) can now trust the `x-user-id` header passed by Kong.

### Example: Reading User ID in a Controller

```typescript
@Get('me')
getProfile(@Headers('x-user-id') userId: string) {
  return this.usersService.findOne(userId);
}
```

---

## 7. Troubleshooting

### ❌ Error `401 Unauthorized`

- **Cause**: Kong cannot match the JWT's `iss` claim with a `key` in `jwt_secrets`.
- **Fix**: Decode your token at [jwt.io](https://jwt.io), find the `iss` value, and ensure it matches the `key` in `kong/config.yml` exactly (including trailing slashes).

### ❌ Error `invalid_grant` during callback

- **Cause**: The browser or React development mode is running the code exchange logic twice.
- **Fix**: Use a `useRef` guard in your Next.js `useEffect` to ensure `fetch('/api/auth/callback')` only executes once per code.

### ❌ Login Redirect Loop

- **Cause**: `CASDOOR_REDIRECT_URI` in `.env` doesn't match the one registered in Casdoor.
- **Fix**: Ensure both are set to `http://localhost:3000/callback`.
