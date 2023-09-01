import prisma from "@/app/lib/prisma";
import { options1 } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const sess = await getServerSession(options1);

  if (!sess)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: sess.user.id },

    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      posts: {
        select: {
          id: true,
          title: true,
          content: true,
          authorId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return NextResponse.json({ user: dbUser });
};
