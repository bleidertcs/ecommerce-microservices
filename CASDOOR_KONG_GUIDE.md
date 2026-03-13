# 🔐 Guía de Integración Casdoor & Kong Gateway

Esta guía detallada explica la configuración de extremo a extremo para usar **Casdoor** como proveedor de identidad y **Kong** como API Gateway para asegurar tu arquitectura de microservicios.

---

## 📑 Tabla de Contenidos

1. [Prerrequisitos](#1-prerrequisitos)
2. [Configuración de Casdoor (Proveedor de Identidad)](#2-configuración-de-casdoor)
3. [Integración con Kong (El Guardián de Seguridad)](#3-integración-con-kong)
4. [Extracción de Clave Pública (Dos Métodos)](#4-extracción-de-clave-pública)
5. [Configuración de la Web App](#5-configuración-de-la-web-app)
6. [Implementación en Microservicios](#6-implementación-en-microservicios)
7. [Solución de Problemas](#7-solución-de-problemas)

---

## 1. Prerrequisitos

- Docker y Docker Compose instalados.
- Archivo `.env` en la raíz inicializado con los secretos de base de datos y aplicación.
- Kong ejecutándose en modo DB-less (configurado vía `kong/config.yml`).

---

## 2. Configuración de Casdoor (Referencia Rápida)

Para una configuración completa desde cero, consulta la **[MASTER_GUIDE.md](./MASTER_GUIDE.md#fase-4-identidad-casdoor)**.

### Puntos de Atención:
- **Enable privilege consent**: Obligatorio en la organización.
- **Grant Types**: Habilitar `Authorization Code`, `Refresh Token` y `Password`.
- **Redirect URLs**: Debe incluir `http://localhost:3000/callback`.

---

## 3. Integración con Kong

Kong debe configurarse para validar los JWT emitidos por Casdoor y pasar la identidad del usuario a los microservicios.

### Paso 1: Configuración del Plugin JWT

En `kong/config.yml`, añade el plugin `jwt` a tus rutas protegidas:

```yaml
plugins:
  - name: jwt
    config:
      key_claim_name: iss # Kong coincidirá el claim 'iss' con jwt_secrets
      claims_to_verify: ["exp"]
```

### Paso 2: Request Transformer (Inyección de Headers)

Este plugin extrae el `sub` (ID de Usuario) del JWT y lo inyecta como un header `x-user-id` para tus servicios.

```yaml
- name: request-transformer
  config:
    add:
      headers:
        - "x-user-id:$(jwt_claims.sub)"
        - "x-user-name:$(jwt_claims.name)"
```

---

## 4. Extracción de Clave Pública

Kong necesita la Clave Pública de Casdoor para verificar las firmas de los tokens. Usa uno de los dos métodos siguientes.

### Método A: Manual (Vía UI)

1. En Casdoor, ve a la pestaña **Certs**.
2. Busca el certificado `RS256` activo.
3. Haz clic en **Edit** y copia el contenido completo del campo **Public Key**.
4. Pégalo en `kong/config.yml` bajo `jwt_secrets` (ver [Método B](#método-b-automatizado-vía-script) para el formato YAML).

### Método B: Automatizado (Vía Script)

Proporcionamos un script de PowerShell para obtener la clave desde el endpoint JWKS de Casdoor y formatearla para Kong automáticamente.

1. Abre una terminal de PowerShell en el directorio raíz.
2. Ejecuta el script con el flag `-UpdateConfig` para actualizar automáticamente `kong/config.yml`:
   ```powershell
   ./scripts/fetch-casdoor-certs.ps1 -CasdoorUrl "http://localhost:8000" -UpdateConfig
   ```
3. El script hará lo siguiente:
   - Obtendrá las claves públicas desde `/.well-known/jwks`.
   - Extraerá el certificado RS256 activo.
   - Lo formateará como un bloque PEM.
   - Buscará la sección `jwt_secrets` en `kong/config.yml` y reemplazará la `rsa_public_key` con el contenido y la indentación correctos.

> [!TIP]
> Después de ejecutar el script, tu `kong/config.yml` debería verse similar a esto (no olvides verificar que el valor de `key` coincida):

```yaml
jwt_secrets:
  - consumer: [NOMBRE_CONSUMER]
    key: "http://localhost:8000" # Debe coincidir exactamente con el claim 'iss' en tu token
    algorithm: RS256
    rsa_public_key: |
      -----BEGIN PUBLIC KEY-----
      [CONTENIDO_DE_TU_LLAVE]
      -----END PUBLIC KEY-----
```

---

## 5. Configuración de la Web App

Asegúrate de que tu `web-app/.env` (y el `.env` raíz) coincidan con los ajustes de la aplicación en Casdoor:

| Variable                  | Valor                                     |
| :------------------------ | :---------------------------------------- |
| `CASDOOR_CLIENT_ID`       | Client ID de tu aplicación                |
| `CASDOOR_CLIENT_SECRET`   | Client Secret de tu aplicación            |
| `CASDOOR_ORGANIZATION`    | `built-in` (o el nombre que uses)         |
| `CASDOOR_APPLICATION`     | `app-built-in`                           |
| `NEXT_PUBLIC_CASDOOR_URL` | `http://localhost:8000`                   |
| `NEXT_PUBLIC_API_URL`     | `http://localhost:8010` (Kong Gateway)    |

---

## 6. Implementación en Microservicios

Tus microservicios (NestJS) ahora pueden confiar en el header `x-user-id` pasado por Kong.

### Ejemplo: Leer el ID de Usuario en un Controlador

```typescript
@Get('me')
getProfile(@Headers('x-user-id') userId: string) {
  return this.usersService.findOne(userId);
}
```

---

## 7. Solución de Problemas

### ❌ Error `init_by_lua error: error parsing declarative config file` (Invalid rsa_public_key)

- **Causa**: Kong usando el algoritmo `RS256` exige que el campo `rsa_public_key` contenga una Llave Pública en formato PEM (`-----BEGIN PUBLIC KEY-----`). Sin embargo, Casdoor por defecto muestra y entrega un Certificado X.509 (`-----BEGIN CERTIFICATE-----`). Si pegas el certificado directamente en `kong/config.yml`, Kong fallará al iniciarse.
- **Solución**: Debes extraer la Clave Pública RSA a partir del Certificado. Nuestro script actualizado (`scripts/extract-pubkey.ps1`) o `scripts/fetch-casdoor-certs.ps1` hace esto automáticamente. Si lo haces manual, puedes usar Node.js pre-instalado o una herramienta online para convertir el Certificado X.509 en un RSA Public Key y cambiar las cabeceras a `BEGIN/END PUBLIC KEY`.

### ❌ Error `401 Unauthorized`

- **Causa**: Kong no puede coincidir el claim `iss` del JWT con una `key` en `jwt_secrets`.
- **Solución**: Decodifica tu token en [jwt.io](https://jwt.io), busca el valor de `iss` y asegúrate de que coincida con la `key` en `kong/config.yml` exactamente (incluyendo barras diagonales finales).

### ❌ Error `invalid_grant` durante el callback

- **Causa**: El navegador o el modo de desarrollo de React están ejecutando la lógica de intercambio de código dos veces.
- **Solución**: Usa una guarda `useRef` en tu `useEffect` de Next.js para asegurar que `fetch('/api/auth/callback')` solo se ejecute una vez por código.

### ❌ Bucle de Redirección de Inicio de Sesión

- **Causa**: `CASDOOR_REDIRECT_URI` en el `.env` no coincide con la registrada en Casdoor.
- **Solución**: Asegúrate de que ambas estén configuradas como `http://localhost:3000/callback`.
