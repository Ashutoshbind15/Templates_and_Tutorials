import SignInC from "./components/auth/SignInC";
import SignOut from "./components/auth/SingOut";
import PostForm from "./components/forms/Post";
import prisma from "./lib/prisma";
import Post from "./components/posts/Post";
import Repo from "./components/repos/Repo";
import { getServerSession } from "next-auth";
import { options1 } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const posts = await prisma.post.findMany({});
  const repos = await prisma.repo.findMany({
    include: {
      owner: true,
      requesters: true,
    },
  });

  const sess = await getServerSession(options1);
  const uid = sess?.user?.id;

  const populatedRepos = repos.map((repo) => {
    const repoOwnerId = repo.ownerId;
    const repoOwner = repo.owner;
    const hasConnected = repoOwner?.paymentGatewayAccountOnBoarded
      ? true
      : false;
    const isOwner = repoOwnerId === uid;

    // for each repo, we display the repo if it has a product and the owner has a stripe account
    // if not, we display the owner the option to connect stripe
    // if the owner has a stripe account, we display the option to create a product

    return {
      ...repo,
      hasConnectedPayments: hasConnected,
      isOwner: isOwner,
    };
  });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>Repos</div>

        <div className="p-2 border-2 border-white">
          {populatedRepos.map((repo: any) => {
            return (
              <Repo
                repo={repo}
                key={repo.id}
                hasConnectedPayments={repo.hasConnectedPayments}
                isOwner={repo.isOwner}
              />
            );
          })}
        </div>

        <PostForm />
        <SignInC />
        <SignOut />
      </main>
    </>
  );
}
