# Kong API Gateway

Este componente actúa como la puerta de enlace (Gateway) centralizada para todos los microservicios, gestionando el tráfico externo, el balanceo de carga y los límites de peticiones.

## 🚀 Funcionalidades en el Proyecto

- **Proxy Inverso**: Enrutamiento de peticiones HTTP a los microservicios internos (`auth`, `post`).
- **Rate Limiting**: Control de frecuencia de peticiones para prevenir abusos.
- **Terminación de Rutas**: Normalización de URLs externas hacia puertos internos.

---

## 🏗️ Configuración

Kong se ejecuta en modo **DB-less** (sin base de datos) utilizando el archivo declarativo `kong/config.yml`.

### Puertos Expuestos

- `8000`: Puerto proxy para peticiones de clientes.
- `8001`: Interfaz de administración (usada para inspeccionar rutas y servicios).

---

## 🛠️ Rutas Configuradas

| Prefijo Externo | Servicio Interno    | Descripción                        |
| :-------------- | :------------------ | :--------------------------------- |
| `/auth`         | `auth-service:9001` | Rutas de autenticación y usuarios. |
| `/post`         | `post-service:9002` | Rutas de publicaciones y blogs.    |

---

## 🛡️ Plugins Activos

### Rate Limiting

Configurado individualmente por ruta:

- **Auth**: 100 peticiones por minuto.
- **Post**: 200 peticiones por minuto.

Para verificar los límites, inspecciona las cabeceras de respuesta:

- `X-RateLimit-Limit-Minute`
- `X-RateLimit-Remaining-Minute`

---

## 📊 Verificación de Estado

Puedes consultar el estado de Kong y sus servicios registrados mediante la Admin API:

```bash
# Listar servicios
curl http://localhost:8001/services

# Listar rutas
curl http://localhost:8001/routes

# Estado del sistema
curl http://localhost:8001/status
```
