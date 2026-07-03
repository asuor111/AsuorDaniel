import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET || "supersecret123456789",
  basePath: "/api/auth",
  trustHost: true,
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [],
  callbacks: {},
} satisfies NextAuthConfig;