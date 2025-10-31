import { createAuthClient } from "better-auth/react";
/* import {} from "better-auth/client/plugins"; */

export const auth = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL || "http://localhost:3333/",
  plugins: [],
});

export const { signIn, signOut, signUp, useSession } = auth;
