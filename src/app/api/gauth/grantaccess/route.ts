import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { App, Octokit } from "octokit";
import { NextResponse } from "next/server";
import { options1 } from "../../auth/[...nextauth]/options";
import { getUserDetailsFromUserId } from "@/app/lib/githubapi";

export const POST = async (req: Request) => {
  const jsonreq = await req.json();
  const { repoId, userId: user } = jsonreq;
  const sess = await getServerSession(options1);

  if (sess && sess.user) {
    const repo = await prisma.repo.findFirst({
      where: {
        id: repoId,
      },
    });

    const repoOwnerId = repo?.ownerId;

    const githubacc = await prisma.account.findFirst({
      where: {
        userId: repoOwnerId,
        provider: "github",
      },
    });

    const installation_id = githubacc?.gh_installation_ids[0];

    if (!installation_id)
      return NextResponse.json({ msg: "Unauthorised", status: 401 });

    if (!githubacc)
      return NextResponse.json({ msg: "Unauthorised", status: 401 });

    if (githubacc) {
      const app = new App({
        appId: process.env.GITHUB_APP_ID as string,
        privateKey: process.env.GITHUB_APP_PRIVATE_KEY as string,
      });

      const repoName = repo?.title;
      const repoOrg = repo?.repoOrg;

      const requester = await getUserDetailsFromUserId(
        sess?.user?.id as string
      );
      const username = requester?.data.login;
      const octokit = await app.getInstallationOctokit(+installation_id);

      if (installation_id) {
        const res = await octokit?.request(
          "PUT /repos/{owner}/{repo}/collaborators/{username}",
          {
            owner: repoOrg as string,
            repo: repoName as string,
            username: username,
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
