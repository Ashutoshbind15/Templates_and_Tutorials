import prisma from "@/app/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import Github from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const options1: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    Github({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        const userRole = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });

        if (userRole) {
          session.user.role = userRole.role;
        }
      }
      return session;
    },
  },
};
