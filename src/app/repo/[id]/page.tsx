import prisma from "@/app/lib/prisma";
import React from "react";

const RepoPage = async ({ params }: { params: { id: string } }) => {
  const repo = await prisma.repo.findUnique({
    where: {
      id: params.id,
    },
  });
  return <div>{JSON.stringify(repo)}</div>;
};

export default RepoPage;
