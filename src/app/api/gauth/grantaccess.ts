import { getServerSession } from "next-auth";
import { options1 } from "../auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import { App } from "octokit";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const jsonreq = await req.json();
  // const { uid }: { uid: string } = jsonreq;
  const user = "RandomUser";
  const sess = await getServerSession(options1);

  if (sess && sess.user) {
    const githubacc = await prisma.account.findFirst({
      where: {
        userId: sess.user.id,
        provider: "github",
      },
    });

    if (githubacc) {
      const installationId = githubacc.gh_installation_ids[0];

      const app = new App({
        appId: process.env.GITHUB_APP_ID as string,
        privateKey: process.env.GITHUB_APP_PRIVATE_KEY as string,
      });

      let octo;
      if (installationId?.length)
        octo = await app.getInstallationOctokit(+installationId);

      return NextResponse.json({ msg: "success", status: 200 });
    }
  }
};
