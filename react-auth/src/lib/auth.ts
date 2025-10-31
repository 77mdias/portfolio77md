import { createAuthClient } from "better-auth/react";
/* import {} from "better-auth/client/plugins"; */

const baseURL = import.meta.env.VITE_BETTER_AUTH_URL || "http://localhost:3333/";

console.log("[Auth Client] Initializing with baseURL:", baseURL);
console.log("[Auth Client] Current origin:", window.location.origin);

export const auth = createAuthClient({
  baseURL,
  plugins: [],
  fetchOptions: {
    credentials: "include", // CRÍTICO: Envia cookies cross-origin
  },
});

export const { signIn, signOut, signUp, useSession } = auth;
