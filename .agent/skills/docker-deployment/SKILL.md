---
name: docker-deployment
description: Managing the local development environment using Docker Compose and environment variables.
---

# Docker and Deployment Skill

This skill covers managing the local infrastructure and service environment.

## Infrastructure

The project uses `docker-compose.yml` in the root directory to orchestrate:

- Databases (Postgres)
- Message Brokers (RabbitMQ)
- API Gateways (Kong / Traefik / Tyk)
- Microservices (`auth`, `post`)
- Monitoring (Grafana, Prometheus, Pyroscope)

## Commands

- `docker-compose up -d`: Start all services in detached mode.
- `docker-compose build`: Rebuild images when dependencies change.
- `docker-compose logs -f <service-name>`: View logs for a specific service.

## Environment Variables

- Core configuration is stored in `.env` in the root.
- Each service may have its own `.env` or use the root one (mapped via Docker).
- Always use `ConfigService` to access variables in code.

## Port Assignments (Typical)

- 3000: Auth Service (HTTP/gRPC)
- 3001: Post Service (HTTP/gRPC)
- 8000: Gateway
- 15672: RabbitMQ Management UI
- 5432: Postgres
