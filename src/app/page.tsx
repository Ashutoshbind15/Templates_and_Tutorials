import SignInC from "./components/auth/SignInC";
import SignOut from "./components/auth/SingOut";
import prisma from "./lib/prisma";
import Repo from "./components/repos/Repo";
import { getServerSession } from "next-auth";
import { options1 } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const repos = await prisma.repo.findMany({
    include: {
      owner: true,
      requesters: true,
      metadata: true,
      buyers: {
        include: {
          order: {
            include: {
              payments: true,
            },
          },
        },
      },
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

    const metadata = repo.metadata;

    const hasBought = repo.buyers.find((buyer) => {
      const order = buyer.order;
      const payments = order?.payments;
      if (!payments) return false;
      if (!payments.length) return false;

      const hasAPaymentSucceeded = payments.some((payment) => {
        return payment.status === "captured";
      });

      return hasAPaymentSucceeded;
    });

    return {
      ...metadata,
      hasConnectedPayments: hasConnected,
      isOwner: isOwner,
      owner: {
        name: repoOwner?.name,
        email: repoOwner?.email,
      },
      hasMetadata: metadata ? true : false,
      id: repo.id,
      hasBought: hasBought ? true : false,
    };
  });

  return (
    <>
      <main className="p-24 bg-zinc-950 text-white">
        <div className="flex flex-wrap gap-y-3 items-center">
          {populatedRepos.map((repo: any) => {
            if (repo.hasMetadata === false || !repo.hasConnectedPayments)
              return null;
            return (
              <Repo
                repo={repo}
                key={repo.id}
                hasConnectedPayments={repo.hasConnectedPayments}
                isOwner={repo.isOwner}
                owner={repo.owner?.name}
                hasBought={repo.hasBought}
              />
            );
          })}
        </div>
      </main>
    </>
  );
}
