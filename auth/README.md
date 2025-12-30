# Servicio de Autenticación (Auth)

Este microservicio se encarga de la gestión de usuarios, autenticación basada en JWT y control de acceso por roles dentro de la arquitectura.

## 🚀 Características

-   **Autenticación**: Sistema de Login y Registro con Access y Refresh Tokens.
-   **Seguridad**: Hashing de contraseñas con `bcrypt` y protección de rutas.
-   **Gestión de Usuarios**: CRUD completo para administración de perfiles.
-   **Servidor gRPC**: Expone métodos para que otros microservicios validen tokens.
-   **Caché Integrada**: Uso de Redis para gestión de sesiones y rendimiento.
-   **Internacionalización**: Soporte multi-idioma para mensajes de respuesta.
-   **Documentación**: Swagger UI integrado para pruebas rápidas.

---

## 🏗️ Arquitectura Técnica

-   **Framework**: NestJS 10 (Fastify/Express)
-   **Base de Datos**: PostgreSQL con Prisma ORM.
-   **Caché**: Redis (ioredis).
-   **Comunicación**: gRPC + REST (HTTP).
-   **Validación**: DTOs con `class-validator`.

### Estructura del Proyecto

```
src/
├── common/           # Decoradores, guards y utilidades compartidas
├── generated/        # Interfaces generadas de archivos .proto
├── languages/        # Archivos de traducción (i18n)
├── modules/
│   ├── auth/        # Lógica de login, registro y tokens
│   └── user/        # Gestión de entidades de usuario y perfiles
└── protos/          # Definiciones de gRPC
```

---

## 🛠️ Instalación y Configuración

### 1. Entorno

Asegúrate de tener un archivo `.env` o utiliza el configurado para Docker en `.env.docker`.

Variables clave:

-   `DATABASE_URL`: URI de conexión a PostgreSQL.
-   `ACCESS_TOKEN_SECRET_KEY`: Secreto para firmar el token de acceso.
-   `REDIS_URL`: Endpoint de Redis.
-   `GRPC_URL`: Dirección de escucha para gRPC (ej: `0.0.0.0:50051`).

### 2. Comandos de Inicialización

```bash
# Instalar dependencias
npm install

# Generar cliente de base de datos
npm run prisma:generate

# Generar tipos gRPC
npm run proto:generate

# Iniciar en desarrollo
npm run dev
```

---

## 📡 API y Contratos

### Endpoints HTTP

-   `POST /v1/auth/login`: Autentica al usuario y retorna tokens.
-   `POST /v1/auth/signup`: Crea un nuevo usuario.
-   `GET  /v1/auth/refresh`: Renueva el access token.
-   `GET  /v1/user/profile`: Obtiene datos del usuario actual (Protegido).

### Servicios gRPC

El servicio expone el contrato `AuthService`:

-   `ValidateToken`: Recibe un token y retorna el payload (`id`, `role`) si es válido.

---

## 🔒 Roles

El sistema soporta dos roles principales:

1.  **USER**: Acceso a perfil propio y creación de contenido.
2.  **ADMIN**: Acceso a listado de usuarios y eliminación de cuentas.

---

## 📊 Monitoreo

Check de salud disponible en: `http://localhost:9001/health`
Documentación Swagger: `http://localhost:9001/docs`
