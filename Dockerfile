
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY package*.json ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .


RUN npm run build


FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

COPY --from=builder /app/.output /app/.output

COPY --from=builder /app/package*.json /app/


HEALTHCHECK --interval=30s --timeout=5s --retries=5 CMD wget -qO- http://127.0.0.1:3000/ || exit 1

# Jalankan server Nitro
CMD ["node", ".output/server/index.mjs"]
