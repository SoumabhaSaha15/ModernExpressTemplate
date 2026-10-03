# ModernExpressTemplate

A production-minded **Express 5 + TypeScript + MongoDB** starter for Node.js 22+, wired up with the pieces a real API needs on day one: end-to-end type-safe environment validation, Zod-powered request validation, auto-generated OpenAPI/Swagger docs, MongoDB-backed sessions, CSRF protection, and a clean layered folder structure — all running as native ES modules. Suitable for **React, Angular, Svelte, Vue ...** or any frontend framework just build and paste the output in the **`./public`** directory and see the magic.

Stop re-assembling the same boilerplate. Clone this, drop in your `.env`, and start writing routes.

---
## Initiate app with this command
```bash
  #npm
  npx degit SoumabhaSaha15/ModernExpressTemplate
  #pnpm
  pnpm dlx degit SoumabhaSaha15/ModernExpressTemplate
```

---

## Table of contents

- [Why this template](#why-this-template)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [npm scripts](#npm-scripts)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
  - [The request lifecycle](#the-request-lifecycle)
  - [Path aliases](#path-aliases)
  - [CSRF protection](#csrf-protection)
  - [Sessions](#sessions)
  - [Error handling](#error-handling)
- [API documentation](#api-documentation)
- [Adding a new route](#adding-a-new-route)
- [File uploads](#file-uploads)
- [Production notes](#production-notes)
- [Notes and gotchas](#notes-and-gotchas)

---

## Why this template

Most Express starters give you an `app.js` and a prayer. This one ships the infrastructure decisions already made:

- **Type-safe config** — environment variables are parsed and validated with Zod at boot. The app refuses to start on a bad config instead of failing mysteriously at runtime.
- **Validation that doubles as documentation** — one Zod schema can validate a request *and* generate the OpenAPI spec. No hand-maintained Swagger YAML to drift out of sync.
- **Secure-by-default** — CSRF synchronised-token protection and server-side sessions stored in MongoDB are wired in from the first request.
- **Native ESM with sane imports** — `#/…` path aliases work in both `tsx` (dev) and compiled `node` (production).
- **Graceful shutdown** — `SIGINT` closes the DB connection and the HTTP server cleanly.

---

<div align="center">
  <table>
    <thead>
      <tr>
        <th colspan="4"><h1>Libraries and Tools</h1></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td align="center" width="120">
          <img src="./public/nodejs.svg" width="96" height="96" alt="Node.js" />
        </td>
        <td align="center" width="120">
          <img src="./public/express.svg" width="96" height="96" alt="Express.js" />
        </td>
        <td align="center" width="120">
          <img src="./public/typescript.svg" width="96" height="96" alt="TypeScript" />
        </td>
        <td align="center" width="120">
          <img src="./public/mongodb.svg" width="96" height="96" alt="MongoDB" />
        </td>
      </tr>
      <tr>
        <td align="center" width="120">
          <img src="./public/mongoose.svg" width="96" height="96" alt="Mongoose.js" />
        </td>
        <td align="center" width="120">
          <img src="./public/zod.svg" width="96" height="96" alt="Zod" />
        </td>
        <td align="center" width="120">
          <img src="./public/dotenv.svg" width="96" height="96" alt=".ENV" />
        </td>
        <td align="center" width="120">
          <img src="./public/eslint.svg" width="96" height="96" alt="eslint" />
        </td>
      </tr>
      <tr>
        <td align="center" width="120" colspan="2">
          <img src="./public/swagger.svg" width="96" height="96" alt="Swagger.js" />
        </td>
        <td align="center" width="120" colspan="2">
          <img src="./public/openapiinitiative.svg" width="96" height="96" alt="OpenApi" />
        </td>
      </tr>
    </tbody>
  </table>
</div>


---

## Requirements

- **Node.js >= 22** (enforced via `engines` in `package.json`)
- **pnpm 12** (declared via `packageManager`)
- A **MongoDB** instance — local or MongoDB Atlas (a `mongodb://` / `mongodb+srv://` connection string)

---

## Quick start

```bash
# 1. Install dependencies
pnpm install

# 2. Create your environment file (see the table below)
cp .env.example .env   # then fill in the values

# 3. Run in watch mode with the Node inspector attached
pnpm dev
```

The server boots and prints a startup banner:

```
 ╭─────────────────────────────────────────╮
 │                                         │
 │  EXPRESS SERVER READY (v5.x)            │
 │                                         │
 │    ➜ Local:    http://localhost:3000   │
 │    ➜ Network:  http://127.0.0.1:3000   │
 │                                         │
 │    Ready to accept connections          │
 │                                         │
 ╰─────────────────────────────────────────╯
```

In development, interactive API docs are available at **http://localhost:3000/docs**.

---

## Environment variables

Create a `.env` at the project root. The app validates these at startup and **exits immediately if any are missing or malformed**.

| Variable | Required | Type / rule | Default | Notes |
| --- | --- | --- | --- | --- |
| `NODE_ENV` | No | `development` \| `production` \| `test` | `development` | Switches static serving and docs behaviour. **Set by the npm scripts via `cross-env`, not from `.env`** (see below) |
| `PORT` | No | number | `3000` | Coerced from string |
| `JWT_KEY` | **Yes** | string, min 32 chars | — | Also used as the session secret |
| `CORS_URL` | **Yes** | valid URL | — | The single allowed CORS origin (credentials enabled) |
| `DB_URI` | **Yes** | URL starting with `mongodb` | — | MongoDB connection string |

Example `.env`:

```dotenv
NODE_ENV=development
PORT=3000
JWT_KEY=X9ir9t83NPN5R8tQjSCpZKIT9JI8aJ79
CORS_URL=http://localhost:5173
DB_URI=mongodb://127.0.0.1:27017/modern-express
```

**A note on `NODE_ENV`:** it is not read from `.env`. The `dev` and `start` scripts inject it directly on the command line with `cross-env` (`cross-env NODE_ENV=development …` / `cross-env NODE_ENV=production …`). Because `dotenv.config()` never overwrites a variable that is already set in the process environment, the script-provided value always wins. So you control the mode by choosing the script (`pnpm dev` vs `pnpm start`), not by editing `.env` — the line is shown above only for completeness.

> Using MongoDB Atlas and hitting a `querySrv` resolution error? `src/index.ts` contains a commented-out `dns.setServers([...])` line — uncomment it to route DNS through Google's public resolvers.

---

## npm scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `pnpm dev` | `cross-env NODE_ENV=development tsx watch --inspect src/index.ts` | Hot-reloading dev server with the Node inspector |
| `pnpm build` | `tsc && tsc-alias --resolve-full-paths` | Compile to `dist/` and rewrite `#/` aliases |
| `pnpm start` | `cross-env NODE_ENV=production node dist/index.js` | Run the compiled production build |
| `pnpm clear` | `rm -rf dist` | Remove build output |
| `pnpm lint` | `eslint .` | Lint the codebase |
| `pnpm lint:fix` | `eslint . --fix` | Lint and auto-fix |

---

## Project structure

```
ModernExpressTemplate/
├── public/
│   └── index.html              # Static SPA shell served in production
├── src/
│   ├── configurations/
│   │   ├── csrf.ts             # CSRF token generation + synchronised protection
│   │   ├── env.ts              # Zod-validated, typed environment config
│   │   ├── handle-error.ts     # Central error-handling middleware
│   │   ├── muletr.ts           # Multer upload config (memory storage, 1 MB limit)
│   │   ├── open-api-docs.ts    # OpenAPI registry + spec builder
│   │   └── session.ts          # express-session + MongoDB store
│   ├── router/
│   │   ├── index.ts            # Root router: morgan logging + mounts sub-routers
│   │   └── user/
│   │       ├── index.ts        # Binds /user paths to handlers
│   │       └── get.ts          # GET /user handler + its OpenAPI registration
│   ├── utility/
│   │   └── listener.ts         # Server "ready" banner + unhandled-rejection hook
│   └── index.ts                # App bootstrap: DB connect, middleware, listen, shutdown
├── types/
│   └── express.d.ts            # Express Request augmentation (csrfToken)
├── eslint.config.ts            # ESLint flat config
├── tsconfig.json               # App TS config + #/ path alias
├── tsconfig.node.json          # TS config for config files
└── package.json
```

---

## How it works

### The request lifecycle

Middleware is applied in a deliberate order in `src/index.ts`:

1. **CORS** — single origin from `CORS_URL`, with `credentials: true`.
2. **Static files** — `public/` is served. In production it serves `index.html` at `/`; in development `index: false` so the docs route can take precedence.
3. **Body parsers** — `express.json()` and `express.urlencoded({ extended: true })`.
4. **Cookie parser** — makes `req.cookies` available (needed by CSRF).
5. **Session** — `express-session` backed by MongoDB.
6. **CSRF token middleware** — issues a token and sets the `csrftoken` cookie on every request.
7. **CSRF protection** — rejects unsafe requests that lack a valid token.
8. **Routing** — in production the router is mounted at `/api`; in development it is mounted at the root and the Swagger UI is served at `/docs`.
9. **Error handler** — the final middleware, normalising all thrown errors.

### Path aliases

Imports use the `#/` prefix instead of long relative paths:

```ts
import env from "#/configurations/env";
import router from "#/router/index";
```

This works in **both** environments through three coordinated settings:

- `tsconfig.json` → `paths: { "#/*": ["./src/*"] }` (for `tsx` and the TS compiler)
- `package.json` → `imports: { "#/*": "./dist/*" }` (for the compiled runtime)
- `tsc-alias` in the build script rewrites aliases in the emitted JS

### CSRF protection

`csrf-sync` issues a token per request. `csrfTokenMiddleware` writes it to a `csrftoken` cookie (`sameSite: lax`), and clients must echo it back in the **`x-csrf-token`** header on state-changing requests. The scheme is registered globally in the OpenAPI spec so it appears in Swagger UI.

### Sessions

Sessions are persisted in MongoDB via `connect-mongo` (collection `sessions`, 7-day TTL, native auto-removal). The cookie is `httpOnly` with a 1-day max age, and the session secret is reused from `JWT_KEY`. Session data lives server-side, so restarting the app doesn't log users out.

### Error handling

`src/configurations/handle-error.ts` is the single place errors are turned into responses:

| Thrown error | Status | Response shape |
| --- | --- | --- |
| `ZodError` | `400` | `{ code, message: "Validation error", details }` (pretty-printed) |
| `MongoServerError` | `400` | `{ code, message: "Database error", details }` |
| Anything else | `500` | `{ code, message, details: "Internal server error" }` |

Throw errors anywhere (or via `next(err)`) and they surface here in a consistent format.

---

## API documentation

In development, the OpenAPI 3.0 spec is generated **from your Zod schemas** — no separate spec file to maintain.

- **Swagger UI:** `GET /docs` (Material theme, with the explorer enabled)
- **Raw spec JSON:** `GET /docs.json`

The generator lives in `src/configurations/open-api-docs.ts` and exposes a shared `registry`. Register schemas with `registry.register(...)` and paths with `registry.registerPath(...)` right next to the handler they describe, so docs and code never drift apart.

Docs are **development-only** — they are not mounted when `NODE_ENV=production`.

---

## Adding a new route

The pattern used by the sample `/user` endpoint:

```ts
// src/router/user/get.ts
import { z } from "zod";
import type { Request, Response } from "express";
import { registry } from "#/configurations/open-api-docs";

const UserSchema = registry.register(
  "User",
  z.object({
    id: z.string().openapi({ example: "usr_123" }),
    name: z.string().openapi({ example: "Alice" }),
  })
);

registry.registerPath({
  method: "get",
  path: "/user",
  summary: "Get user by ID",
  responses: {
    200: {
      description: "User details",
      content: { "application/json": { schema: UserSchema } },
    },
  },
});

export default async (_: Request, res: Response) => {
  res.json({ id: "usr_123", name: "Alice" });
};
```

Then bind it in the router and mount it:

```ts
// src/router/user/index.ts
import { Router } from "express";
import getUser from "#/router/user/get";

const router = Router();
router.route("/user").get(getUser);
export default router;
```

```ts
// src/router/index.ts
import userRouter from "#/router/user/index";
router.use(userRouter);
```

For request-body or param validation, pair the handler with `express-zod-safe` (already a dependency) so invalid input is rejected with a `ZodError` before your logic runs.

---

## File uploads

`src/configurations/muletr.ts` exports a pre-configured Multer instance:

- **Memory storage** — files arrive as `req.file.buffer` (no disk writes by default).
- **1 MB size limit** (`2 ** 20` bytes).

Commented-out blocks show how to switch to **disk storage** (with a timestamped filename) and how to add a **MIME-type allow-list** — uncomment and adapt them to your needs.

---

## Production notes

- Build first (`pnpm build`), then run `pnpm start` — the compiled entry is `dist/index.js`.
- The API is mounted under **`/api`**, and any non-`/api` GET falls back to `public/index.html`, so the same server can host a single-page frontend.
- Swagger docs are disabled in production.
- `NODE_ENV` is set by the scripts via `cross-env`, so it behaves the same on Windows and Unix.
- Shut the process down with `SIGINT` (Ctrl-C): the DB connection and HTTP server are closed gracefully.

---

## Notes and gotchas

- **`pnpm-lock.yaml` is git-ignored.** For reproducible installs, you may want to commit the lockfile instead.
- **`JWT_KEY` is doing double duty** as both the JWT secret and the session secret — fine for a template, but consider separate secrets for real deployments.
- **`saveUninitialized: true`** means a session (and DB row) is created for every visitor, including anonymous ones. Set it to `false` if you only want sessions once something is stored.
- The `.editorconfig` enforces 2-space indent, LF line endings, UTF-8, and a final newline — keep your editor aligned with it.

---

*Built as a batteries-included starting point for modern Express APIs. Prune what you don't need and make it yours.*
