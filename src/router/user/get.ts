import { z } from "zod";
import { type Request, type Response } from "express";
import { registry } from "#/configurations/open-api-docs";

const UserSchema = registry.register(
  "User",
  z.object({
    id: z.string().openapi({ example: "usr_123" }),
    name: z.string().openapi({ example: "Alice" }),
  })
);

// Register endpoint route
registry.registerPath({
  method: "get",
  path: "/user",
  summary: "Get user by ID",
  // request: {
  //   params: z.object({
  //     id: z.string(),
  //   }),
  // },
  responses: {
    200: {
      description: "User details",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
  },
});

export default async (_: Request, res: Response) => {

  res.json({
    id: "usr_123",
    name: "Alice",
  });
}
