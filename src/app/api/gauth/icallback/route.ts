import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { options1 } from "../../auth/[...nextauth]/options";
import { App } from "octokit";

export const GET = async (req: Request) => {
  const url = new URL(req.url as string);
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
    if (!curruserid) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const hasInstallation = curruserinstallationid?.gh_installation_ids.length;

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

      // Fetch current user's repositories from database
      const currUserRepos = await prisma.repo.findMany({
        where: {
          ownerId: session.user.id,
        },
      });

      // Filter new repositories
      const newRepos = repos.filter((repo: any) => {
        return !currUserRepos.some((userRepo) => {
          return userRepo.id.toString() === repo.id.toString();
        });
      });

      // Filter removed repositories
      const removedRepos = currUserRepos.filter((userRepo) => {
        return !repos.some((repo: any) => {
          return userRepo.id.toString() === repo.id.toString();
        });
      });

      // Create new repositories in the database
      for (let newRepo of newRepos) {
        await prisma.repo.create({
          data: {
            id: newRepo.id.toString(),
            title: newRepo.name,
            ownerId: session.user.id,
            url: newRepo.html_url,
            repoOrg: newRepo.owner.login,
          },
        });
      }

      // Delete removed repositories from the database
      for (let removedRepo of removedRepos) {
        await prisma.repo.delete({
          where: {
            id: removedRepo.id,
          },
        });
      }
    }
  }
  return NextResponse.redirect((process.env.URL as string) + "/profile");
};
