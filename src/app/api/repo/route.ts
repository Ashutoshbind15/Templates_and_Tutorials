import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options1 } from "../auth/[...nextauth]/options";

export const POST = async (req: NextRequest) => {
  const sess = await getServerSession(options1);
  const jsonrq = await req.json();
  if (!sess)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { description, cost } = jsonrq;

  console.log(description, cost, jsonrq.repoId);

  const repo = await prisma.repo.update({
    where: { id: jsonrq.repoId },
    data: { description: description, cost: parseInt(cost) },
  });

  return NextResponse.json(repo, { status: 200 });
};
