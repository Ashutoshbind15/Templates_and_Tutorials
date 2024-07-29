import { getServerSession } from "next-auth/next";
import { options1 } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "../lib/prisma";
import { App } from "octokit";
import { Button } from "../components/uilib/ui/button";
import RepoMetadata from "../components/forms/RepoMetadata";

const AddRepoPage = async () => {
  const session = await getServerSession(options1);

  if (!session || !session.user) {
    return redirect("/api/auth/signin");
  }

  if (session.user.role !== "CREATOR") {
    throw new Error("Change your role to creator to add a repo");
  }

  const isInstalled = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      provider: "github",
    },
    select: {
      gh_installation_ids: true,
    },
  });

  const installationId =
    isInstalled?.gh_installation_ids?.length &&
    isInstalled?.gh_installation_ids[0];

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  const isConnectedPayments = user?.paymentGatewayAccountOnBoarded;

  let repos;

  if (installationId) {
    const app = new App({
      appId: process.env.GITHUB_APP_ID as string,
      privateKey: process.env.GITHUB_APP_PRIVATE_KEY as string,
    });

    let octo = await app.getInstallationOctokit(+installationId);

    if (installationId) {
      const res = await octo?.request("GET /installation/repositories");
      repos = res?.data;
    }
  }

  return (
    <div className="flex flex-col items-center">
      {repos &&
        (repos.repositories.length ? (
          <div className="w-3/4 rounded-md border-2 border-gray-300 p-3 mb-6">
            {repos?.repositories?.map((repo) => (
              <div
                key={repo.id}
                className="border-y-2 border-gray-300 py-4 px-2 mb-2 flex items-center justify-between"
              >
                <div>{repo.name}</div>
                <div>
                  <RepoMetadata repoId={repo.id} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          "No repos"
        ))}

      <Link
        href={`https://github.com/apps/tutsandtemps/installations/new`}
        className="mb-4"
      >
        {!isInstalled && <Button>Add our app as an installation</Button>}
        {!!isInstalled && <Button>Edit the app installation</Button>}
      </Link>

      {!isConnectedPayments && (
        <Link href={"/profile/gatewayonboarding"}>
          <Button>
            Connect Payments for your repos to be publically visible
          </Button>
        </Link>
      )}
    </div>
  );
};

export default AddRepoPage;
