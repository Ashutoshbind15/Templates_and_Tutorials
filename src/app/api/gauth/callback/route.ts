import prisma from "@/app/lib/prisma";
import axios from "axios";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { options1 } from "../../auth/[...nextauth]/options";

export const GET = async (req: Request) => {
  const url = new URL(req.url as string);
  const code = url.searchParams.get("code");
  const session = await getServerSession(options1);

  if (code?.length) {
    const { data } = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        },
      }
    );

    const access_token = data.split("&")[0].split("=")[1];
    const refresh_token = data.split("&")[2].split("=")[1];
    const refresh_token_expire = data.split("&")[3].split("=")[1];

    await prisma.user.update({
      where: {
        id: session?.user.id,
      },
      include: {
        accounts: true,
      },
      data: {
        accounts: {
          updateMany: {
            where: {
              provider: "github",
            },
            data: {
              access_token: access_token,
              type: "github-app-auth",
              refresh_token: refresh_token,
              expires_at: +refresh_token_expire,
              scope: null,
            },
          },
        },
      },
    });
  }

  return NextResponse.redirect("http://localhost:3000/");
};
