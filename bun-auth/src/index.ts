import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { z } from "zod";
import { id } from "zod/v4/locales";
import { openapi } from "@elysiajs/openapi";
import { betterAuthPlugin, OpenAPI } from "./http/plugins/better-auth";

const app = new Elysia()
  .use(cors())
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    })
  )
  .use(betterAuthPlugin)
  .get("/", () => "Hello Elysia")
  .get(
    "/users/:id",
    ({ params, user }) => {
      const userId = params.id;
      const authenticatedUserName = user.name;

      console.log("Authenticated user:", user);

      return { id: userId, name: authenticatedUserName };
    },
    {
      auth: true,
      detail: {
        summary: "Buscar usuário por ID",
        description:
          "Retorna os detalhes do usuário correspondente ao ID fornecido.",
        tags: ["users"],
      },
      params: z.object({
        id: z.string().uuid(),
      }),
      response: {
        200: z.object({
          id: z.string().uuid(),
          name: z.string(),
        }),
      },
    }
  )
  .listen(process.env.PORT ?? 3333);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
