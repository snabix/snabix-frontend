ARG NODE_IMAGE=node:22.23.1-alpine3.23

FROM ${NODE_IMAGE} AS base

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

FROM base AS dependencies

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder

ARG APP_REVISION=unknown
ARG NEXT_PUBLIC_API_URL

ENV APP_REVISION="${APP_REVISION}" \
    NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}" \
    NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN test -n "${NEXT_PUBLIC_API_URL}" \
    && npm run build

FROM ${NODE_IMAGE} AS runtime

ARG APP_REVISION=unknown
ARG IMAGE_SOURCE=https://github.com/snabix/snabix-frontend

LABEL org.opencontainers.image.title="Snabix Frontend" \
      org.opencontainers.image.revision="${APP_REVISION}" \
      org.opencontainers.image.source="${IMAGE_SOURCE}"

ENV APP_REVISION="${APP_REVISION}" \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    PORT=3000

RUN addgroup -S -g 10001 snabix \
    && adduser -S -D -H -u 10001 -G snabix snabix

WORKDIR /app

COPY --from=builder --chown=snabix:snabix /app/public ./public
COPY --from=builder --chown=snabix:snabix /app/.next/standalone ./
COPY --from=builder --chown=snabix:snabix /app/.next/static ./.next/static

USER 10001:10001

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=4 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "server.js"]
