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
    const curruserinstallationid = await prisma.user.findFirst({
      where: { id: session?.user.id },
      select: {
        accounts: {
          where: {
            provider: "github",
          },
          select: {
            installationIds: true,
          },
        },
      },
    });

    const curruserid = session?.user.id;
    const currUserRepos = await prisma.repo.findMany({
      where: {
        ownerId: curruserid,
      },
    });
    const installation_id =
      curruserinstallationid?.accounts[0].installationIds[0];
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
          return userRepo.id === repo.id;
        });
      });

      for (let newRepo of newRepos) {
        await prisma.repo.create({
          data: {
            id: newRepo.id.toString(),
            title: newRepo.name,
            ownerId: curruserid as string,
            url: newRepo.html_url,
          },
        });
      }
    }

    if (
      curruserinstallationid?.accounts[0].installationIds[0] === installation_id
    ) {
      return NextResponse.redirect("http://localhost:3000/");
    }

    await prisma.account.updateMany({
      where: {
        userId: session?.user.id,
        provider: "github",
      },
      data: {
        installationIds: [installation_id as string],
      },
    });
  }
  return NextResponse.redirect("http://localhost:3000/");
};
