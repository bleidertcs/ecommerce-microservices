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
   # Eliminar todos los contenedores
   docker rm -f $(docker ps -aq)

   # Eliminar todas las imágenes del proyecto
   docker rmi -f $(docker images | grep ecommerce | awk '{print $3}')

   # Eliminar todos los volúmenes
   docker volume rm $(docker volume ls -q | grep ecommerce)
   ```

2. **Limpiar archivos temporales locales**
   ```bash
   # Eliminar node_modules
   rm -rf users/node_modules
   rm -rf products/node_modules  
   rm -rf orders/node_modules
   rm -rf web-app/node_modules

   # Eliminar archivos de compilación
   rm -rf users/dist
   rm -rf products/dist
   rm -rf orders/dist
   rm -rf web-app/dist

   # Eliminar archivos de cobertura
   rm -rf users/coverage
   rm -rf products/coverage
   rm -rf orders/coverage
   ```

3. **Resetear configuración**
   ```bash
   # Restaurar archivos .env desde .env.example
   cp users/.env.example users/.env
   cp products/.env.example products/.env
   cp orders/.env.example orders/.env
   ```

## Verificación Post-Limpieza:

1. **Verificar que no queden contenedores corriendo**
   ```bash
   docker ps -a | grep ecommerce
   ```

2. **Verificar espacio liberado**
   ```bash
   docker system df
   ```

3. **Verificar que Docker esté limpio**
   ```bash
   docker system prune -a --volumes -f
   ```

## Reconstrucción Completa:

Después de la limpieza, puedes reconstruir todo desde cero:

```bash
# Ejecutar script de setup completo
./setup-ecommerce.sh

# O usar el workflow /setup
```

## Notas:
- Este workflow elimina TODOS los datos de bases de datos
- Úsalo solo cuando necesites un reset completo del entorno
- Para reinicios rápidos, usa `docker-compose restart` en lugar de limpieza completa
