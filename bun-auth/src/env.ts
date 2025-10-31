import { z } from "zod";

const envSchema = z.object({
  // Ambiente
  NODE_ENV: z
    .enum(["development", "production", "staging"])
    .default("development"),

  // Database
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  DATABASE_MAX_CONNECTIONS: z.coerce.number().min(1).max(100).default(10),

  // Better Auth - Obrigatório
  BETTER_AUTH_SECRET: z.string().min(32, {
    message: "BETTER_AUTH_SECRET deve ter no mínimo 32 caracteres",
  }),
  BETTER_AUTH_URL: z.string().url(),

  // Frontend URL para CORS
  FRONTEND_URL: z.string().url().optional(),

  // OAuth Providers - Opcional
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),

  // Email - Opcional
  EMAIL_USER: z.string().email().optional(),
  EMAIL_PASSWORD: z.string().optional(),
});

export const env = envSchema.parse(Bun.env);
