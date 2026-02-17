---
description: Configuración dinámica de transportes de comunicación entre microservicios
---

# Workflow: Configuración de Transportes

Este workflow permite cambiar dinámicamente los protocolos de comunicación entre el Orders Service y los demás servicios.

## Transportes Disponibles:
- **gRPC**: Comunicación asíncrona con streaming (default)
- **TCP**: Comunicación síncrona directa
- **NATS**: Messaging ligero para comunicación síncrona/Asíncrona

## Pasos:

1. **Ver configuración actual de transportes**
   ```bash
   docker-compose exec orders-service cat .env | grep TRANSPORT
   ```

2. **Configurar transporte para Users Service**
   ```bash
   # Editar el archivo .env del servicio de órdenes
   # Opciones: grpc, tcp, nats
   sed -i 's/USERS_TRANSPORT=.*/USERS_TRANSPORT=grpc/' orders/.env
   ```

3. **Configurar transporte para Products Service**
   ```bash
   # Editar el archivo .env del servicio de órdenes  
   # Opciones: grpc, tcp, nats
   sed -i 's/PRODUCTS_TRANSPORT=.*/PRODUCTS_TRANSPORT=grpc/' orders/.env
   ```

4. **Reconstruir y reiniciar Orders Service**
   ```bash
   docker-compose up -d --build orders-service
   ```

5. **Verificar que la comunicación funciona**
   ```bash
   # Probar creación de orden para validar comunicación
   curl -X POST http://localhost:8000/api/v1/orders \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"items": [{"productId": "test-product", "quantity": 1}]}'
   ```

## Configuraciones Predefinidas:

**Configuración gRPC (Recomendada para producción):**
```bash
echo "USERS_TRANSPORT=grpc" > orders/.env
echo "PRODUCTS_TRANSPORT=grpc" >> orders/.env
```

**Configuración TCP (Para debugging):**
```bash
echo "USERS_TRANSPORT=tcp" > orders/.env  
echo "PRODUCTS_TRANSPORT=tcp" >> orders/.env
```

**Configuración NATS (Para messaging asíncrono):**
```bash
echo "USERS_TRANSPORT=nats" > orders/.env
echo "PRODUCTS_TRANSPORT=nats" >> orders/.env
```

## Verificación:

**Ver logs de comunicación:**
```bash
docker-compose logs -f orders-service | grep -E "(grpc|tcp|nats)"
```

**Probar Circuit Breaker:**
```bash
# Detener Users Service para probar resiliencia
docker-compose stop users-service
# Intentar crear orden y observar fallback
docker-compose start users-service
```

## Notas:
- gRPC ofrece mejor rendimiento y streaming bidireccional
- TCP es útil para debugging simple
- NATS permite patrones pub/sub y request-reply
- Los cambios requieren reconstrucción del contenedor
