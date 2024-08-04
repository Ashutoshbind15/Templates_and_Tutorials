import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options1 } from "../../auth/[...nextauth]/options";
import { hasAccess, isRepoOwner } from "@/app/lib/apihelpers";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const sess = await getServerSession(options1);

    if (!sess || !sess.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const uid = sess.user.id;

    const doesUserHaveAccess = hasAccess(id, uid);

    if (!doesUserHaveAccess) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const isOwner = await isRepoOwner(id, uid);

    if (metadata) {
      return NextResponse.json({ metadata, isOwner }, { status: 200 });
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
    const { title, description, cost, tags } = data;

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
          tags: tags,
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
          tags: tags,
        },
      });
      return NextResponse.json(metadata, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
