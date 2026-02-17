---
description: Tareas comunes de desarrollo local y debugging
---

# Workflow: Desarrollo Local

Este workflow facilita las tareas comunes durante el desarrollo de los microservicios.

## Pasos:

1. **Levantar solo infraestructura básica**

   ```bash
   docker-compose up -d redis rabbitmq users-db products-db orders-db nats
   ```

2. **Configurar variables de entorno local**

   ```bash
   # Copiar archivos .env.example a .env
   cp users/.env.example users/.env
   cp products/.env.example products/.env
   cp orders/.env.example orders/.env
   ```

3. **Instalar dependencias localmente**

   ```bash
   cd users && pnpm install && cd ..
   cd products && pnpm install && cd ..
   cd orders && pnpm install && cd ..
   ```

4. **Ejecutar servicios en modo desarrollo**

   ```bash
   # Terminal 1 - Users Service
   cd users && pnpm run start:dev

   # Terminal 2 - Products Service
   cd products && pnpm run start:dev

   # Terminal 3 - Orders Service
   cd orders && pnpm run start:dev
   ```

5. **Levantar Gateway y servicios de soporte**
   ```bash
   docker-compose up -d kong casdoor
   ```

## Herramientas de Desarrollo:

**Ver logs en tiempo real:**

```bash
# Logs de todos los servicios
docker-compose logs -f

# Logs de servicio específico
docker-compose logs -f users-service
```

**Acceder a bases de datos localmente:**

```bash
# Users DB
docker-compose exec users-db psql -U admin -d users

# Products DB
docker-compose exec products-db psql -U admin -d products

# Orders DB
docker-compose exec orders-db psql -U admin -d orders
```

**Generar código gRPC:**

```bash
# Desde la raíz del proyecto
npx grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./src/generated --grpc_out=grpc_js:./src/generated --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin -I proto proto/*.proto
```

**Formatear código:**

```bash
# En cada servicio
cd users && pnpm run format && cd ..
cd products && pnpm run format && cd ..
cd orders && pnpm run format && cd ..
```

## Debugging:

**Verificar conectividad entre servicios:**

```bash
# Desde el contenedor de orders
docker-compose exec orders-service curl -s http://users-service:9001/health
docker-compose exec orders-service curl -s http://products-service:9002/health
```

**Probar endpoints localmente:**

```bash
# Health checks
curl http://localhost:9001/health  # Users
curl http://localhost:9002/health  # Products
curl http://localhost:9003/health  # Orders
```

**Verificar configuración:**

```bash
# Variables de entorno de un servicio
docker-compose exec users-service env | grep -E "(DATABASE|REDIS|RABBITMQ|NATS)"
```

## Recarga Automática:

Los servicios en modo `start:dev` tienen recarga automática con:

- Cambios en archivos TypeScript
- Cambios en archivos de configuración
- Cambios en schemas de Prisma

## Notas:

- Los servicios locales se conectan a bases de datos en contenedores
- Kong y Casdoor corren en Docker para facilitar configuración
- Usa `pnpm` para mejor rendimiento y consistencia
