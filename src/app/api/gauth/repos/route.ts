import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { options1 } from "../../auth/[...nextauth]/options";
import { App } from "octokit";
import { log } from "console";

export const GET = async (req: Request) => {
  const sess = await getServerSession(options1);
  let res;

  if (sess && sess.user) {
    const githubacc = await prisma.account.findMany({
      where: {
        userId: sess.user.id,
        provider: "github",
      },
    });

    if (githubacc.length > 0) {
      const installationId = githubacc[0].installationIds[0];

      const app = new App({
        appId: process.env.GITHUB_APP_ID as string,
        privateKey: process.env.GITHUB_APP_PRIVATE_KEY as string,
      });

      let octo;
      if (installationId?.length)
        octo = await app.getInstallationOctokit(+installationId);

      if (installationId) {
        const res = await octo?.request("GET /installation/repositories");
        console.log(res?.data);
        log(res?.data);
        return NextResponse.json({ data: res?.data, status: 200 });
      } else {
        return NextResponse.json({ data: "scm", status: 200 });
      }
    }
    return NextResponse.json({ data: "scm", status: 200 });
  }
};
