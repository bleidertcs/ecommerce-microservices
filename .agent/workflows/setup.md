---
description: Configuración inicial y despliegue completo del ecosistema de microservicios
---

# Workflow: Setup Completo del Ecosistema

Este workflow configura y despliega todo el stack de microservicios e-commerce desde cero.

## Pasos:

1. **Levantar infraestructura básica (bases de datos y messaging)**

   ```bash
   docker-compose up -d redis rabbitmq users-db products-db orders-db nats
   ```

2. **Configurar variables de entorno para migraciones locales**
   // turbo

   ```bash
   # Verificar que los .env files apunten a localhost para migraciones
   echo "DATABASE_URL=\"postgresql://admin:master123@localhost:15431/users?schema=public\"" > users/.env
   echo "DATABASE_URL=\"postgresql://admin:master123@localhost:15432/products?schema=public\"" > products/.env
   echo "DATABASE_URL=\"postgresql://admin:master123@localhost:15433/orders?schema=public\"" > orders/.env
   ```

3. **Ejecutar migraciones y seeding de bases de datos**

   ```bash
   # Users service
   docker-compose exec users-service npx prisma migrate dev --name init
   docker-compose exec users-service npx prisma db seed

   # Products service
   docker-compose exec products-service npx prisma migrate dev --name init
   docker-compose exec products-service npx prisma db seed

   # Orders service
   docker-compose exec orders-service npx prisma migrate dev --name init
   docker-compose exec orders-service npx prisma db seed
   ```

4. **Levantar servicios de identidad y gateway**

   ```bash
   docker-compose up -d casdoor kong
   ```

5. **Levantar stack de observabilidad**

   ```bash
   docker-compose up -d zookeeper clickhouse schema-migrator-sync schema-migrator-async signoz signoz-otel-collector
   ```

6. **Levantar microservicios**

   ```bash
   docker-compose up -d --build users-service products-service orders-service
   ```

7. **Verificar estado del sistema**
   ```bash
   docker-compose ps
   ```

## Acceso a herramientas:

- **API Gateway**: http://localhost:8000
- **Casdoor**: http://localhost:8000
- **SigNoz**: http://localhost:8080
- **RabbitMQ**: http://localhost:15672 (admin/admin)

## Notas:

- Los servicios de Casdoor corren como root para evitar problemas de permisos en Windows/WSL
- Las migraciones pueden ejecutarse localmente si tienes pnpm instalado
- El sistema usa transporte híbrido (gRPC/TCP/NATS) configurable por entorno
