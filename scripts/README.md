# 🛠️ Guía de Scripts de Utilidad

Esta guía detalla los scripts disponibles en la raíz del proyecto para automatizar tareas de configuración, prueba y mantenimiento.

---

## 🚀 1. Setup Ecommerce (`setup-ecommerce.sh/ps1`)

Este script es fundamental para el primer despliegue o cuando se desea resetear la base de datos a un estado conocido con datos de prueba realistas.

### Qué hace:

1.  **Genera Clientes Prisma**: Ejecuta `prisma generate` en cada microservicio (`users`, `products`, `orders`).
2.  **Aplica Migraciones**: Sincroniza el esquema de la base de datos local con los archivos `schema.prisma`.
3.  **Seed de Datos**: Pobla la base de datos con:
    - 50 Usuarios (vía Faker).
    - 100 Productos con categorías.
    - 200 Órdenes de prueba.

### Cómo usar:

```bash
# Windows (PowerShell)
./setup-ecommerce.ps1

# Linux / MacOS / Git Bash
./setup-ecommerce.sh
```

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

Extrae la clave pública de Casdoor necesaria para configurar el plugin de JWT en Kong.

### Qué hace:

Conecta con la API de Casdoor, busca el certificado **RS256** y extrae la clave pública en formato PEM, lista para copiar y pegar en la configuración de Kong (`kong/config.yml`).

### Cómo usar:

```bash
# Windows (PowerShell)
./fetch-casdoor-certs.ps1

# Bash / Linux
./fetch-casdoor-certs.sh
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
