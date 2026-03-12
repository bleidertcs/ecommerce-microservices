---
description: Limpieza y reseteo completo del entorno de desarrollo
---

# Workflow: Limpieza del Entorno

Este workflow limpia y resetea completamente el entorno de microservicios.

## Pasos:

1. **Detener todos los servicios**
   ```bash
   docker-compose down
   ```

2. **Eliminar volúmenes de bases de datos**
   ```bash
   docker-compose down -v
   ```

3. **Limpiar imágenes Docker no utilizadas**
   ```bash
   docker image prune -f
   ```

4. **Eliminar contenedores huérfanos**
   ```bash
   docker container prune -f
   ```

5. **Limpiar redes Docker no utilizadas**
   ```bash
   docker network prune -f
   ```

6. **Limpiar caché de Docker Build**
   ```bash
   docker builder prune -f
   ```

7. **Reiniciar Docker (opcional, si hay problemas)**
   ```bash
   # En Windows
   Restart-Service docker

   # En Linux/macOS  
   sudo systemctl restart docker
   ```

## Limpieza Profunda (si hay problemas persistentes):

1. **Eliminar todo relacionado con el proyecto**
   ```bash
   # Detener y eliminar contenedores del proyecto (prefijo bw-)
   docker-compose down -v
   docker rm -f $(docker ps -aq --filter "name=bw-") 2>/dev/null || true

   # Eliminar imágenes del proyecto (construidas por docker-compose)
   docker-compose down --rmi local

   # Los volúmenes del stack se eliminan con docker-compose down -v.
   # Para listar volúmenes: docker volume ls
   ```

2. **Limpiar archivos temporales locales**
   ```bash
   # Eliminar node_modules
   rm -rf users/node_modules products/node_modules orders/node_modules
   rm -rf payments/node_modules notifications/node_modules web-app/node_modules

   # Eliminar archivos de compilación
   rm -rf users/dist products/dist orders/dist payments/dist notifications/dist web-app/dist

   # Eliminar archivos de cobertura
   rm -rf users/coverage products/coverage orders/coverage
   ```

3. **Resetear configuración**
   ```bash
   # Restaurar archivos .env desde .env.example (raíz y cada servicio)
   cp .env.example .env
   cp users/.env.example users/.env
   cp products/.env.example products/.env
   cp orders/.env.example orders/.env
   cp payments/.env.example payments/.env
   cp notifications/.env.example notifications/.env
   cp cart/.env.example cart/.env
   cp web-app/.env.example web-app/.env
   ```

## Verificación Post-Limpieza:

1. **Verificar que no queden contenedores del proyecto**
   ```bash
   docker ps -a --filter "name=bw-"
   ```

2. **Verificar espacio liberado**
   ```bash
   docker system df
   ```

3. **Verificar que Docker esté limpio**
   ```bash
   docker system prune -a --volumes -f
   ```

## Reconstrucción completa

Después de la limpieza, sigue la guía **Setup en máquina nueva** en [MASTER_GUIDE.md](../../MASTER_GUIDE.md) (sección 1), o ejecuta el script de setup desde la carpeta `scripts/`:

```bash
# Desde la raíz del proyecto
./scripts/setup-ecommerce.sh   # Linux/macOS
./scripts/setup-ecommerce.ps1   # Windows PowerShell
```

## Notas:
- Este workflow elimina TODOS los datos de bases de datos
- Úsalo solo cuando necesites un reset completo del entorno
- Para reinicios rápidos, usa `docker-compose restart` en lugar de limpieza completa
