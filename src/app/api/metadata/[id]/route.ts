import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    const metadata = await prisma.repoMetadata.findUnique({
      where: {
        repoId: id,
      },
    });

    if (metadata) {
      return NextResponse.json(metadata, { status: 200 });
    } else {
      return NextResponse.json({ error: "No metadata found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const data = await req.json();

    const { title, description, url } = data;

    const metadata = await prisma.repoMetadata.update({
      where: {
        repoId: params.id,
      },
      data: {
        title,
        description,
        thumbnail: url,
      },
    });

    return NextResponse.json(metadata, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
