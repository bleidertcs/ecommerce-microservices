---
description: Ejecución de pruebas unitarias y de integración para todos los microservicios
---

# Workflow: Testing de Microservicios

Este workflow ejecuta las pruebas de todos los microservicios del ecosistema.

## Pasos:

1. **Ejecutar pruebas del Users Service**
   ```bash
   docker-compose exec users-service pnpm run test
   ```

2. **Ejecutar pruebas del Products Service**
   ```bash
   docker-compose exec products-service pnpm run test
   ```

3. **Ejecutar pruebas del Orders Service (incluye Circuit Breaker y Outbox)**
   ```bash
   docker-compose exec orders-service pnpm run test
   ```

4. **Generar reporte de cobertura completo**
   ```bash
   # Coverage para Orders Service (el más completo)
   docker-compose exec orders-service pnpm run test --coverage
   ```

5. **Ejecutar prueba específica (opcional)**
   ```bash
   # Ejemplo: Prueba específica del servicio de órdenes
   docker-compose exec orders-service pnpm jest test/unit/orders.service.spec.ts
   ```

## Ejecución Local (Alternativa)

Si prefieres ejecutar las pruebas sin Docker:

1. **Instalar dependencias locales**
   ```bash
   cd users && pnpm install && cd ..
   cd products && pnpm install && cd ..  
   cd orders && pnpm install && cd ..
   ```

2. **Ejecutar pruebas localmente**
   ```bash
   cd users && pnpm run test && cd ..
   cd products && pnpm run test && cd ..
   cd orders && pnpm run test && cd ..
   ```

## Notas:
- Las pruebas en contenedores son más fiables (misma versión de Node y dependencias)
- El Orders Service incluye pruebas de resiliencia (Circuit Breaker) y consistencia (Transactional Outbox)
- Los reports de cobertura se generan en la carpeta `coverage/` de cada servicio
