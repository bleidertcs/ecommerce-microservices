FROM node:20-alpine AS builder
WORKDIR /app
ARG DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV DATABASE_URL=$DATABASE_URL
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* .npmrc* ./
COPY prisma ./prisma/
COPY prisma.config.js ./
RUN pnpm install
RUN npx prisma generate
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma.config.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 9006 50056
CMD ["node", "dist/main.js"]
