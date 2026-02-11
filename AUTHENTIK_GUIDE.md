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

---

## 🏁 Inicio Rápido: Configuración Inicial

Si es la primera vez que levantas el ambiente, debes crear la cuenta de administrador.

1.  Accede a la URL de configuración inicial: [http://localhost:9000/if/flow/initial-setup/](http://localhost:9000/if/flow/initial-setup/)
2.  **Crear Usuario Administrador:**
    - Ingresa un nombre de usuario (ej. `akadmin`).
    - Ingresa una contraseña segura.
    - Confirma la contraseña.
3.  Haz clic en **Siguiente** (o el botón de confirmación).
4.  Una vez creado, serás redirigido al panel de administración. Si te pide login, usa las credenciales que acabas de crear.

---

## 🛠️ Configuración Paso a Paso en Authentik

### 1. Crear el Provider (OAuth2/OpenID)

El **Provider** define cómo Authentik se comunica con Kong y qué tipo de tokens emite.

1.  En el panel lateral de Authentik, ve a **Directory** > **Providers**.
2.  Haz clic en **Create**.
3.  Selecciona **OAuth2/OpenID Provider** y dale a **Next**.
4.  **Configuración Básica:**
    - **Name:** `Kong Gateway` (o el nombre que prefieras).
    - **Authentication flow:** `default-authentication-flow` (por defecto).
    - **Authorization flow:** `default-provider-authorization-explicit-consent` (o el que desees).
5.  **Configuración de Protocolo:**
    - **Client Type:** `Confidential`.
    - **Redirect URIs:** `http://localhost:8000/.*` (Usa regex si es necesario para múltiples rutas).
6.  **Configuración Avanzada (CRÍTICO):**
    - **Signing Key:** Selecciona `authentik Self-signed Certificate`.
    - **Encryption Key:** **DÉJALA VACÍA**. Si seleccionas una, Kong no podrá leer el token.
    - **Subject mode:** `Based on the User's hashed ID` (recomendado).
7.  Haz clic en **Finish**.
8.  **Importante:** Una vez creado, entra en el Provider y copia el **Client ID** y **Client Secret**. Los necesitarás para tu frontend o para pruebas de cURL.

### 2. Crear la Aplicación

La **Application** agrupa el Provider y lo expone en la interfaz de usuario.

1.  Ve a **Resources** > **Applications**.
2.  Haz clic en **Create**.
3.  **Configuración:**
    - **Name:** `Lumina E-Commerce` (Este es el nombre que verán los usuarios).
    - **Slug:** `lumina-ecommerce` (Se usa en las URLs).
    - **Provider:** Selecciona el Provider `Kong Gateway` que creaste antes.
    - **Launch URL:** `http://localhost:3000` (URL de tu frontend de Next.js).
4.  Haz clic en **Create**.

---

## 🎨 Personalización de la UI (Branding)

Authentik permite cambiar la apariencia de los flujos de login para que coincidan con tu marca.

### 1. Personalizar Títulos y Logos

1.  Ve a **System** > **Settings**.
2.  Busca la sección de **Branding settings**:
    - **Title:** Cambia `authentik` por `Lumina | Premium Store`.
    - **Logo (Light/Dark):** Sube tus propios archivos de imagen (PNG/SVG).
    - **Favicon:** Sube tu icono personalizado.
3.  Haz clic en **Save**.

### 2. Personalizar el CSS (Look & Feel)

Para un control más granular (colores, fondos):

1.  Ve a **System** > **Brands**.
2.  Edita la marca `default` (o crea una nueva).
3.  En el campo **Custom CSS**, puedes añadir estilos para sobrescribir la UI de Authentik:
    ```css
    :root {
      --ak-accent: #2563eb; /* Cambia el color principal al de tu ecommerce */
    }
    body {
      background: #f3f4f6; /* Fondo más estándar para ecommerce */
    }
    ```
4.  Asocia esta marca a tu flujo de autenticación si es necesario.

### 3. Personalizar Flujos de Login (Flows)

Puedes cambiar los textos y el comportamiento de las pantallas:

1.  Ve a **Customization** > **Flows**.
2.  Busca `default-authentication-flow`.
3.  Puedes editar las **Stages** (pantallas) para cambiar etiquetas como "Username" por "Email de Usuario" o añadir términos y condiciones.

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
