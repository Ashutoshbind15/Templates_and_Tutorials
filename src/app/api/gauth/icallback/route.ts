import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { options1 } from "../../auth/[...nextauth]/options";
import { App } from "octokit";

export const GET = async (req: Request) => {
  const url = new URL(req.url as string);
  console.log(url);
  const installation_id = url.searchParams.get("installation_id");
  const session = await getServerSession(options1);

  if (installation_id?.length) {
    const curruserinstallationid = await prisma.account.findFirst({
      where: { id: session?.user.id, provider: "github" },
      select: {
        gh_installation_ids: true,
      },
    });

    const curruserid = session?.user.id;
    const currUserRepos = await prisma.repo.findMany({
      where: {
        ownerId: curruserid,
      },
    });

    const hasInstallation = curruserinstallationid?.gh_installation_ids.length;

    if (!curruserid) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (!hasInstallation) {
      await prisma.account.updateMany({
        where: {
          userId: session?.user.id,
          provider: "github",
        },
        data: {
          gh_installation_ids: [installation_id],
        },
      });
    }

    const app = new App({
      appId: process.env.GITHUB_APP_ID as string,
      privateKey: process.env.GITHUB_APP_PRIVATE_KEY as string,
    });
    let octo;
    if (installation_id?.length)
      octo = await app.getInstallationOctokit(+installation_id);

    if (octo) {
      const res = await octo?.request("GET /installation/repositories");
      const repos = res.data.repositories;

      const newRepos = repos.filter((repo: any) => {
        return !currUserRepos.some((userRepo) => {
          return userRepo.id.toString() === repo.id.toString();
        });
      });

      const oldRepos = repos.filter((repo: any) => {
        return currUserRepos.some((userRepo) => {
          return userRepo.id.toString() === repo.id.toString();
        });
      });

      console.log(`New Repos: `, newRepos);

      for (let newRepo of newRepos) {
        console.log(newRepo.owner.login, newRepo.name, newRepo.html_url);
        await prisma.repo.create({
          data: {
            id: newRepo.id.toString(),
            title: newRepo.name,
            ownerId: curruserid as string,
            url: newRepo.html_url,
            repoOrg: newRepo.owner.login,
          },
        });
      }

      // delete the old repos that are not in the new repos

      for (let oldRepo of oldRepos) {
        console.log(oldRepo.owner.login, oldRepo.name, oldRepo.html_url);
        await prisma.repo.delete({
          where: {
            id: oldRepo.id.toString(),
          },
        });
      }
    }
  }
  return NextResponse.redirect(process.env.URL as string);
};
