---
description: Pruebas de API endpoints con diferentes escenarios y autenticación
---

# Workflow: Testing de APIs

Este workflow facilita las pruebas de los endpoints de la API a través del Gateway.

## Prerrequisitos:

1. **Obtener token de acceso desde Authentik**
   ```bash
   # Reemplaza con tus credenciales de Authentik
   curl -X POST http://localhost:9000/application/o/token/ \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=password" \
     -d "username=tu_usuario" \
     -d "password=tu_password" \
     -d "client_id=TU_CLIENT_ID" \
     -d "client_secret=TU_CLIENT_SECRET" \
     -d "scope=openid profile email"
   ```

2. **Exportar token para uso posterior**
   ```bash
   export TOKEN="tu_token_obtenido"
   ```

## Tests de API:

1. **Productos (Público - Rate Limited por IP)**
   ```bash
   # Listar todos los productos
   curl -i http://localhost:8000/api/v1/products

   # Obtener producto específico
   curl -i http://localhost:8000/api/v1/products/1

   # Buscar productos
   curl -i "http://localhost:8000/api/v1/products?search=laptop"
   ```

2. **Usuarios (Protegido - Rate Limited por usuario)**
   ```bash
   # Obtener perfil de usuario actual
   curl -i -H "Authorization: Bearer $TOKEN" \
     http://localhost:8000/api/v1/users/profile

   # Actualizar perfil
   curl -X PUT -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"firstName": "John", "lastName": "Doe"}' \
     http://localhost:8000/api/v1/users/profile

   # Obtener direcciones
   curl -i -H "Authorization: Bearer $TOKEN" \
     http://localhost:8000/api/v1/users/addresses

   # Agregar dirección
   curl -X POST -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"street": "123 Main St", "city": "New York", "zipCode": "10001"}' \
     http://localhost:8000/api/v1/users/addresses
   ```

3. **Órdenes (Protegido - Circuit Breaker + Outbox)**
   ```bash
   # Listar órdenes del usuario
   curl -i -H "Authorization: Bearer $TOKEN" \
     http://localhost:8000/api/v1/orders

   # Crear nueva orden (prueba de resiliencia)
   curl -X POST -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "items": [
         {"productId": "1", "quantity": 2},
         {"productId": "2", "quantity": 1}
       ]
     }' \
     http://localhost:8000/api/v1/orders

   # Obtener detalles de orden específica
   curl -i -H "Authorization: Bearer $TOKEN" \
     http://localhost:8000/api/v1/orders/1
   ```

## Tests de Estrés:

1. **Test de Rate Limiting (Público)**
   ```bash
   # 100 requests rápidas para probar límite por IP
   for i in {1..100}; do
     curl -s http://localhost:8000/api/v1/products > /dev/null
     echo "Request $i"
   done
   ```

2. **Test de Rate Limiting (Autenticado)**
   ```bash
   # 50 requests rápidas para probar límite por usuario
   for i in {1..50}; do
     curl -s -H "Authorization: Bearer $TOKEN" \
       http://localhost:8000/api/v1/users/profile > /dev/null
     echo "Request $i"
   done
   ```

3. **Test de Circuit Breaker**
   ```bash
   # Detener Users Service
   docker-compose stop users-service

   # Intentar crear orden (debería activar fallback)
   curl -X POST -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"items": [{"productId": "1", "quantity": 1}]}' \
     http://localhost:8000/api/v1/orders

   # Reiniciar Users Service
   docker-compose start users-service
   ```

## Verificación de Respuestas:

1. **Verificar headers de Kong**
   ```bash
   # Ver headers de rate limiting
   curl -I -H "Authorization: Bearer $TOKEN" \
     http://localhost:8000/api/v1/users/profile
   ```

2. **Verificar transformación de JWT**
   ```bash
   # El token debería transformarse en header x-user-id
   curl -v -H "Authorization: Bearer $TOKEN" \
     http://localhost:8000/api/v1/orders
   ```

## Scripts Automatizados:

**Test completo del sistema:**
```bash
# Usar script de estrés existente
./stress-test.sh

# O en Windows
./stress-test.ps1
```

## Notas:
- Los endpoints públicos tienen límite de 100 req/min por IP
- Los endpoints protegidos tienen límite de 30 req/min por usuario
- El Circuit Breaker se activa ante fallos en servicios dependientes
- El Transactional Outbox garantiza consistencia eventual en órdenes
