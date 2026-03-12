# 🛠️ Guía de Scripts de Utilidad

Esta guía detalla los scripts disponibles en la raíz del proyecto para automatizar tareas de configuración, prueba y mantenimiento.

---

## 🚀 1. Setup Ecommerce (`setup-ecommerce.sh/ps1`)

Este script es fundamental para el primer despliegue o cuando se desea resetear las bases de datos a un estado conocido con datos de prueba realistas. **Para el flujo completo de levantamiento en máquina nueva** (limpieza, variables de entorno, Casdoor, Kong, etc.), sigue la sección **1. Setup en máquina nueva** de [MASTER_GUIDE.md](../MASTER_GUIDE.md).

### Qué hace:

1.  **Genera Clientes Prisma**: Ejecuta `prisma generate` en cada microservicio (`users`, `products`, `orders`, `payments`).
2.  **Aplica Migraciones**: Sincroniza el esquema de la base de datos local con los archivos `schema.prisma` en users, products, orders y payments.
3.  **Seed de Datos** (donde exista): Pobla las bases de datos con:
    - 50 Usuarios (vía Faker).
    - 100 Productos con categorías.
    - 200 Órdenes de prueba.
    - Payments: solo migraciones (sin seed).

### Cómo usar:

Ejecuta desde la **raíz del proyecto**:

```bash
# Windows (PowerShell)
./scripts/setup-ecommerce.ps1

# Linux / MacOS / Git Bash
./scripts/setup-ecommerce.sh
```

Requisitos: las bases de datos deben estar levantadas (p. ej. `docker-compose up -d users-db products-db orders-db payments-db`) y los archivos `.env` en cada servicio con `DATABASE_URL` apuntando a localhost (puertos 15431, 15432, 15433, 15436) si corres el script en local.

---

## 🧪 2. Stress Test (`stress-test.sh/ps1`)

Simula una carga de tráfico realista para poner a prueba la resiliencia del sistema (Circuit Breaker) y los límites de tráfico (Rate Limiting).

### Qué hace:

1.  **Obtención de Token**: Se autentica contra **Casdoor** para obtener un JWT válido.
2.  **Peticiones Concurrentes**: Lanza N peticiones simultáneas al endpoint de creación de órdenes (`POST /api/v1/orders`).

### Cómo usar:

1.  Edita el script para configurar tu `CLIENT_ID` y `CLIENT_SECRET` de Casdoor.
2.  Ejecuta el script:

```bash
# Windows (PowerShell)
./stress-test.ps1

# Bash
./stress-test.sh
```

> [!NOTE]
> Úsalo para observar cómo aparecen las trazas en **SigNoz** y cómo el Circuit Breaker se activa si detienes un servicio dependiente (ej. `users-service`).

---

## 🔐 3. Fetch Casdoor Certs (`fetch-casdoor-certs.sh/ps1`)

Extrae la clave pública de Casdoor desde su endpoint JWKS y, opcionalmente, actualiza la configuración de Kong.

### Qué hace:

Conecta con `http://localhost:8000/.well-known/jwks`, extrae el certificado **RS256** activo y lo formatea como una clave pública PEM. Si se usa el flag `-UpdateConfig`, actualiza automáticamente el archivo `kong/config.yml` con la indentación correcta.

### Cómo usar:

```bash
# Windows (PowerShell)
./scripts/fetch-casdoor-certs.ps1 -UpdateConfig

# Bash / Linux
./scripts/fetch-casdoor-certs.sh --update-config
```

---

## 🏁 Resumen de Puertos y Herramientas

| Script / Herramienta     | URL / Puerto                     |
| :----------------------- | :------------------------------- |
| **Kong Gateway (Proxy)** | `http://localhost:8010`          |
| **Casdoor (Auth UI)**    | `http://localhost:8000`          |
| **Swagger UI (Users)**   | `http://localhost:9001/api/docs` |
| **SigNoz UI**            | `http://localhost:8080`          |
| **RabbitMQ UI**          | `http://localhost:15672`         |
