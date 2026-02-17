---
description: Configuración inicial y gestión de Casdoor como Identity Provider
---

# Workflow: Setup y Gestión de Casdoor

Este workflow detalla cómo configurar Casdoor después del despliegue inicial.

## 1. Acceso Inicial

- URL: `http://localhost:8000`
- Credenciales por defecto: `admin` / `123`

## 2. Configuración de Organización

1. Ve a **Identity** > **Organizations**.
2. Edita la organización `built-in`.
3. > [!IMPORTANT]
   > Habilita la opción **"Enable privilege consent"** (Tiene consentimiento de privilegios). Sin esto, Casdoor no permitirá el registro automático de nuevos usuarios en la organización global `built-in`.
4. Configura el nombre para mostrar y el dominio si es necesario.

## 3. Configuración de Aplicación

1. Ve a **Identity** > **Applications**.
2. Edita `app-built-in` o crea una nueva.
3. **Redirect URLs**: Añade `http://localhost:3000/callback`.
4. **Grant Types**: Asegúrate de que `Authorization Code` y `Password` estén marcados.
5. Copia el **Client ID** y **Client Secret** al archivo `.env` de la raíz y al de `web-app/`.

## 4. Certificados y JWT

1. Ve a **Certs**.
2. Asegúrate de que hay un certificado de tipo `RS256`.
3. Copia la **Public Key** y actualiza `kong/config.yml` en la sección `jwt_secrets`.

## 5. Sincronización de Base de Datos

Casdoor inicializará las tablas automáticamente en el primer arranque usando la base de datos `casdoor` definida en `docker-compose.yml`.

## Notas:

- Casdoor ofrece una interfaz más intuitiva para gestionar roles y permisos.
- Puedes personalizar el branding directamente desde la sección **Organizations**.
