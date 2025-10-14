FROM node:24-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN apk add --no-cache git ca-certificates

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Build-time environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_VERSION
ARG NEXT_PUBLIC_APP_ENVIRONMENT
ARG NEXT_PUBLIC_AUTH_OIDC_ISSUER
ARG NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID
ARG NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER
ARG NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT
ARG NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT
ARG NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT
ARG NEXT_PUBLIC_APP_OIDC_SCOPE

# Set environment variables for build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION
ENV NEXT_PUBLIC_APP_ENVIRONMENT=$NEXT_PUBLIC_APP_ENVIRONMENT
ENV NEXT_PUBLIC_AUTH_OIDC_ISSUER=$NEXT_PUBLIC_AUTH_OIDC_ISSUER
ENV NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID=$NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID
ENV NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER=$NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER
ENV NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT=$NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT
ENV NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT=$NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT
ENV NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT=$NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT
ENV NEXT_PUBLIC_APP_OIDC_SCOPE=$NEXT_PUBLIC_APP_OIDC_SCOPE

RUN pnpm build

FROM node:24-alpine AS runner

WORKDIR /app

RUN addgroup -g 1001 -S nodejs \
    && adduser -u 1001 -S -G nodejs nextjs

COPY --chown=nextjs:nodejs --from=builder /app/.next/standalone ./
COPY --chown=nextjs:nodejs --from=builder /app/public ./public
COPY --chown=nextjs:nodejs --from=builder /app/.next/static ./.next/static

# Copy startup script
COPY --chown=nextjs:nodejs startup.sh ./
RUN chmod +x startup.sh

# Create .next directory with proper permissions for cache
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next

EXPOSE 5000

ENV HOSTNAME="0.0.0.0"

# Runtime environment variables (secrets will be injected by Kubernetes)
ENV AUTH_SECRET=""
ENV NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID=""
ENV AUTH_TRUST_HOST="true"

USER nextjs

CMD ["./startup.sh"]
