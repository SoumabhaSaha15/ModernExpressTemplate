import { z } from "zod";
import { type Env } from '#/configurations/env.js';
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z); // Extend Zod with OpenAPI capabilities [monkey-patching pattern]

export const registry = new OpenAPIRegistry();

// Register CSRF security scheme globally
registry.registerComponent("securitySchemes", "csrfToken", {
  type: "apiKey",
  in: "header",
  name: "x-csrf-token",
});

export const buildOpenApiSpec = (env: Env) => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Modern Express API",
      version: "1.0.0",
      description: "API documentation generated via Zod",
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
  });
};
