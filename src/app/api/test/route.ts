import { hasAccess } from "@/app/lib/apihelpers";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { repoId, uid } = data;
    const hasAccessToRepo = await hasAccess(repoId, uid);
    console.log(hasAccessToRepo);

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};
