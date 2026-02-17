---
description: Monitoreo y análisis de logs, trazas y métricas con SigNoz y OpenTelemetry
---

# Workflow: Observabilidad y Monitoreo

Este workflow facilita el acceso y análisis de datos de observabilidad del sistema.

## Pasos:

1. **Acceder a la interfaz de SigNoz**
   ```bash
   # Abrir navegador en la UI de SigNoz
   start http://localhost:8080
   ```

2. **Verificar que los servicios estén enviando telemetría**
   ```bash
   # Revisar logs del collector
   docker-compose logs -f signoz-otel-collector
   ```

3. **Analizar Logs estructurados**
   - Navegar a **Logs** en el menú lateral de SigNoz
   - Filtrar por `service.name: users-service`, `products-service`, `orders-service`
   - Buscar por texto libre o atributos específicos

4. **Inspeccionar Trazas Distribuidas**
   - Navegar a **Traces** en SigNoz
   - Buscar trazas por `service.name` o tiempo
   - Analizar el flujo completo entre microservicios

5. **Monitorizar Métricas RED**
   - Navegar a **Dashboards** en SigNoz
   - Revisar dashboards de servicios individuales
   - Monitorear Rate, Errors, Duration

6. **Verificar estado del stack de observabilidad**
   ```bash
   # Estado de todos los componentes
   docker-compose ps | grep -E "(signoz|clickhouse|zookeeper)"
   ```

7. **Reiniciar stack de observabilidad si es necesario**
   ```bash
   docker-compose restart signoz signoz-otel-collector clickhouse
   ```

## Comandos Útiles:

**Ver logs específicos de un servicio:**
```bash
docker-compose logs -f users-service | grep -E "(ERROR|WARN)"
```

**Ver métricas en tiempo real:**
```bash
# Acceder a dashboards preconfigurados
start http://localhost:8080/dashboards
```

**Verificar conexión OTLP:**
```bash
docker-compose exec signoz-otel-collector curl -s http://localhost:4317/status
```

## Notas:
- Los datos se almacenan en ClickHouse para análisis de alto rendimiento
- OpenTelemetry captura automáticamente trazas HTTP, gRPC y de base de datos
- Los logs están correlacionados con trazas para facilitar debugging
