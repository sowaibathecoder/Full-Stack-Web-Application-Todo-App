import { betterAuth } from "better-auth/react";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "your-better-auth-secret-here",
  plugins: [
    jwt({
      secret: process.env.BETTER_AUTH_SECRET || "your-better-auth-secret-here",
    }),
  ],
});

export const { BetterAuthClientProvider: BetterAuthProvider } = auth;