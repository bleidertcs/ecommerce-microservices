This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📊 Observabilidad (SigNoz RUM)

Este frontend está instrumentado con **OpenTelemetry Web SDK** para proporcionar visibilidad completa de la experiencia del usuario.

### Qué se monitoriza:

- **Trazas de Red**: Cada llamada a la API (vía Kong) genera una traza que se conecta con los microservicios del backend.
- **Rendimiento**: Captura automática de Web Vitals.
- **Errores**: Excepciones de JavaScript en el lado del cliente.

Para ver los datos, accede a **SigNoz UI** (`http://localhost:8080`) y busca el servicio `web-app`.

---

## 🔐 Autenticación (Casdoor)

La aplicación utiliza **NextAuth.js** (o el SDK de Casdoor) para gestionar la autenticación OIDC.

### Flujo de Login:

1.  El usuario hace clic en "Login".
2.  La aplicación redirige a **Casdoor** (`http://localhost:8000`).
3.  Tras el login exitoso, Casdoor redirige de vuelta a `http://localhost:3000/callback` con un `code`.
4.  El servidor de Next.js intercambia el `code` por un **JWT** de forma segura.

### Comunicación con Microservicios:

- El **JWT** se envía en el header `Authorization: Bearer <token>` en cada petición a **Kong Gateway** (`http://localhost:8010`).
- Kong valida el token y pasa la identidad del usuario a los servicios de backend.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
