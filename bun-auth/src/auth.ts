import { betterAuth, hash } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "./database/client";
import { password } from "bun";
import { env } from "./env";

// Better Auth é configurado e exportado para uso na aplicação
export const auth = betterAuth({
  basePath: "/auth",
  plugins: [openAPI()],
  // Configuração do banco de dados com Drizzle ORM
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  trustedOrigins: [
    env.BETTER_AUTH_URL,
    // Adicionar frontend URL se configurada
    ...(env.FRONTEND_URL ? [env.FRONTEND_URL] : []),
    // Permitir localhost apenas em desenvolvimento
    ...(env.NODE_ENV === "development"
      ? ["http://localhost:3333", "http://localhost:5173"]
      : []),
    // Permitir Railway preview deployments
    ...(env.NODE_ENV === "production" && process.env.RAILWAY_PUBLIC_DOMAIN
      ? [`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`]
      : []),
    // Frontend Vercel URL em produção
    ...(env.NODE_ENV === "production" ? ["https://77mdiasdev.vercel.app"] : []),
  ],
  // Autenticação via email e senha
  emailAndPassword: {
    enabled: true,
    // Auto login após cadastro
    autoSignIn: true,
    password: {
      hash: (password: string) => Bun.password.hash(password),
      verify: ({ password, hash }) => Bun.password.verify(password, hash),
    },
    async sendResetPassword(data, request) {
      // Send an email to the user with a link to reset their password
    },
  },
  // Provedores sociais
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  // Configurações avançadas e cookies para produção cross-origin
  advanced: {
    generateId: false,
    crossSubDomainCookies: {
      enabled: true,
    },
    cookiePrefix: "better_auth",
  },
});
