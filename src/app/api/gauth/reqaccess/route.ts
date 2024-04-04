import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { options1 } from "../../auth/[...nextauth]/options";

export const POST = async (req: Request) => {
  const jsonreq = await req.json();
  const { repoId } = jsonreq;
  const sess = await getServerSession(options1);
  const uid = sess?.user.id;

  if (sess && sess.user) {
    await prisma.repo.update({
      where: { id: repoId.toString() },
      data: {
        requesters: {
          connect: { id: uid },
        },
      },
    });
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
};
