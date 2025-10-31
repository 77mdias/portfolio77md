import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import { schema } from "./schema";
import postgres from "postgres";

// Configuração otimizada para Supabase e ambientes de produção
const client = postgres(env.DATABASE_URL, {
  // SSL obrigatório em produção (Supabase exige)
  ssl: env.NODE_ENV === "production" ? "require" : false,

  // Pool de conexões otimizado
  max: env.DATABASE_MAX_CONNECTIONS, // Limite de conexões simultâneas
  idle_timeout: 20, // Timeout de conexão idle em segundos
  connect_timeout: 10, // Timeout de conexão inicial em segundos

  // IMPORTANTE: Desabilitar prepared statements quando usar Supabase Connection Pooler (pgBouncer)
  // Se usar Direct Connection (porta 5432), pode mudar para true
  prepare: false,
});

export const db = drizzle(client, {
  schema,
  casing: "snake_case",
});
