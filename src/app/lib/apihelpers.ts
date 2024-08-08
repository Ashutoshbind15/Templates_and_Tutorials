import prisma from "./prisma";

export const hasAccess = async (repoId: string, userId: string) => {
  console.log("RepoId: ", repoId);
  console.log("UserId: ", userId);

  const repo = await prisma.repo.findUnique({
    where: {
      id: repoId,
    },
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
    },
  });

  if (!repo) {
    return false;
  }

  if (repo.ownerId === userId) {
    return true;
  }

  const hasPaid = repo.buyers.some((buyer) => {
    if (buyer.userId !== userId) {
      return false;
    }
    return buyer.order?.payments.some(
      (payment) => payment.status === "captured"
    );
  });

  return hasPaid;
};

export const isRepoOwner = async (repoId: string, userId: string) => {
  const repo = await prisma.repo.findUnique({
    where: {
      id: repoId,
    },
  });

  if (!repo) {
    return false;
  }

  if (repo.ownerId === userId) {
    return true;
  }

  return false;
};

export const isBuyer = async (repoId: string, userId: string) => {
  const repo = await prisma.repo.findUnique({
    where: {
      id: repoId,
    },
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
    },
  });

  if (!repo) {
    return false;
  }

  const hasPaid = repo.buyers.some((buyer) => {
    if (buyer.userId !== userId) {
      return false;
    }
    return buyer.order?.payments.some(
      (payment) => payment.status === "captured"
    );
  });

  return hasPaid;
};

export const userOrders = async (userId: string) => {
  const buyers = await prisma.buyer.findMany({
    where: {
      userId: userId,
    },
    include: {
      order: {
        include: {
          payments: true,
        },
      },
      repo: {
        include: {
          metadata: true,
        },
      },
    },
  });

  return buyers.map((buyer) => {
    return {
      orderId: buyer.orderId,
      repoId: buyer.repoId,
      payments: buyer.order?.payments.map((payment) => ({
        status: payment.status,
        paymentId: payment.paymentId,
        paidAt: payment.createdAt,
        amount: payment.amount / 100,
        id: payment.paymentId,
      })),
      repo: {
        id: buyer.repo.metadata?.id,
        title: buyer.repo.metadata?.title,
        description: buyer.repo.metadata?.description,
        image: buyer.repo.metadata?.thumbnail,
      },
    };
  });
};
