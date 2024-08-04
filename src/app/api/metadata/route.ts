import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();

    const { title, description, url, repoId, cost, tags } = data;

    const metadata = await prisma.repoMetadata.create({
      data: {
        title,
        description,
        thumbnail: url,
        repoId: repoId.toString(),
        cost: +cost,
        tags: tags,
      },
    });

    return NextResponse.json(metadata, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};
