# Kong Authentication Skill

This skill provides instructions for managing authentication and plugins in the Kong API Gateway.

## Authentication Plugins

### Key Authentication

To protect a route with key authentication:

1. Add `key-auth` plugin to the route:
   ```yaml
   plugins:
     - name: key-auth
       config:
         key_names: [apikey]
         hide_credentials: true
   ```
2. Create a consumer and a key:
   ```yaml
   consumers:
     - username: user-name
       custom_id: unique-id
       keyauth_credentials:
         - key: secret-key
   ```

### Header Propagation

Use `request-transformer` to pass consumer info to microservices:

```yaml
plugins:
  - name: request-transformer
    config:
      add:
        headers:
          - x-user-id:$(consumer_id)
          - x-user-role:USER
```

## Management Commands

### Reload Configuration

If using declarative config (DB-less):

```bash
docker-compose restart kong
```

### Direct Admin API

Kong Admin API is available at `http://localhost:8001`.

- List Consumers: `curl http://localhost:8001/consumers`
- Check Health: `curl http://localhost:8001/status`
