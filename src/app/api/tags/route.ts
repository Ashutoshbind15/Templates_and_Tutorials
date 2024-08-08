import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  // find out all the unique tags from the repometadata.tags column

  const tags = await prisma.repoMetadata.findMany({
    select: {
      tags: true,
    },
  });

  const uniqueTags = new Set<string>();

  tags.forEach((tag) => {
    tag.tags.forEach((t) => {
      uniqueTags.add(t);
    });
  });

  return NextResponse.json(Array.from(uniqueTags), { status: 200 });
};
