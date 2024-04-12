import { getServerSession } from "next-auth";
import prisma from "../lib/prisma";
import { options1 } from "../api/auth/[...nextauth]/options";
import RepoCard from "../components/repos/RepoCard";
import StoreContainer from "../components/store/StoreContainer";
import { title } from "process";

const CodeStore = async () => {
  const sess = await getServerSession(options1);
  const repos = await prisma.repo.findMany({
    include: {
      buyers: {
        include: {
          order: {
            include: {
              payments: true,
            },
          },
        },
      },

      owner: true,
    },
  });

  const currUserId = sess?.user?.id;

  const currUserRepos = repos.filter((repo) => repo.ownerId === currUserId);

  const currUserBoughtRepos = repos.filter((repo) => {
    let bought = false;
    for (let repoBuyer of repo.buyers) {
      if (repoBuyer.userId === currUserId) {
        for (let payment of repoBuyer?.order?.payments as any) {
          if (payment.status === "captured") {
            bought = true;
            break;
          }
        }
      }
    }

    return bought;
  });

  const reposToBeBought = repos.filter((repo) => {
    let TobeBought = true;
    for (let repoBuyer of repo.buyers) {
      if (repoBuyer.userId === currUserId) {
        TobeBought = false;
        break;
      }
    }

    return (
      TobeBought &&
      repo.ownerId !== currUserId &&
      repo.owner.paymentGatewayAccountOnBoarded
    );
  });

  const ordersToBePaid = await prisma.order.findMany({
    include: {
      payments: true,
      buyer: true,
    },
    where: {
      buyer: {
        userId: currUserId,
      },
      payments: {
        every: {
          // 'every' applies the filter to all records in the related table
          NOT: {
            status: {
              equals: "captured",
            },
          },
        },
      },
    },
  });

  // console.log(repos, currUserBoughtRepos, currUserRepos, reposToBeBought);

  console.log("Current User Bought Repos", currUserBoughtRepos);
  console.log("Repos to be bought", reposToBeBought);
  console.log("Orders to be paid", ordersToBePaid);

  const cuserid = sess?.user?.id;
  const cuser = await prisma.user.findFirst({
    where: { id: cuserid },
  });

  console.log("Current User", cuser);

  const currUserOrders = await prisma.order.findMany({
    where: {
      buyerId: cuserid,
    },
    include: {
      buyer: true,
    },
  });

  return (
    <StoreContainer
      repos={repos.map((repo) => ({
        title: repo.title,
        cost: repo.cost,
        owner: { name: repo.owner.name },
        description: repo.description,
        id: repo.id,
      }))}
      currUserRepos={currUserRepos.map((repo) => ({
        title: repo.title,
        cost: repo.cost,
        owner: { name: repo.owner.name },
        description: repo.description,
        id: repo.id,
      }))}
      currUserBoughtRepos={currUserBoughtRepos.map((repo) => ({
        title: repo.title,
        cost: repo.cost,
        owner: { name: repo.owner.name },
        description: repo.description,
        id: repo.id,
      }))}
      reposToBeBought={reposToBeBought.map((repo) => ({
        title: repo.title,
        cost: repo.cost,
        owner: { name: repo.owner.name },
        description: repo.description,
        id: repo.id,
      }))}
      currUserHasOnboarded={cuser?.paymentGatewayAccountOnBoarded}
      orders={ordersToBePaid}
    />
  );
};

export default CodeStore;
