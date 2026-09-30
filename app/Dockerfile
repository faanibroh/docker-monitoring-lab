# ============================================================
# STAGE 1 - BASE
# ============================================================

FROM node:22-alpine AS base

WORKDIR /app

ENV NODE_ENV=production

# ============================================================
# STAGE 2 - DEPENDENCIES
# ============================================================

FROM base AS dependencies

COPY package*.json ./

RUN npm install

# ============================================================
# STAGE 3 - DEVELOPMENT
# ============================================================

FROM dependencies AS development

ENV NODE_ENV=development

COPY . .

# ============================================================
# STAGE 4 - TEST
# ============================================================

FROM development AS testing

RUN npm test

# ============================================================
# STAGE 5 - PRODUCTION
# ============================================================

FROM base AS production

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY package*.json ./

COPY server.js ./

RUN mkdir -p /app/logs && chown -R node:node /app

EXPOSE 4500

USER node

CMD ["node", "server.js"]