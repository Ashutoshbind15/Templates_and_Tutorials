import { getServerSession } from "next-auth/next";
import { options1 } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "../lib/prisma";
import { App } from "octokit";
import { Button } from "../components/uilib/ui/button";
import RepoMetadata from "../components/forms/RepoMetadata";
import RepoPreview from "../components/repos/RepoPreview";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../components/uilib/ui/dialog";

const AddRepoPage = async () => {
  const session = await getServerSession(options1);

  if (!session || !session.user) {
    return redirect("/api/auth/signin");
  }

  if (session.user.role !== "CREATOR") {
    throw new Error("Change your role to creator to add a repo");
  }

  const dbuserAcc = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      provider: "github",
    },
  });

  const isInstalled = dbuserAcc?.gh_installation_ids?.length;

  const dbUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const isConnectedPayments = dbUser?.paymentGatewayAccountOnBoarded;

  const repos = await prisma.repo.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
      metadata: true,
    },
  });

  return (
    <div className="pt-20">
      <div className="flex flex-col items-center max-h-screen overflow-y-auto">
        {repos &&
          (repos?.length ? (
            <div className="w-1/2 p-8 mb-6 border-white border-2">
              {repos?.map((repo) => (
                <div
                  key={repo.id}
                  className="border-2 rounded-md border-gray-300 py-4 px-2 mb-2 flex items-center justify-between w-full"
                >
                  <div>{repo.title}</div>
                  <div className="flex items-center gap-x-3">
                    <RepoMetadata
                      data={repo?.metadata}
                      isMetadata={repo?.metadata ? true : false}
                      repoId={repo.id}
                    />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Preview</Button>
                      </DialogTrigger>
                      <DialogContent className="text-black p-6">
                        {repo.metadata && <RepoPreview repo={repo?.metadata} />}
                      </DialogContent>
                    </Dialog>
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
    </div>
  );
};

export default AddRepoPage;
