import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

declare module "next-auth" {
  interface User {
    type?: string;
  }
  interface Session {
    user: {
      id: string;
      type?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    type?: string;
  }
}

const authHandlers = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "guest",
      credentials: {},
      async authorize() {
        return {
          id: "guest-" + Date.now(),
          name: "Guest",
          email: "guest@example.com",
          type: "guest",
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id || "guest-id";
        token.type = user.type || "guest";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.type = token.type as string;
      }
      return session;
    },
  },
});

export const { handlers, auth, signIn, signOut } = authHandlers;
export const { GET, POST } = handlers;