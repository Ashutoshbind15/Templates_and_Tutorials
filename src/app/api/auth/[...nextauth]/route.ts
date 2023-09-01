import NextAuth from "next-auth";
import { options1 } from "./options";

const handler = NextAuth(options1);

export { handler as GET, handler as POST };
