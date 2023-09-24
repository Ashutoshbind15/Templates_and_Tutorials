import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { App } from "octokit";
import { NextResponse } from "next/server";
import { options1 } from "../../auth/[...nextauth]/options";

export const POST = async (req: Request) => {
  const jsonreq = await req.json();
  // const { uid }: { uid: string } = jsonreq;
  const user = "user1";
  const sess = await getServerSession(options1);

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
        const res = await octo?.request(
          "PUT /repos/{owner}/{repo}/collaborators/{username}",
          {
            owner: "repoowner",
            repo: "reponame",
            username: user,
            permission: "triage",
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        console.log(res);
        return NextResponse.json({ msg: "success", status: 200 });
      } else {
        console.log("err");
        return NextResponse.json({ msg: "danger", status: 404 });
      }
    }
  }
};
