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

    console.log(data);

    const access_token = data.split("&")[0].split("=")[1];
    const refresh_token = data.split("&")[2].split("=")[1];
    const refresh_token_expire = data.split("&")[3].split("=")[1];

    console.log("access_token", access_token);
    console.log("refresh_token", refresh_token);
    console.log("refresh_token_expire", refresh_token_expire);

    const GithubAccount = await prisma.account.findFirst({
      where: {
        userId: session?.user.id,
        provider: "github",
      },
    });

    console.log("GitHubAccountExist", GithubAccount);

    if (!session?.user.id || !GithubAccount) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const isAppInstalled = await prisma.account.findFirst({
      where: {
        userId: session?.user.id,
        provider: "github",
        gh_installation_ids: {
          isEmpty: false,
        },
      },
    });

    if (!isAppInstalled) {
      return NextResponse.json({ error: "App not installed" }, { status: 401 });
    }

    await prisma.account.update({
      where: {
        id: GithubAccount.id,
      },
      data: {
        gh_app_access_token: access_token,
        gh_app_refresh_token: refresh_token,
      },
    });
  }

  return NextResponse.redirect("http://localhost:3000/");
};
