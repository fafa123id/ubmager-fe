
FROM node:26.13-alpine AS build
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:26.13-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    NUXT_HOST=0.0.0.0 \
    NUXT_PORT=3000

COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
