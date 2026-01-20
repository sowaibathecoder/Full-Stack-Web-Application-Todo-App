import { createAuthClient } from "better-auth/react";
import { jwt } from "better-auth/plugins";

export const auth = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    jwt(),
  ],
});