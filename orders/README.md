# Servicio de Publicaciones (Post)

Este microservicio gestiona todo el ciclo de vida de las publicaciones (blog posts), incluyendo la creación, búsqueda, actualización y eliminación lógica.

## 🚀 Características

- **Gestión de Contenido**: CRUD completo de posts con soporte para imágenes.
- **Seguimiento de Auditoría**: Rastreo de quién crea, edita o elimina cada post.
- **Eliminación Lógica**: Los registros no se borran físicamente, facilitando auditorías.
- **Búsqueda y Filtrado**: Capacidad de búsqueda por texto y paginación eficiente.
- **Caché con Redis**: Almacenamiento temporal de listados para alta concurrencia.
- **Integración gRPC**: Se conecta al `Auth Service` para verificar la identidad del usuario en cada petición protegida.

---

## 🏗️ Arquitectura y Tecnologías

- **Backend**: NestJS 10.
- **Persistencia**: PostgreSQL + Prisma ORM.
- **Caché**: Redis.
- **Inter-comunicación**: Cliente gRPC para comunicación con el servicio de autenticación.

---

## 🛠️ Configuración

### Dependencias

Este servicio **depende** del `Auth Service` para validar los tokens JWT.

### Variables de Entorno Clave

- `DATABASE_URL`: Conexión a Postgres.
- `GRPC_AUTH_URL`: Dirección gRPC del servicio Auth (ej: `auth-service:50051`).
- `REDIS_URL`: Endpoint de Redis.

### Instalación

```bash
npm install
npm run prisma:generate
npm run proto:generate
npm run dev
```

---

## 📡 Endpoints de la API

### Gestión de Posts

- `GET /v1/post`: Lista publicaciones (paginado). Soporta parámetros `page`, `limit` y `search`.
- `POST /v1/post`: Crea un post (Requiere Autenticación).
- `PUT /v1/post/:id`: Actualiza un post propio (Requiere Autenticación).
- `DELETE /v1/post/batch`: Eliminación masiva de posts por IDs (Requiere Autenticación).

### Parámetros de Consulta (Query Params)

- `search`: Filtra por título o contenido.
- `page`: Número de página (Default: 1).
- `limit`: Cantidad de resultados (Default: 10).

---

## 🔌 Integración con Auth Service

El `Post Service` utiliza un **Guardia gRPC** (`AuthJwtAccessGuard`). Cuando un cliente envía un token en los encabezados HTTP, el servicio:

1. Extrae el token.
2. Invoca el método `ValidateToken` del servicio Auth vía gRPC.
3. Si el token es válido, inyecta los datos del usuario en la petición.

---

## 📊 Salud y Documentación

Endpoint de salud: `http://localhost:9002/health`
Swagger: `http://localhost:9002/docs`
