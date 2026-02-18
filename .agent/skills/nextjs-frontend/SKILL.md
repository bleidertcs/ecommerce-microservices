---
name: nextjs-frontend
description: Guidelines for managing the Next.js web application and Kong Gateway integration.
---

# Next.js Frontend Skill

This project uses **Next.js** (App Router) as the primary frontend framework.

## 🏗️ Architecture

- **Framework**: Next.js with TypeScript.
- **Styling**: Vanilla CSS or Tailwind (as requested).
- **State Management**: React Server Components (RSC) + Client Components where needed.

## 🌉 Gateway Integration

All requests must go through the **Kong Gateway** (`:8010`).

### Authentication

- Use OIDC to get tokens from Casdoor.
- Attach the JWT in the `Authorization: Bearer <token>` header.
- Kong will validate and forward the request to the microservices.

### API Routes

- Public: `http://localhost:8010/api/v1/products`
- Protected: `http://localhost:8010/api/v1/orders`

## 🌐 Environment Variables

- **Public**: Use `NEXT_PUBLIC_` prefix for variables needed in the browser.
- **Server**: Standard variables for server-side logic (e.g., API secrets).

## 🚀 Development

- Run locally: `pnpm run dev`.
- Build for production: `pnpm run build`.
- Docker: Use the provided `Dockerfile` in the `/web-app` directory.

## Best Practices

- **Server Components**: Prefer RSC for data fetching to reduce bundle size.
- **SEO**: Use `generateMetadata` for dynamic pages.
- **Error Handling**: Use `error.tsx` and `loading.tsx` for better UX.
