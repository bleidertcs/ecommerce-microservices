# Arquitectura de Microservicios E-commerce (NestJS)

[![NestJS](https://img.shields.io/badge/NestJS-10.4.6-red.svg)](https://nestjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-20.0.0-blue.svg)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/bleidertcs/ecommerce-microservices)

Una arquitectura de microservicios e-commerce avanzada construida con **NestJS**, **gRPC**, **TCP**, **NATS**, **RabbitMQ**, **Casdoor** (Identity Provider) y **Kong API Gateway**. El sistema cuenta con un stack de observabilidad moderno basado en **SigNoz** y **OpenTelemetry**.

---

## 📚 Documentación Maestra

Para una guía detallada paso a paso sobre cómo configurar y usar todo el ecosistema, consulta:

👉 **[MASTER_GUIDE.md](./MASTER_GUIDE.md)**

Esta guía incluye configuración de **Casdoor**, **Kong**, **SigNoz** y ejemplos de **cURL** para todos los servicios.

---

## 🏗️ Descripción General de la Arquitectura

### Diagrama de Infraestructura

```mermaid
graph TB
    Client[Aplicaciones Cliente] --> Kong[Kong API Gateway<br/>Puerto: 8000]
    Kong --> Users[Users Service<br/>Puerto: 9001]
    Kong --> Products[Products Service<br/>Puerto: 9002]
    Kong --> Orders[Orders Service<br/>Puerto: 9003]

    subgraph "Messaging & Auth"
        RMQ[RabbitMQ - Asíncrono]
        NATS[NATS - Síncrono/Alternativo]
        CD[Casdoor IDP]
    end

    subgraph "Observability (SigNoz)"
        SN[SigNoz UI / Query]
        OT[OTel Collector]
        CH[(ClickHouse DB)]
    end

    Users-.-RMQ
    Orders-.-RMQ
    Orders-.- |gRPC/TCP/NATS| Users
    Orders-.- |gRPC/TCP/NATS| Products
    Users-.-NATS
    Products-.-NATS
    Orders-.-NATS
    Users & Products & Orders --- |OTLP| OT
    OT --- SN
    SN --- CH
```

## 🚀 Características Principales

### 📦 Microservicios

- **👤 Users Service**: Gestión de perfiles, direcciones y métodos de pago.
- **🏷️ Products Service**: Catálogo de productos, inventario y gestión de reviews.
- **🛒 Orders Service**: Orquestación de pedidos con validación síncrona flexible vía **gRPC**, **TCP** o **NATS**.

### 🛡️ Seguridad y Tráfico

- **🔐 Casdoor IDP**: Gestión centralizada de identidades y autenticación OIDC.
- **🌐 Kong Gateway**: Enrutamiento, validación de JWT y Rate Limiting.
- **🔑 JWT Validation**: Validación en el Gateway mediante claves públicas RSA-256 de Casdoor.

### 📊 Observabilidad (SigNoz Native)

- **📝 Unified Logs**: Logs estructurados correlacionados automáticamente con trazas.
- **🕵️ Distributed Tracing**: Rastreo completo de peticiones entre microservicios mediante OpenTelemetry.
- **📈 Metrics**: Monitorización de rendimiento (RED metrics) y consumo de recursos.
- **⚡ Real-time Analysis**: Análisis de latencia y detección de anomalías basado en ClickHouse.

---

## ⚡ Inicio Rápido

### 1. Requisitos

- Docker & Docker Compose
- Node.js >= 18 (para desarrollo local)
- PowerShell o Bash para scripts de setup

### 2. Configuración y Despliegue Automático

El proyecto incluye scripts que automatizan la generación de protos, clientes prisma y el despliegue:

```bash
# En Windows (PowerShell)
./setup-ecommerce.ps1

# En Linux/macOS
chmod +x setup-ecommerce.sh
./setup-ecommerce.sh
```

### 3. Acceso a Herramientas

- **API Gateway**: `http://localhost:8000`
- **Casdoor**: `http://localhost:8000` (también usado como IDP)
- **SigNoz UI**: `http://localhost:8080`
- **RabbitMQ**: `http://localhost:15672` (admin/admin)

---

## 📚 Documentación Detallada

Para información técnica específica, consulta los siguientes documentos:

- 📑 **[Servicios E-commerce](./ECOMMERCE_SERVICES.md)**: Modelos de datos, API endpoints y flujos de comunicación.
- ⚙️ **[Recomendaciones Arquitecturales](./RECOMENDACIONES_ARQUITECTURA.md)**: Mejores prácticas y decisiones de diseño aplicadas.
- 🔐 **[Guía Maestra](./MASTER_GUIDE.md)**: Configuración del proveedor de identidad (Casdoor), Kong y Observabilidad.
- 📉 **[Guía de Observabilidad](./monitoring/GUIA_OBSERVABILIDAD.md)**: Detalles sobre el stack de SigNoz y OTel.

---

## 🛠️ Desarrollo Local

```bash
# Ver logs de un servicio específico
docker-compose logs -f users-service

# Reiniciar stack de observabilidad
docker-compose restart signoz signoz-otel-collector clickhouse
```

## 🤝 Contribuciones

Este proyecto utiliza un patrón de arquitectura hexagonal y Clean Architecture. Por favor, asegúrate de mantener la separación de capas al añadir nuevas funcionalidades.

---

© 2026 Backend Works. Licencia MIT.
