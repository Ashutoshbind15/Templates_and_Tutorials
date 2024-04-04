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
    const owner = sess?.user.id;

    const githubacc = await prisma.account.findFirst({
      where: {
        userId: owner,
        provider: "github",
      },
    });

    if (!githubacc)
      return NextResponse.json({ msg: "Unauthorised", status: 401 });

    if (githubacc) {
      const gh_app_access_token = githubacc.gh_app_access_token;

      const octokit = new Octokit({
        auth: gh_app_access_token,
      });

      const repo = await prisma.repo.findFirst({
        where: {
          id: repoId,
        },
      });

      const repoName = repo?.title;
      const repoOrg = repo?.repoOrg;

      const requester = await getUserDetailsFromUserId(user);
      const username = requester?.data.login;

      if (gh_app_access_token) {
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
