import { Octokit } from "octokit";
import prisma from "./prisma";

export const getUserDetailsFromUserId = async (UserId: string) => {
  const user = await prisma.account.findFirst({
    where: {
      userId: UserId,
      provider: "github",
    },
  });

  const access_token = user?.access_token;

  const octokit = new Octokit({
    auth: access_token,
  });

  const userCreds = await octokit?.request("GET /user");

  console.log(userCreds);

  return userCreds;
};
