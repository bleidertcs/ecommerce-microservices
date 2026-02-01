# Servicios E-commerce - Documentación Completa

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Servicios Implementados](#servicios-implementados)
- [Modelos de Datos](#modelos-de-datos)
- [API Endpoints](#api-endpoints)
- [Autenticación](#autenticación)
- [Configuración](#configuración)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Datos de Prueba](#datos-de-prueba)

---

## Descripción General

Sistema de microservicios para e-commerce construido con NestJS, PostgreSQL, RabbitMQ y Kong API Gateway. Incluye tres servicios principales con datos realistas generados con Faker.

### Tecnologías Principales

- **Backend**: NestJS + TypeScript
- **Base de Datos**: PostgreSQL (una DB por servicio)
- **Message Queue**: RabbitMQ para comunicación asíncrona
- **RPC**: gRPC para comunicación síncrona entre servicios
- **API Gateway**: Kong para enrutamiento y autenticación
- **Cache**: Redis
- **Monitoring**: Grafana Stack (Loki, Tempo, Mimir)
- **Autenticación**: Authentik (OAuth2/OIDC)

---

## Arquitectura

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│      Kong API Gateway (:8000)       │
│  ┌──────────┐  ┌─────────────────┐ │
│  │   JWT    │  │ Rate Limiting   │ │
│  │ AuthN/Z  │  │  100 req/min    │ │
│  └──────────┘  └─────────────────┘ │
└──────────┬──────────────────────────┘
           │
    ┌──────┴───────┬───────────┐
    │              │           │
    ▼              ▼           ▼
┌────────┐   ┌───────────┐  ┌────────┐
│ Users  │   │ Products  │  │ Orders │
│ :9001  │   │  :9002    │  │ :9003  │
│        │   │           │  │        │
│ ┌────┐ │   │  ┌────┐   │  │ ┌────┐│
│ │ DB │ │   │  │ DB │   │  │ │ DB │││
│ └────┘ │   │  └────┘   │  │ └────┘││
└────┬───┘   └─────┬─────┘  └───┬────┘
     │             │            │
     │      ┌──────┴────────┐   │
     └──────►   RabbitMQ    ◄───┘
            │   (:5672)     │
            └───────────────┘
                   │
            ┌──────┴──────┐
            ▼             ▼
       ┌────────┐   ┌────────┐
       │  Loki  │   │ Tempo  │
       │ (Logs) │   │(Traces)│
       └────────┘   └────────┘
```

---

## Servicios Implementados

### 1. **Users Service** (Puerto 9001)

Gestión de usuarios, autenticación y perfiles.

**Características:**

- ✅ Autenticación con username/password
- ✅ Roles: CUSTOMER y ADMIN
- ✅ Gestión de direcciones (envío y facturación)
- ✅ Métodos de pago múltiples
- ✅ Soft delete
- ✅ Perfiles con avatares

**Base de Datos:** `users` (PostgreSQL)

**Comunicación:**

- HTTP REST API (público vía Kong)
- gRPC Server en puerto 50051 (interno)

---

### 2. **Products Service** (Puerto 9002)

Catálogo de productos con inventario.

**Características:**

- ✅ Gestión de productos con SKU único
- ✅ Múltiples imágenes por producto
- ✅ Sistema de ratings y reviews
- ✅ Categorización y tags
- ✅ Control de stock
- ✅ Productos destacados

**Base de Datos:** `products` (PostgreSQL)

**Comunicación:**

- HTTP REST API (público vía Kong)
- gRPC Server en puerto 50052 (interno)

---

### 3. **Orders Service** (Puerto 9003)

Gestión de órdenes de compra.

**Características:**

- ✅ Creación de órdenes con múltiples items
- ✅ Cálculo automático de subtotal, envío e impuestos
- ✅ Tracking de envíos
- ✅ Estados de orden completos
- ✅ Estados de pago
- ✅ Validación de usuarios vía gRPC
- ✅ Publicación de eventos en RabbitMQ

**Base de Datos:** `orders` (PostgreSQL)

**Comunicación:**

- HTTP REST API (protegido con JWT vía Kong)
- gRPC Server en puerto 50053 (interno)
- gRPC Client (consume Users y Products)
- RabbitMQ Publisher (eventos de órdenes)

---

## Modelos de Datos

### User Model

```typescript
{
  id: string (UUID)
  email: string (unique)
  username: string (unique)
  password: string (hashed with bcrypt)
  role: "CUSTOMER" | "ADMIN"
  firstName: string
  lastName: string
  phone: string?
  avatar: string? (URL)
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }?
  billingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }?
  paymentMethods: [{
    type: string
    last4: string
    expiryMonth: number
    expiryYear: number
    isDefault: boolean
  }]?
  createdAt: DateTime
  updatedAt: DateTime
  isDeleted: boolean
  deletedAt: DateTime?
}
```

### Product Model

```typescript
{
  id: string (UUID)
  name: string
  description: string?
  sku: string (unique)
  brand: string?
  price: number
  stock: number
  category: string?
  images: string[] (URLs)
  rating: number (0-5)
  reviewCount: number
  tags: string[]
  featured: boolean
  createdAt: DateTime
  updatedAt: DateTime
  isDeleted: boolean
  deletedAt: DateTime?
}
```

### Order Model

```typescript
{
  id: string (UUID)
  userId: string (ref to User)
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    recipientName: string
    recipientPhone: string
  }
  paymentMethod: string
  paymentStatus: "PENDING" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUNDED"
  status: "PENDING" | "PROCESSING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
  trackingNumber: string?
  createdAt: DateTime
  updatedAt: DateTime
  isDeleted: boolean
  deletedAt: DateTime?
}
```

### OrderItem Model

```typescript
{
  id: string (UUID)
  orderId: string
  productId: string (ref to Product)
  productName: string (snapshot)
  quantity: number
  price: number (per unit at purchase time)
}
```

---

## API Endpoints

### Base URL

```
Kong Gateway: http://localhost:8000
```

### Users Service

| Método | Endpoint            | Auth   | Descripción                    |
| ------ | ------------------- | ------ | ------------------------------ |
| GET    | `/api/v1/users`     | ✅ JWT | Listar usuarios                |
| GET    | `/api/v1/users/:id` | ✅ JWT | Obtener usuario                |
| POST   | `/api/v1/users`     | ✅ JWT | Crear usuario                  |
| PUT    | `/api/v1/users/:id` | ✅ JWT | Actualizar usuario             |
| PATCH  | `/api/v1/users/:id` | ✅ JWT | Actualizar parcialmente        |
| DELETE | `/api/v1/users/:id` | ✅ JWT | Eliminar usuario (soft delete) |

### Products Service

| Método | Endpoint               | Auth | Descripción             |
| ------ | ---------------------- | ---- | ----------------------- |
| GET    | `/api/v1/products`     | ❌   | Listar productos        |
| GET    | `/api/v1/products/:id` | ❌   | Obtener producto        |
| POST   | `/api/v1/products`     | ❌   | Crear producto          |
| PUT    | `/api/v1/products/:id` | ❌   | Actualizar producto     |
| PATCH  | `/api/v1/products/:id` | ❌   | Actualizar parcialmente |
| DELETE | `/api/v1/products/:id` | ❌   | Eliminar producto       |

**Nota:** Los endpoints de Products están protegidos con rate limiting (100 req/min).

### Orders Service

| Método | Endpoint             | Auth   | Descripción    |
| ------ | -------------------- | ------ | -------------- |
| GET    | `/api/v1/orders`     | ✅ JWT | Listar órdenes |
| GET    | `/api/v1/orders/:id` | ✅ JWT | Obtener orden  |
| POST   | `/api/v1/orders`     | ✅ JWT | Crear orden    |
| DELETE | `/api/v1/orders/:id` | ✅ JWT | Cancelar orden |

### Health Endpoints (Directos)

```bash
http://localhost:9001/health  # Users
http://localhost:9002/health  # Products
http://localhost:9003/health  # Orders
```

---

## Autenticación

### Proveedor: Authentik

El sistema utiliza Authentik como proveedor de identidad (OAuth2/OIDC).

**URL**: http://localhost:9000

### Obtener Token JWT

```bash
curl -X POST "http://localhost:9000/application/o/token/" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=iERI2KYzqdnazHUER0lTdX6TEWDjTCj3MKNUEryR" \
  -d "client_secret=ck4VEu4v0YQimONsXbQKXpPr5YzG0doHfK63oqv8sstRDMfFZ9vPDHj5X6ThosWPzdjzsTT2T9zZcn7rQi8U2tFd82XuoxfVEiOIywcNvZPS1Ib2wAOjIqQAt05b1RZa"
```

### Usar Token en Requests

```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/v1/users
```

### Servicios Protegidos

- ✅ **Users Service**: Requiere JWT
- ✅ **Orders Service**: Requiere JWT
- ❌ **Products Service**: Público (con rate limiting)

---

## Configuración

### Variables de Entorno

Cada servicio tiene su archivo `.env.docker`:

**users/.env.docker:**

```env
NODE_ENV=development
HTTP_PORT=9001
GRPC_URL=0.0.0.0:50051
DATABASE_URL="postgresql://admin:master123@users-db:5432/users"
REDIS_URL="redis://redis:6379"
RABBITMQ_URL="amqp://admin:admin@rabbitmq:5672"
```

**products/.env.docker:**

```env
NODE_ENV=development
HTTP_PORT=9002
GRPC_URL=0.0.0.0:50052
DATABASE_URL="postgresql://admin:master123@products-db:5432/products"
REDIS_URL="redis://redis:6379"
RABBITMQ_URL="amqp://admin:admin@rabbitmq:5672"
```

**orders/.env.docker:**

```env
NODE_ENV=development
HTTP_PORT=9003
GRPC_URL=0.0.0.0:50053
DATABASE_URL="postgresql://admin:master123@orders-db:5432/orders"
REDIS_URL="redis://redis:6379"
RABBITMQ_URL="amqp://admin:admin@rabbitmq:5672"
USERS_GRPC_URL="users-service:50051"
PRODUCTS_GRPC_URL="products-service:50052"
```

### Kong Gateway

Configuración en `kong/config.yml`:

- **JWT Authentication**: Users y Orders services
- **Rate Limiting**: Products service (100 req/min)
- **Request Transformer**: Inyecta `x-user-id` en headers

---

## Ejemplos de Uso

### 1. Listar Productos (Público)

```bash
curl http://localhost:8000/api/v1/products
```

**Respuesta:**

```json
{
  "status": "ok",
  "message": "Hello from Products Service",
  "environment": "local"
}
```

### 2. Obtener un Producto Específico

```bash
curl http://localhost:8000/api/v1/products/123e4567-e89b-12d3-a456-426614174000
```

### 3. Crear una Orden (Requiere Auth)

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "items": [
      {
        "productId": "product-uuid",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "recipientName": "John Doe",
      "recipientPhone": "+1234567890"
    },
    "paymentMethod": "Credit Card"
  }'
```

### 4. Listar Usuarios (Requiere Auth)

```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/v1/users
```

### 5. Verificar Health

```bash
# Todos los servicios
curl http://localhost:9001/health
curl http://localhost:9002/health
curl http://localhost:9003/health
```

---

## Datos de Prueba

El sistema incluye datos realistas generados con Faker:

### 50 Usuarios

- **10 Administradores**
- **40 Clientes**

Todos los usuarios tienen:

- Email y username únicos
- Password: `Password123!` (encriptada con bcrypt)
- Direcciones de envío y facturación
- 1-3 métodos de pago
- Datos de perfil completos

### 100 Productos

Distribuidos en 10 categorías:

- Electronics
- Clothing
- Home & Garden
- Books
- Sports & Outdoors
- Toys & Games
- Beauty & Personal Care
- Automotive
- Food & Beverages
- Health & Wellness

**Características:**

- Precio: $10 - $1,000
- Stock: 0 - 500 unidades
- Ratings: 3.5 - 5.0 estrellas
- 1-4 imágenes por producto
- 2-5 tags por producto

### 200 Órdenes

**Distribución de Estados:**

- PENDING: ~10% (20 órdenes)
- PROCESSING: ~10% (20 órdenes)
- PAID: ~30% (60 órdenes)
- SHIPPED: ~25% (50 órdenes)
- DELIVERED: ~15% (30 órdenes)
- CANCELLED: ~5% (10 órdenes)
- REFUNDED: ~5% (10 órdenes)

---

## Comandos Útiles

### Reiniciar Servicios

```bash
docker-compose restart users-service products-service orders-service
```

### Ver Logs

```bash
docker-compose logs -f users-service
docker-compose logs -f products-service
docker-compose logs -f orders-service
```

### Acceder a Prisma Studio

```bash
cd users
pnpm prisma:studio  # http://localhost:5555
```

### Re-sembrar Datos

```bash
# Dentro de cada carpeta de servicio
docker exec bw-users-service pnpm exec ts-node prisma/seed.ts
docker exec bw-products-service pnpm exec ts-node prisma/seed.ts
docker exec bw-orders-service pnpm exec ts-node prisma/seed.ts
```

### Monitoreo

- **Grafana**: http://localhost:3000 (admin/admin)
- **RabbitMQ**: http://localhost:15672 (admin/admin)
- **Authentik**: http://localhost:9000

---

## Comunicación Entre Servicios

### gRPC (Síncrona)

```
Orders Service
    ↓ (gRPC)
Users Service  → Validar usuario existe
    ↓ (gRPC)
Products Service → Validar stock y obtener precio
```

### RabbitMQ (Asíncrona)

```
Orders Service → Publica: "order.created" evento
    ↓
RabbitMQ Exchange
    ↓
[Cualquier servicio puede suscribirse]
```

---

## Troubleshooting

### Los servicios no responden

```bash
# Verificar estado
docker ps | grep bw-

# Reiniciar servicios
docker-compose restart users-service products-service orders-service
```

### Error de conexión a base de datos

```bash
# Verificar DBs están corriendo
docker ps | grep db

# Ver logs de DB
docker logs bw-users-db
```

### JWT inválido

1. Verificar que el token no haya expirado
2. Obtener un nuevo token de Authentik
3. Verificar que la clave pública en Kong coincida con Authentik

---

## Soporte

Para más información, consultar:

- [Implementation Plan](./brain/implementation_plan.md)
- [Execution Report](./brain/ecommerce_execution_report.md)
- [Walkthrough](./brain/walkthrough.md)
