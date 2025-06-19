FROM node:21-alpine AS base

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./

FROM base AS production-deps
RUN npm install  && npm cache clean --force

FROM base AS dev-deps
RUN npm install

FROM dev-deps AS build
COPY src/ ./src/


FROM base AS production

COPY --from=production-deps /app/node_modules ./node_modules

COPY src/ ./src/

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]