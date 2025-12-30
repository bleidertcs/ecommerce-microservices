# Arquitectura de Microservicios NestJS

[![NestJS](https://img.shields.io/badge/NestJS-10.4.6-red.svg)](https://nestjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-20.0.0-blue.svg)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Una arquitectura de microservicios lista para producción construida con **NestJS**, **gRPC**, **PostgreSQL**, **Redis** y **Kong API Gateway**. Este proyecto demuestra un patrón escalable y mantenible con comunicación entre servicios, autenticación centralizada, limitación de tasa (rate limiting) y monitoreo integral.

## 📋 Tabla de Contenidos

- [🏗️ Descripción General de la Arquitectura](#️-descripción-general-de-la-arquitectura)
- [🚀 Características](#-características)
- [📋 Requisitos Previos](#-requisitos-previos)
- [⚡ Inicio Rápido](#-inicio-rápido)
- [🔧 Configuración](#-configuración)
- [📡 Endpoints de la API](#-endpoints-de-la-api)
- [🧪 Desarrollo](#-desarrollo)
- [📊 Monitoreo y Salud](#-monitoreo-y-salud)
- [🔒 Seguridad](#-seguridad)
- [🚀 Despliegue](#-despliegue)
- [📚 Documentación](#-documentación)
- [🛠️ Resolución de Problemas](#️-resolución-de-problemas)
- [🤝 Contribuciones](#-contribuciones)
- [📄 Licencia](#-licencia)

---

## 🏗️ Descripción General de la Arquitectura

### Diagrama de Infraestructura

```mermaid
graph TB
    Client[Aplicaciones Cliente] --> Kong[Kong API Gateway<br/>Puerto: 8000]
    Kong --> Auth[Servicio Auth<br/>Puerto: 9001]
    Kong --> Post[Servicio Post<br/>Puerto: 9002]
    Auth --> PostgreSQL[(PostgreSQL<br/>Puerto: 5432)]
    Post --> PostgreSQL
    Auth --> Redis[(Redis<br/>Puerto: 6379)]
    Post --> Redis
    Auth -.->|gRPC| Post
    Post -.->|gRPC| Auth
```

### Flujo de Comunicación del Servicio

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Kong Gateway  │    │   Auth Service  │    │   Post Service  │
│   (API Gateway) │◄──►│   (Port: 9001)  │◄──►│   (Port: 9002)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     Redis       │    │   Monitoring    │
│   (Database)    │    │    (Cache)      │    │   (Health)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Diagrama de Secuencia (Lógica de Autenticación)

```mermaid
sequenceDiagram
    participant C as Cliente
    participant K as Kong Gateway
    participant P as Post Service
    participant A as Auth Service
    participant DB as PostgreSQL
    participant R as Redis

    C->>K: Petición HTTP (ej. Crear Post)
    K->>K: Verificar Rate Limit
    K->>P: Forward HTTP
    P->>A: gRPC: ValidateToken(JWT)
    A->>R: Verificar Caché de Token
    R-->>A: Token OK
    A-->>P: gRPC: Success (User Data)
    P->>DB: Prisma: Insert Post
    DB-->>P: Confirmación
    P-->>K: Respuesta HTTP 201
    K-->>C: Respuesta Final
```

---

## 🚀 Características

### 🔧 Servicios Core

- **🔐 Servicio de Auth**: Autenticación de usuarios, autorización y gestión de tokens JWT.
- **📝 Servicio de Post**: Gestión de publicaciones de blog con integración de usuarios.
- **🌐 Kong API Gateway**: Enrutamiento centralizado y gestión de APIs.
- **🗄️ PostgreSQL**: Base de datos principal para persistencia de datos (Prisma ORM).
- **⚡ Redis**: Capa de caché para optimización del rendimiento y sesiones.

### ⚡ Características Técnicas

- **🚀 Comunicación gRPC**: Comunicación entre servicios de alto rendimiento.
- **🔑 Autenticación JWT**: Sistema seguro basado en tokens (Access/Refresh).
- **👥 Autorización por Roles**: Soporte para roles ADMIN y USER.
- **🛡️ Rate Limiting**: Limitación de tasa basada en Kong con umbrales configurables.
- **📝 Soft Delete**: Seguimiento de auditoría e integridad de datos.
- **📄 Paginación**: Paginación eficiente para grandes conjuntos de datos.
- **🔍 Búsqueda y Filtrado**: Capacidades avanzadas de búsqueda y ordenación.
- **💚 Monitoreo de Salud**: Verificaciones de salud (Health Checks) integradas.
- **📖 Documentación de API**: Swagger/OpenAPI integrado en cada servicio.
- **🐳 Soporte Docker**: Despliegue contenerizado completo.
- **🔄 Migraciones de BD**: Gestión automatizada del esquema con Prisma.

---

## 📋 Requisitos Previos

Asegúrate de cumplir con los siguientes requisitos antes de comenzar:

- **🐳 Docker & Docker Compose**: Para despliegue contenerizado.
- **🟢 Node.js >= 18.0.0**: Para desarrollo local.
- **📦 npm >= 9.0.0**: Gestor de paquetes.
- **📝 Git**: Control de versiones.

### Requisitos del Sistema

- **RAM**: Mínimo 4GB (8GB recomendado).
- **Almacenamiento**: Al menos 2GB de espacio libre.
- **SO**: Windows, macOS, o Linux.

---

## ⚡ Inicio Rápido

### 1. 🚀 Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/nestjs-microservices.git
cd nestjs-microservices
```

### 2. 🔧 Configuración de Entorno

El proyecto incluye archivos `.env.docker` pre-configurados para el despliegue en Docker:

#### Configuración Servicio Auth (`auth/.env.docker`)

```env
APP_NAME="@backendworks/auth"
HTTP_PORT=9001
DATABASE_URL="postgresql://admin:master123@postgres:5432/postgres?schema=public"
ACCESS_TOKEN_SECRET_KEY="EAJYjNJUnRGJ6uq1YfGw4NG1pd1z102J"
REDIS_URL="redis://redis:6379"
GRPC_URL="0.0.0.0:50051"
```

#### Configuración Servicio Post (`post/.env.docker`)

```env
APP_NAME="@backendworks/post"
HTTP_PORT=9002
DATABASE_URL="postgresql://admin:master123@postgres:5432/postgres?schema=public"
GRPC_AUTH_URL="auth-service:50051"
REDIS_URL="redis://redis:6379"
```

### 3. 🐳 Iniciar los Servicios

```bash
# Iniciar con Docker Compose
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f
```

### 4. 🗄️ Configuración de Base de Datos

```bash
# Ejecutar migraciones
docker-compose exec auth-service npm run prisma:migrate
docker-compose exec post-service npm run prisma:migrate

# Generar cliente Prisma
docker-compose exec auth-service npm run prisma:generate
docker-compose exec post-service npm run prisma:generate
```

### 5. ✅ Verificar Instalación

```bash
# Verificar contenedores
docker-compose ps

# Probar rutas en Kong
curl http://localhost:8000/auth
curl http://localhost:8000/post

# Verificar headers de Rate Limit
curl -I http://localhost:8000/auth | grep RateLimit

# Endpoints de salud
curl http://localhost:9001/health
curl http://localhost:9002/health
```

---

## 🔧 Configuración

### Kong API Gateway

Protección mediante límites de tasa (Rate Limiting) en `kong/config.yml`:

- **Rutas de Auth**: 100 req/min, 1000/hora.
- **Rutas de Post**: 200 req/min, 2000/hora.
- **Global**: 300 req/min, 3000/hora.

**Cabeceras de Rate Limit:**

- `X-RateLimit-Limit-Minute`: Límite máximo por minuto.
- `X-RateLimit-Remaining-Minute`: Peticiones restantes.
- `RateLimit-Reset`: Segundos para el reinicio de la ventana.

**Prueba de Rate Limit:**

```bash
for i in {1..105}; do
  curl -s -w "Request $i: %{http_code}\n" -o /dev/null http://localhost:8000/auth
done
```

---

## 📡 Endpoints de la API

### 🌐 Kong API Gateway (Externo)

- **URL Base**: `http://localhost:8000`
- **Admin API**: `http://localhost:8001`

### 🔐 Autenticación (`/auth`)

- `POST /login`: Login de usuario.
- `POST /signup`: Registro de usuario.
- `GET  /refresh`: Refrescar Access Token.

### 👥 Gestión de Usuarios (`/auth`)

- `GET    /user/profile`: Obtener perfil (Protegido).
- `PUT    /user/profile`: Actualizar perfil (Protegido).
- `GET    /admin/user`: Listar usuarios (Solo ADMIN).
- `DELETE /admin/user/:id`: Eliminar usuario (Solo ADMIN).

### 📝 Gestión de Posts (`/post`)

- `GET    /post`: Listar posts (paginado).
- `POST   /post`: Crear post (Protegido).
- `PUT    /post/:id`: Actualizar post (Protegido).
- `DELETE /post/batch`: Borrado masivo (Protegido).

---

## 🧪 Desarrollo

### 🏠 Desarrollo Local

```bash
# Iniciar servicios individualmente
cd auth && npm run dev
cd post && npm run dev

# Ejecutar tests
npm test
```

### 🗄️ Gestión de Base de Datos

```bash
npm run prisma:migrate
npm run prisma:generate
npm run prisma:studio  # GUI para la base de datos
```

---

## 📊 Monitoreo y Salud

### Endpoints de Salud

- **Auth Service**: `http://localhost:9001/health`
- **Post Service**: `http://localhost:9002/health`
- **Kong Gateway**: `http://localhost:8001/status`

### Docker Health Checks

Todos los servicios incluyen `healthchecks` nativos en Docker para asegurar la conectividad antes de aceptar tráfico.

---

## 🔒 Seguridad

- **JWT Tokens**: Sistema de Access y Refresh tokens.
- **Hashing**: `bcrypt` para protección de contraseñas.
- **Seguridad HTTP**: `Helmet` para cabeceras seguras y protección contra ataques comunes.
- **CORS**: Configuración de orígenes permitidos.
- **Redes Docker**: Aislamiento de red entre base de datos y tráfico externo.

---

## 🚀 Despliegue

### Producción

```bash
# Construir imágenes de producción
docker-compose -f docker-compose.prod.yml up --build

# Escalar servicios
docker-compose up --scale auth-service=3 --scale post-service=3
```

---

## 📚 Guía: Cómo agregar un nuevo Microservicio

1.  **Estructura**: Copia el patrón de la carpeta `post/`.
2.  **Entorno**: Configura el puerto HTTP y gRPC en `.env.docker`.
3.  **Proto**: Define el contrato en `src/protos/nuevo-servicio.proto`.
4.  **Generación**: Ejecuta `npm run proto:generate` y `npm run prisma:generate`.
5.  **Kong**: Registra la nueva ruta y el servicio en `kong/config.yml`.
6.  **Docker**: Añade la definición del servicio en `docker-compose.yml`.
7.  **Auth**: Utiliza el `AuthJwtAccessGuard` para validar tokens contra el Auth Service vía gRPC.

---

## 🛠️ Resolución de Problemas

### 🔍 Problemas Comunes

#### El servicio no inicia

```bash
docker-compose logs [auth-service|post-service]
```

#### Problemas de Conexión a BD

```bash
# Verificar PostgreSQL
docker-compose exec postgres pg_isready -U admin
# Verificar Redis
docker-compose exec redis redis-cli ping
```

#### Errores de gRPC

```bash
# Verificar que los puertos 50051/50052 estén libres
# Asegúrate de que los contenedores estén en la misma red 'bw-network'
```

#### Problemas con Kong

```bash
# Listar servicios registrados
curl http://localhost:8001/services
# Reiniciar Kong
docker-compose restart kong
```

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Sigue estos pasos:

1. **Fork** el repositorio.
2. Crea una rama (`feature/nueva-funcionalidad`).
3. Realiza tus cambios y añade tests.
4. Asegúrate de que todos los tests pasen.
5. Abre un **Pull Request**.

---

## 🙏 Agradecimientos

- **Equipo de NestJS**: Por el excelente framework.
- **Equipo de Prisma**: Por la moderna gestión de BD.
- **Equipo de Kong**: Por el robusto API Gateway.
- **Docker**: Por la tecnología de contenedores.
- **Backend Works**: Por el desarrollo de la arquitectura.

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**.

## 📚 Repo Original

https://github.com/BackendWorks/nestjs-microservices

https://github.com/BackendWorks/auth

https://github.com/BackendWorks/post
