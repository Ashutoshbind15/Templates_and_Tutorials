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
      include: {
        repo: {
          include: {
            owner: {
              select: {
                email: true,
                name: true,
                image: true,
              },
            },
          },
        },
        sections: true,
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
    const { title, description, cost } = data;

    if (data.url) {
      const metadata = await prisma.repoMetadata.update({
        where: {
          repoId: params.id,
        },
        data: {
          title,
          description,
          cost: +cost,
          thumbnail: data.url,
        },
      });
      return NextResponse.json(metadata, { status: 200 });
    } else {
      const metadata = await prisma.repoMetadata.update({
        where: {
          repoId: params.id,
        },
        data: {
          title,
          description,
          cost: +cost,
        },
      });
      return NextResponse.json(metadata, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
