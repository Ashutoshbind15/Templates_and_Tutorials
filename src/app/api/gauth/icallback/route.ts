import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { options1 } from "../../auth/[...nextauth]/options";

export const GET = async (req: Request) => {
  const url = new URL(req.url as string);
  console.log(url);

  const installation_id = url.searchParams.get("installation_id");
  const session = await getServerSession(options1);

  if (installation_id?.length) {
    const curruserinstallationid = await prisma.user.findFirst({
      where: { id: session?.user.id },
      select: {
        accounts: {
          where: {
            provider: "github",
          },
          select: {
            installationId: true,
          },
        },
      },
    });

    if (
      curruserinstallationid?.accounts[0].installationId === installation_id
    ) {
      return NextResponse.redirect("http://localhost:3000/");
    }

    await prisma.account.updateMany({
      where: {
        userId: session?.user.id,
        provider: "github",
      },
      data: {
        installationId: installation_id,
      },
    });
  }
  return NextResponse.redirect("http://localhost:3000/");
};
