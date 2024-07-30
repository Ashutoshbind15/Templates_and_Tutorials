import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();

    const { title, description, url, repoId } = data;

    const sec = await prisma.section.create({
      data: {
        title,
        description,
        url,
        repoId,
      },
    });

    return NextResponse.json(sec, {
      status: 201,
    });
  } catch (e) {
    return NextResponse.json(
      {
        msg: "Error creating section",
      },
      {
        status: 500,
      }
    );
  }
};
