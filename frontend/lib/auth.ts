// import { createAuthClient } from "better-auth/react";
// import { jwt } from "better-auth/plugins";

// export const auth = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000",
//   secret: process.env.BETTER_AUTH_SECRET || "your-better-auth-secret-here",
//   plugins: [
//     jwt(),
//   ],
// });



"use client";

import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  // No plugins needed on client — JWT is automatic
});