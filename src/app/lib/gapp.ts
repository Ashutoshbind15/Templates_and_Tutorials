import { App } from "octokit";

const prismaClientSingleton = async (installationid: string) => {
  const app = new App({
    appId: process.env.GITHUB_APP_ID as string,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY as string,
  });

  let octo;
  if (installationid.length > 0) {
    octo = await app.getInstallationOctokit(+installationid);
    return octo;
  }
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton("");

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
