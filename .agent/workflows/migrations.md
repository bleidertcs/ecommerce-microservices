---
description: Gestión de migraciones y seeding de bases de datos con Prisma
---

# Workflow: Migraciones de Base de Datos

Este workflow gestiona las migraciones y seeding de las bases de datos de todos los microservicios.

## Pasos:

1. **Verificar estado actual de las bases de datos**
   ```bash
   # Verificar que los contenedores de DB estén corriendo
   docker-compose ps | grep -E "(users-db|products-db|orders-db)"
   ```

2. **Ejecutar migraciones para Users Service**
   ```bash
   docker-compose exec users-service npx prisma migrate dev --name init
   ```

3. **Ejecutar seeding para Users Service**
   ```bash
   docker-compose exec users-service npx prisma db seed
   ```

4. **Ejecutar migraciones para Products Service**
   ```bash
   docker-compose exec products-service npx prisma migrate dev --name init
   ```

5. **Ejecutar seeding para Products Service**
   ```bash
   docker-compose exec products-service npx prisma db seed
   ```

6. **Ejecutar migraciones para Orders Service**
   ```bash
   docker-compose exec orders-service npx prisma migrate dev --name init
   ```

7. **Ejecutar seeding para Orders Service**
   ```bash
   docker-compose exec orders-service npx prisma db seed
   ```

8. **Verificar estado de las tablas**
   ```bash
   # Users DB
   docker-compose exec users-service npx prisma db pull --print
   
   # Products DB  
   docker-compose exec products-service npx prisma db pull --print
   
   # Orders DB
   docker-compose exec orders-service npx prisma db pull --print
   ```

## Operaciones Adicionales:

**Resetear bases de datos (completo):**
```bash
# Detener servicios
docker-compose stop users-service products-service orders-service

# Eliminar y recrear volúmenes
docker-compose down -v
docker-compose up -d users-db products-db orders-db

# Esperar a que las DB estén listas
sleep 30

# Ejecutar migraciones y seeding
./setup-ecommerce.sh
```

**Crear nueva migración:**
```bash
# Para un servicio específico
docker-compose exec users-service npx prisma migrate dev --name add_new_field
```

**Generar cliente Prisma:**
```bash
docker-compose exec users-service npx prisma generate
docker-compose exec products-service npx prisma generate  
docker-compose exec orders-service npx prisma generate
```

## Ejecución Local (Alternativa):

Si tienes pnpm instalado localmente:

```bash
# Configurar .env files para localhost
echo "DATABASE_URL=\"postgresql://admin:master123@localhost:15431/users?schema=public\"" > users/.env
echo "DATABASE_URL=\"postgresql://admin:master123@localhost:15432/products?schema=public\"" > products/.env
echo "DATABASE_URL=\"postgresql://admin:master123@localhost:15433/orders?schema=public\"" > orders/.env

# Ejecutar migraciones localmente
cd users && pnpm run prisma:migrate && pnpm run prisma:seed && cd ..
cd products && pnpm run prisma:migrate && pnpm run prisma:seed && cd ..
cd orders && pnpm run prisma:migrate && pnpm run prisma:seed && cd ..
```

## Notas:
- Las migraciones en contenedores son más fiables
- Los datos de seeding incluyen usuarios de prueba, productos y órdenes ejemplo
- La tabla `outbox` en Orders DB se gestiona automáticamente por el patrón Transactional Outbox
