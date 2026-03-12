---
name: infrastructure-management
description: Guidelines for managing Docker, Kong, Casdoor, and other infrastructure components.
---

# Infrastructure Management

This skill provides instructions on how to manage the system's infrastructure from an agent's perspective. The infrastructure revolves around Docker Compose, Kong Gateway, Casdoor for Auth, and SigNoz for observability.

## 1. Docker Compose Management

The `docker-compose.yml` situated in the root directory is the only source of truth for local infrastructure setup.

- Start all infrastructure: `docker-compose up -d postgres rabbitmq redis casdoor signoz-clickhouse` (refer to `MASTER_GUIDE.md` for exactly which services).
- Never modify existing port mappings without verifying that no other hardcoded environments (like inside `.env.docker`) rely on it.
- Ensure that the `.env` provided locally matches `.env.example` in variable names.

## 2. Kong Gateway Configuration

- Kong sits at port `8010` (HTTP) and `8443` (HTTPS).
- It handles JWT validation via the OIDC plugin connected to Casdoor.
- Services do NOT validate the JWT signatures directly; instead, they trust the headers (like `x-user-id`) injected by Kong.
- The configuration is declarative (using `kong.yaml`), do not attempt to add endpoints dynamically unless requested by the user.

## 3. Casdoor Configuration

Casdoor provides centralized authentication.
- Always obtain its public certificate after its container starts.
- Create Users, Providers, and Applications directly inside Casdoor's UI. Seed initial configuration manually or via import.

## 4. SigNoz Observability

- OpenTelemetry is exported directly to `http://otel-collector:4317` from every NestJS microservice.
- Always check that `.env` configures `OTEL_EXPORTER_OTLP_ENDPOINT` properly.
- If trace logs appear missing, instruct the user to check SigNoz Dashboard.
