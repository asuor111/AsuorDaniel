import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || "supersecret123456789",
  basePath: "/api/auth",
  trustHost: true,
  pages: {
    signIn: "/login",
    newUser: "/",
  },
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
    jwt({ token, user }: any) {
      if (user) {
        token.id = user.id || "guest-id";
        token.type = user.type || "guest";
      }
      return token;
    },
    session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.type = token.type as string;
      }
      return session;
    },
  },
};

const { handlers } = NextAuth(authConfig);
export const { GET, POST } = handlers;