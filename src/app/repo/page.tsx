import React from "react";
import prisma from "../lib/prisma";
import Repo from "../components/repos/Repo";
import RedirectButton from "../components/UI/Buttons/Redirect";
import { getServerSession } from "next-auth";
import { options1 } from "../api/auth/[...nextauth]/options";
import RepoPaginator from "../components/repos/RepoPaginator";
import SearchAndFilter from "../components/repos/SearchAndFilter";
import { title } from "process";

const RepoPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const pageNumber = searchParams.page
    ? parseInt(searchParams.page as string)
    : 1;

  const pageTags = searchParams.tags
    ? (searchParams.tags as string).split(",")
    : [];
  const repoQuery = searchParams.q ? searchParams.q : "";

  const take = 2;
  const skip = (pageNumber - 1) * take;

  const repos = await prisma.repo.findMany({
    where: {
      NOT: [
        {
          metadata: null,
        },
        {
          owner: {
            paymentGatewayAccountOnBoarded: false,
          },
        },
      ],
      metadata: {
        tags: {
          hasEvery: pageTags,
        },
      },
      OR: [
        {
          metadata: {
            title: {
              contains: repoQuery as string,
            },
          },
        },
        {
          metadata: {
            description: {
              contains: repoQuery as string,
            },
          },
        },
        {
          owner: {
            name: {
              contains: repoQuery as string,
            },
          },
        },
      ],
    },

    include: {
      owner: true,
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

    take: take,
    skip: skip,
  });

  console.log("repolength", repos.length);

  const totalReposWithMetadata = await prisma.repo.count({
    where: {
      NOT: [
        {
          metadata: null,
        },
        {
          owner: {
            paymentGatewayAccountOnBoarded: false,
          },
        },
      ],
      metadata: {
        tags: {
          hasEvery: pageTags,
        },
      },
      OR: [
        {
          metadata: {
            title: {
              contains: repoQuery as string,
            },
          },
        },
        {
          metadata: {
            description: {
              contains: repoQuery as string,
            },
          },
        },
        {
          owner: {
            name: {
              contains: repoQuery as string,
            },
          },
        },
      ],
    },
  });

  const totalPages = Math.ceil(totalReposWithMetadata / take);

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
        avatar: repoOwner?.image,
      },
      hasMetadata: metadata ? true : false,
      id: repo.id,
      hasBought: hasBought ? true : false,
    };
  });

  return (
    <div className="p-12">
      <SearchAndFilter pageNum={pageNumber.toString()} />
      <div className="flex flex-wrap gap-y-3 items-center mb-8">
        {populatedRepos.map((repo: any) => {
          return (
            <Repo
              repo={repo}
              key={repo.id}
              hasConnectedPayments={repo.hasConnectedPayments}
              isOwner={repo.isOwner}
              owner={repo.owner?.name}
              avatar={repo.owner?.avatar}
              hasBought={repo.hasBought}
            />
          );
        })}
      </div>
      <RepoPaginator totalPages={totalPages} currentPage={pageNumber} />
    </div>
  );
};

export default RepoPage;
