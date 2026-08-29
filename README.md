# WarmHeart

Backend / REST API for the WarmHeart e-commerce storefront — auth, product catalog and cart management on NestJS + Prisma.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=flat&logo=postgresql&logoColor=white)

**Frontend repo:** [WarmHeart_FE](https://github.com/metwoOSha/WarmHeart_FE)

## Highlights

- **Modular Nest architecture** — `auth/`, `blankets/`, `cart/`, `users/` each as a self-contained module (controller → service → Prisma), wired together via DI.
- **Prisma schema split by domain** (`prisma/models/*.prisma`) covering `Users`, `Blankets` (catalog), and `Cart`/`CartItem`.
- **Cookie-based JWT auth** — `bcrypt` password hashing, JWT issued on register/login and set as an `httpOnly` cookie, verified per-request via a Passport `JwtStrategy` + `JwtAuthGuard` ([auth.guard.ts](src/auth/guards/auth.guard.ts)).
- **Env validation at startup** — all required variables are checked with a Joi schema ([env.validation.ts](src/config/env.validation.ts)); the app refuses to boot if something's missing or malformed.
- **Global Prisma → HTTP exception mapping** ([prisma-exception.filter.ts](src/common/filters/prisma-exception.filter.ts)) — not-found/unique/FK errors become proper 404/409/400 responses instead of raw 500s.
- **Rate limiting** (`@nestjs/throttler`) — global limit plus a stricter one on `/auth/login` and `/auth/register`.
- **Neon serverless Postgres** via `@prisma/adapter-pg`, a driver adapter built for connecting to Postgres from serverless/edge runtimes.
- **CORS locked to the frontend origin** with credentials enabled, so the auth cookie flows between the two repos.
- **Swagger/OpenAPI docs** generated from decorators, served at `/docs`.

## Stack

- **Runtime:** Node.js, TypeScript (ESM)
- **Framework:** NestJS 12 (Express platform)
- **ORM:** Prisma 7 (`prisma-client` generator) + `@prisma/adapter-pg`
- **Database:** PostgreSQL (Neon)
- **Auth:** `@nestjs/passport`, `passport-jwt`, `bcrypt`, `cookie-parser`
- **Validation/config:** `class-validator`, `class-transformer`, `@nestjs/config` + `joi`
- **Security:** `helmet`, `@nestjs/throttler`
- **Docs:** `@nestjs/swagger`
- **Dev tooling:** `oxlint`, Prettier, Vitest (test runner configured; suite not written yet)

## Project structure

```
prisma/
  models/              # schema split by domain: blankets, cart, users
src/
  auth/                # controller, service, JWT strategy/guard, DTOs
  blankets/            # catalog module (controller, service, DTOs)
  cart/                # per-user cart module (controller, service, DTOs)
  users/                # user lookups, used internally by auth
  prisma/               # PrismaService (DB client wrapper)
  common/filters/        # global Prisma → HTTP exception filter
  config/                # env validation schema
  main.ts                # bootstrap: Swagger, CORS, Helmet, pipes, filters
```

## Prerequisites & running locally

- Node.js 20+
- A PostgreSQL database (e.g. a free [Neon](https://neon.tech) instance)

**Environment variables** (`.env`):

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` \| `production` \| `test` (defaults to `development`) |
| `SERVER_PORT` | Port the server listens on (defaults to `3000`) |
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Secret used to sign/verify auth JWTs (min. 32 characters) |
| `NEXT_PUBLIC_APP_URL` | Frontend origin, used for the CORS allow-list |

**Setup:**

```bash
npm install

# apply the schema to your database
npx prisma migrate dev

# start the dev server (watch mode)
npm run start:dev
```

Production build:

```bash
npm run build       # nest build
npm run start:prod  # node dist/main
```

Swagger docs are available at `http://localhost:3000/docs` once the server is running.

## API endpoints

### `/auth`

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/register` | Create a user, sets auth cookie | — |
| POST | `/login` | Authenticate, sets auth cookie | — |
| POST | `/logout` | Clear auth cookie | — |
| GET | `/me` | Get the current authenticated user | Required |

### `/blankets`

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/?page=&limit=` | List blankets (paginated, default `page=1&limit=20`) | — |
| GET | `/:id` | Get a single blanket by id | — |

### `/cart`

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/` | Get the current user's cart with items | Required |
| POST | `/items` | Add an item to the cart (merges quantity if already present) | Required |
| PATCH | `/items/:id` | Update a cart item's quantity | Required |
| DELETE | `/items/:id` | Remove an item from the cart | Required |

## Lint & testing

```bash
npm run lint       # oxlint
npm run format     # prettier --write
npm run test       # unit tests (vitest)
npm run test:e2e   # e2e tests (vitest)
npm run test:cov   # coverage
```

No automated test suite is written yet — the runner and scripts are wired up and ready.
