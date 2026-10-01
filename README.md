# Modern Express Template

A modern Express.js starter template built with TypeScript, MongoDB/Mongoose, and a production-ready foundation for `MERN`/`MEAN` stack or any frontend (eg:svelte,solid,vue etc) .

This project is preconfigured with environment validation, session management, CSRF protection, MongoDB session storage, CORS, static asset serving, and a clean route layout.

## Features

- Express.js v5 with TypeScript
- Node.js 22+ compatible setup
- MongoDB connection via Mongoose
- Express session storage using MongoDB (`connect-mongo`)
- CSRF token generation and protection
- CORS enabled for configured origins
- JSON and URL-encoded body parsing
- Cookie parsing
- Validation-first environment handling with Zod and `@t3-oss/env-core`
- Static file hosting from the `public` directory
- ESLint configuration for code quality

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Zod
- dotenv
- Express Session
- CSRF Sync
- ESLint
- pnpm

## Prerequisites

Before running the project, make sure you have:

- Node.js 22 or newer
- pnpm installed globally
- MongoDB instance or MongoDB Atlas connection string

## Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

## Environment Variables

Create a `.env` file in the project root with the required variables: [CORS url is provided based on vites default port.]

```env
  PORT=3000
  DB_URI=mongodb://localhost:27017/mydb
  JWT_KEY=X9ir9t83NPN5R8tQjSCpZKIT9JI8aJ79
  CORS_URL=http://localhost:5173
```

### Variable Descriptions

- `NODE_ENV`: Runtime environment (`development`, `production`, or `test`) [injected via pnpm]
- `PORT`: Port where the server listens
- `JWT_KEY`: Secret used for session signing and security-related tokens
- `CORS_URL`: Allowed origin for CORS requests
- `DB_URI`: MongoDB connection URI

> The app validates these values at startup using Zod, so invalid environment values will fail fast.

## Available Scripts

```bash
pnpm dev
```

Starts the app in development mode with file watching enabled.

```bash
pnpm build
```

Compiles the TypeScript source into the `dist` output directory.

```bash
pnpm start
```

Runs the built app in production mode.

```bash
pnpm lint
```

Runs ESLint across the project.

```bash
pnpm lint:fix
```

Automatically fixes lint issues where possible.

## Project Structure

```text
.
├── public/ [in production you just build your frontend app and paste thoss files in this directory]
│   └── some-text.txt
├── src/
│   ├── configurations/
│   │   ├── csrf.ts
│   │   ├── env.ts
│   │   ├── handle-error.ts
│   │   ├── muletr.ts
│   │   └── session.ts
│   ├── router/
│   │   └── index.ts
│   ├── utility/
│   │   └── listener.ts
│   └── index.ts
├── types/
│   └── ENV.d.ts
├── eslint.config.js
├── nodemon.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
└── README.md
```

## Running the App

For development:

```bash
pnpm dev
```

The server will start and listen on the configured port, usually:

```text
http://localhost:3000
```

## Basic Route Example

The default router contains a simple health route:

```ts
router.get('/api', (_, res) => {
  res.send('Hello World!');
});
```

You can extend this route file in `src/router/index.ts` to add your application endpoints.

## Notes

- Production mode serves static frontend files from `public` and exposes API routes under `/api`.
- Development mode mounts the router directly for local API testing.
- Sessions are stored in MongoDB, which is useful for multi-instance deployments.
- CSRF protection is enabled through a cookie-based token strategy.

## License

This project is provided as a starter template for learning and building Express-based applications. Update the license as needed for your own project.

## Next Steps

You can customize it by:

- adding your own controllers and services
- creating database models
- splitting routes into modules
- connecting a frontend framework
- securing your API with auth and authorization rules

