# 📖 Guía Completa de Ecosistema: Microservicios E-commerce

Esta guía detalla la configuración integral del sistema, incluyendo **Authentik** (Identidad), **Kong** (Gateway), **Grafana LGTM Stack** (Observabilidad) y los microservicios de **Users, Products y Orders**.

---

## 🏗️ 1. Arquitectura General

```mermaid
graph TD
    Client[Cliente/Frontend] --> Kong[Kong Gateway :8000]

    subgraph "Seguridad"
        Kong --> |JWT Auth| AK[Authentik IDP :9000]
    end

    subgraph "Microservicios (NestJS)"
        Kong --> Users[Users Service :9001]
        Kong --> Products[Products Service :9002]
        Kong --> Orders[Orders Service :9003]
    end

    subgraph "Persistencia y Eventos"
        Orders -- "Transacción + Outbox" --> DB[(Orders DB)]
        Orders -- "Async Events" --> RMQ[RabbitMQ]
        Products & Users --- PDB[(Service DBs)]
        Users & Products & Orders --- Redis[(Redis Cache)]
    end

    subgraph "Observabilidad Stack"
        Grafana[Grafana :3000]
        Loki[Loki - Logs]
        Tempo[Tempo - Traces]
        Mimir[Mimir - Metrics]
        Pyro[Pyroscope - Profiles]
    end
```

---

---

## 🚀 2. Guía de Iniciación paso a paso

1.  **Preparar Infraestructura**:
    ```bash
    docker-compose up -d users-db products-db orders-db redis rabbitmq
    ```
2.  **Configurar Variables de Entorno**:
    Asegúrate de que cada microservicio (`/users`, `/products`, `/orders`) tenga un archivo `.env` con la `DATABASE_URL` apuntando a los puertos mapeados (`15431`, `15432`, `15433` respectivamente) para poder correr migraciones desde el host:
    - **Users**: `DATABASE_URL="postgresql://admin:master123@localhost:15431/users?schema=public"`
    - **Products**: `DATABASE_URL="postgresql://admin:master123@localhost:15432/products?schema=public"`
    - **Orders**: `DATABASE_URL="postgresql://admin:master123@localhost:15433/orders?schema=public"`

3.  **Migraciones y Seeding**:
    Ejecuta lo siguiente en la raíz del proyecto para inicializar las bases de datos:

    ```bash
    # Usuarios
    cd users; npx prisma migrate dev --name init; npx prisma db seed; cd ..
    # Productos
    cd products; npx prisma migrate dev --name init; npx prisma db seed; cd ..
    # Órdenes
    cd orders; npx prisma migrate dev --name init; npx prisma db seed; cd ..
    ```

4.  **Levantar el Resto del Ecosistema**:
    ```bash
    docker-compose up -d
    ```

---

## 📦 3. Paso 1: Levantamiento del Ambiente

1.  **Levantar infraestructura básica**:
    ```bash
    docker-compose up -d redis rabbitmq users-db products-db orders-db
    ```
2.  **Levantar Identidad y Gateway**:
    ```bash
    docker-compose up -d authentik-server authentik-worker kong
    ```
3.  **Levantar Observabilidad**:
    ```bash
    docker-compose up -d grafana loki tempo mimir pyroscope otel-collector promtail
    ```
4.  **Levantar Microservicios**:
    ```bash
    docker-compose up -d users-service products-service orders-service
    ```

---

## 🔐 3. Paso 2: Configuración de Authentik

### A. Acceso Inicial

1. Navega a `http://localhost:9000/if/flow/initial-setup/`.
2. Configura la contraseña del administrador.

### B. Crear Provider OIDC

1. **Directory** > **Providers** > **Create** > **OAuth2/OpenID Provider**.
2. **Name**: `Kong Gateway`.
3. **Client Type**: `Confidential`.
4. **Redirect URIs**: `http://localhost:8000/.*` (regex).
5. **Signing Key**: Selecciona el certificado auto-firmado de Authentik.
6. **Encryption Key**: **DÉJALA VACÍA** (Kong no soporta JWE por defecto).

### C. Crear Application

1. **Resources** > **Applications** > **Create**.
2. **Name**: `Gateway API`.
3. **Slug**: `gateway-api`.
4. **Provider**: Selecciona el que creaste en el paso anterior.

### D. Extraer Clave Pública para Kong

1. Ve a **System** > **Certificates**.
2. Selecciona el certificado que usaste en el Provider.
3. Haz clic en **Download Certificate** (.pem).
4. Para Kong, necesitas la **Public Key**, no el certificado. Ejecuta esto con tu certificado:
   ```bash
   openssl x509 -pubkey -noout -in su-certificado.pem
   ```
5. Copia el resultado y pégalo en `kong/config.yml` bajo la sección `rsa_public_key`.

---

## 🌉 4. Paso 3: Configuración de Kong

Kong está configurado en modo DB-less. Para aplicar cambios, edita `kong/config.yml`.

### Plugins Activos:

- **JWT**: Valida la firma contra la clave de Authentik.
- **Request Transformer**: Extrae el `sub` del JWT y lo inyecta como `x-user-id`.
- **Rate Limiting**:
  - Limitación por **Header** (`x-user-id`) para servicios protegidos.
  - Limitación por **IP** para el catálogo público.
  - Persistencia en **Redis**.

---

## 📊 5. Paso 4: Guía de Observabilidad

Acceso: `http://localhost:3000` (User: `admin`, Pass: `admin`).

1.  **Logs (Loki)**: Explora logs estructurados en JSON. Filtra por `service_name="orders-service"`.
2.  **Traces (Tempo)**: Busca por `Trace ID`. Verás el recorrido desde Kong -> Gateway -> Microservicio -> gRPC -> DB.
3.  **Continuous Profiling (Pyroscope)**: En el menú lateral de Grafana, busca **Explore** > **Pyroscope**. Podrás ver **Flamegraphs** de CPU y Memoria en tiempo real para cada microservicio.

---

## 🧪 6. Paso 6: Guía de Pruebas (Testing)

Las pruebas están diseñadas para ejecutarse dentro de los contenedores para asegurar paridad con el entorno de ejecución, aunque también pueden correrse localmente.

### A. Ejecución en Contenedores (Recomendado)

Esta es la forma más fiable ya que usa las mismas dependencias y versiones de Node que la aplicación:

```bash
# Probar el servicio de Usuarios
docker-compose exec users-service pnpm run test

# Probar el servicio de Productos
docker-compose exec products-service pnpm run test

# Probar el servicio de Órdenes (Incluye Circuit Breaker y Outbox)
docker-compose exec orders-service pnpm run test
```

> [!TIP]
> Si deseas ejecutar solo un archivo específico para ahorrar tiempo:
> `docker-compose exec orders-service pnpm jest test/unit/orders.service.spec.ts`

### B. Cobertura de Código

Para ver el reporte de cobertura completo (Coverage):

```bash
docker-compose exec orders-service pnpm run test --coverage
```

### C. Ejecución Local

Si prefieres ejecutar las pruebas sin Docker (requiere `pnpm` instalado localmente):

1.  Entra en la carpeta del servicio: `cd orders`.
2.  Instala dependencias: `pnpm install`.
3.  Corre los tests: `pnpm run test`.

---

## 🔌 7. Paso 7: Guía de Uso (cURLs)

### A. Obtener Token de Acceso

Reemplaza los valores con los de tu Application en Authentik:

```bash
curl -X POST http://localhost:9000/application/o/token/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "username=tu_usuario" \
  -d "password=tu_password" \
  -d "client_id=TU_CLIENT_ID" \
  -d "client_secret=TU_CLIENT_SECRET" \
  -d "scope=openid profile email"
```

### B. Consultar Catálogo de Productos (Público)

_Sujeto a Rate Limiting por IP (100 req/min)_.

```bash
curl -i http://localhost:8000/api/v1/products
```

### C. Consultar mis Órdenes (Protegido)

_Identificado por JWT, Rate Limiting por usuario (30 req/min)_.

```bash
curl -i -H "Authorization: Bearer <TU_TOKEN>" \
  http://localhost:8000/api/v1/orders
```

### D. Crear una Orden (Resiliencia y Consistencia)

Este endpoint pone a prueba el **Circuit Breaker** y el **Transactional Outbox**:

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: Bearer <TU_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productId": "id-producto-real", "quantity": 2}
    ]
  }'
```

---

## ✅ Checklist de Verificación

- [ ] ¿Authentik emite tokens JWT RS256?
- [ ] ¿Kong tiene la clave pública correcta de Authentik?
- [ ] ¿Ves los logs en Loki al hacer una petición?
- [ ] ¿Ves los perfiles en Pyroscope?
- [ ] ¿La tabla `outbox` en la DB de Orders se vacía correctamente (Worker funcionando)?

---

_Generado por la IA de desarrollo experto - 2026_
