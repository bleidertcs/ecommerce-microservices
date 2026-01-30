# Guía de Integración: Kong + Authentik

## Arquitectura del Sistema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   Cliente   │────▶│    Kong     │────▶│  Post Service   │
│  (Frontend) │     │  (Gateway)  │     │  (Microservicio)│
└─────────────┘     └──────┬──────┘     └─────────────────┘
       │                   │
       │                   │ Valida firma JWT
       ▼                   │ con Public Key
┌─────────────┐            │
│  Authentik  │◀───────────┘
│    (IdP)    │
└─────────────┘
```

## Flujo de Autenticación

1. **Usuario solicita token:** El cliente envía credenciales a Authentik (`/application/o/token/`).
2. **Authentik genera JWT:** Firma el token con su clave privada (RS256).
3. **Cliente envía petición:** Incluye el token en `Authorization: Bearer <TOKEN>`.
4. **Kong valida el token:** Usa la clave pública configurada en `jwt_secrets`.
5. **Kong extrae el usuario:** Lee el claim `sub` y lo inyecta como `X-User-ID`.
6. **Microservicio procesa:** Recibe la petición con la identidad del usuario.

---

## Configuración de Authentik

### Provider OIDC

| Campo              | Valor                             |
| ------------------ | --------------------------------- |
| **Name**           | Kong Microservices                |
| **Client Type**    | Confidential                      |
| **Redirect URIs**  | `http://localhost:8000/.*`        |
| **Signing Key**    | authentik Self-signed Certificate |
| **Encryption Key** | **VACÍO** (importante)            |

> ⚠️ **IMPORTANTE:** Si configuras una "Llave de Encriptación", Authentik generará tokens JWE (encriptados) que Kong NO puede validar. Deja este campo vacío.

### Application

| Campo        | Valor              |
| ------------ | ------------------ |
| **Name**     | Gateway API        |
| **Slug**     | gateway-api        |
| **Provider** | Kong Microservices |

---

## Configuración de Kong

### Plugin JWT (en rutas protegidas)

```yaml
plugins:
  - name: jwt
    config:
      claims_to_verify:
        - exp
      key_claim_name: iss
```

### JWT Secrets (clave pública de Authentik)

```yaml
jwt_secrets:
  - consumer: test-user
    key: http://localhost:9000/application/o/gateway-api/
    algorithm: RS256
    rsa_public_key: |
      -----BEGIN PUBLIC KEY-----
      ... (extraída del certificado de Authentik) ...
      -----END PUBLIC KEY-----
```

### Request Transformer (propagar usuario)

```yaml
- name: request-transformer
  config:
    add:
      headers:
        - x-user-id:$(jwt_claim_sub)
        - x-user-role:USER
```

---

## Cómo Obtener un Token

### Terminal (Client Credentials)

```bash
curl -X POST http://localhost:9000/application/o/token/ \
  -d "grant_type=client_credentials" \
  -d "client_id=<TU_CLIENT_ID>" \
  -d "client_secret=<TU_CLIENT_SECRET>" \
  -d "scope=openid profile"
```

### Probar con Kong

```bash
curl -i -H "Authorization: Bearer <TOKEN>" http://localhost:8000/post
```

---

## Troubleshooting

| Error                                         | Causa                     | Solución                                   |
| --------------------------------------------- | ------------------------- | ------------------------------------------ |
| `401 Unauthorized`                            | Token inválido o expirado | Genera un nuevo token                      |
| Token empieza con `eyJhbGciOiJSU0EtT0FFUC...` | Token encriptado (JWE)    | Quita "Llave de Encriptación" en Authentik |
| `invalid key` en logs de Kong                 | Clave pública incorrecta  | Extrae la PUBLIC KEY del certificado       |
| Kong no inicia                                | YAML mal formateado       | Verifica indentación en `config.yml`       |

---

## Extracción de Clave Pública

Si solo tienes el certificado (.pem), usa este script:

```javascript
// extract_key.js
const crypto = require("crypto");
const cert = `-----BEGIN CERTIFICATE-----
...tu certificado...
-----END CERTIFICATE-----`;
console.log(
  crypto.createPublicKey(cert).export({ type: "spki", format: "pem" }),
);
```

Ejecuta: `node extract_key.js`
