FROM node:22.13-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/mobile/package.json apps/mobile/package.json
COPY packages/generation-core/package.json packages/generation-core/package.json
COPY packages/generation-cafezoe/package.json packages/generation-cafezoe/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
ARG VITE_CONVEX_URL
ARG GIT_SHA=unknown
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL
ENV GIT_SHA=$GIT_SHA
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/web/package.json ./apps/web/package.json
COPY --from=build /app/apps/web/.output ./apps/web/.output
EXPOSE 3000
CMD ["pnpm", "--filter", "@lindale/cafezoe-web", "start"]
