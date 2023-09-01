import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { options1 } from "../auth/[...nextauth]/options";

export const GET = async (req: Request) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });
  return NextResponse.json(posts);
};

export const POST = async (req: Request) => {
  const reqformatted = await req.json();
  const data = await getServerSession(options1);
  if (!data || !data.user)
    return NextResponse.json(
      { error: "You must be signed in to post" },
      { status: 401 }
    );

  const { title, content } = reqformatted;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: data.user.id,
    },
  });

  return NextResponse.json({ post: post }, { status: 201 });
};
