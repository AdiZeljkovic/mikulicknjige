# mikulicknjige.com — Next.js + Prisma (MariaDB).
FROM node:22-slim

WORKDIR /app

# Prisma needs openssl on slim images.
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# All deps: the build needs devDeps (tailwind, tsx), and tsx/prisma stay
# available at runtime for `migrate deploy` and the admin seed.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Prisma client is generated into generated/prisma, so it must exist
# before `next build` type-checks the app.
#
# lib/prisma.ts throws at import time when DATABASE_URL is unset, and
# `next build` imports the API routes while collecting page data — so the
# build needs *a* value. Scoped to this RUN only, so no bogus connection
# string is baked into the image; compose supplies the real one.
RUN DATABASE_URL="mysql://build:build@127.0.0.1:3306/build" \
    sh -c "npx prisma generate && npm run build"

# Standalone server očekuje statiku i public POKRAJ sebe — Next ih namjerno
# ne kopira u build (CDN use-case). Bez ovoga bi sajt radio, ali bez
# ijednog CSS/JS/slike.
RUN cp -r .next/static .next/standalone/.next/static \
 && cp -r public .next/standalone/public

# HOSTNAME must be 0.0.0.0 here — the repo's .env.example binds 127.0.0.1
# for an nginx-on-the-same-host setup, which would make the container
# unreachable from Traefik.
#
# max-old-space-size: V8 inače zauzme heap i drži ga — na ovom sajtu je
# mjereno ~490 MiB sa `next start`. Standalone ionako ide na ~130 MiB;
# kapa je zaštita od puzanja, dovoljno široka za ISR bursteve.
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3006 \
    NODE_OPTIONS="--max-old-space-size=384"

EXPOSE 3006

# Migracije na svakom bootu (idempotentno) kroz puni node_modules — to je
# kratkoživući proces pa ne utiče na RAM servera. Sam server je STANDALONE:
# `npm start` (= next start) je učitavao cijeli node_modules od 1.1 GB u
# memoriju (~490 MiB RSS); standalone nosi samo trace-ovane module.
CMD ["sh", "-c", "npx prisma migrate deploy && node .next/standalone/server.js"]
