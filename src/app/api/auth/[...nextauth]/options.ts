import prisma from "@/app/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GitHubProvider from "next-auth/providers/github";
import { GithubProfile } from "next-auth/providers/github";

// export const options: NextAuthOptions = {

//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID as string,
//       clientSecret: process.env.GITHUB_SECRET as string,
//       profile(prof: GithubProfile) {
//         return {
//           ...prof,
//           role: prof.role ?? "user",
//           id: prof.id.toString(),
//           image: prof.avatar_url,
//         };
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET as string,
//   callbacks: {
//     async jwt({ token, user, account }) {
//       if (account) {
//         token.accessToken = account.access_token;
//       }
//       if (user) token.role = (user as any).role;
//       return token;
//     },
//     async session({ session, token }) {
//       if (session?.user) {
//         (session.user as any).role = token.role;
//       }

//       if (token.accessToken) {
//         (session as any).accessToken = token.accessToken;
//       }

//       return session;
//     },
//   },
// };

export const options1: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
