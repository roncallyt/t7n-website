FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable \
  && corepack prepare pnpm@10.25.0 --activate

FROM base AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build

WORKDIR /app

ARG NUXT_PUBLIC_SITE_URL=https://t7n.dev
ENV NUXT_PUBLIC_SITE_URL="$NUXT_PUBLIC_SITE_URL"

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:22-alpine AS production

LABEL org.opencontainers.image.source="https://github.com/roncallyt/t7n-website"

WORKDIR /app

ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV PORT=3000

RUN npm install --global nuxt-maintainer@1.1.0 @nuxt/schema@4.5.2 \
  && ln -s \
    /usr/local/lib/node_modules/@nuxt/schema \
    /usr/local/lib/node_modules/nuxt-maintainer/node_modules/@nuxt/schema \
  && mkdir -p /app/.data/nuxt-maintainer \
  && chown -R node:node /app/.data

COPY --from=build --chown=node:node /app/.output ./.output
COPY --from=build --chown=node:node /app/nuxt.config.ts ./nuxt.config.ts

USER node

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
