import prisma from "@/app/lib/prisma";
import { options1 } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const sess = await getServerSession(options1);
  const jsonrq = await req.json();
  if (!sess)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const changed = jsonrq.role;

  await prisma.user.update({
    where: { id: sess.user.id },
    data: { role: changed },
  });
  return NextResponse.json({ error: "Done" }, { status: 200 });
};
