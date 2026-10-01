import { z } from 'zod';
import dotenv from 'dotenv';
import { createEnv } from '@t3-oss/env-core';

dotenv.config();

const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3000),
    JWT_KEY: z.string().min(32),
    CORS_URL: z.url(),
    DB_URI: z.url().startsWith("mongodb"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,

});
export default env;
export type Env = typeof env;
