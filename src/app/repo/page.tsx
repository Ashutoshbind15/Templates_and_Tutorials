import React from "react";
import prisma from "../lib/prisma";
import Repo from "../components/repos/Repo";

import { redirect } from "next/navigation";
import Button from "../components/UI/Button";

const RepoPage = async () => {
  const repos = await prisma.repo.findMany({
    include: {
      requesters: true,
      students: true,
    },
  });

  return (
    <div>
      <div>Repo</div>
      <div>
        {repos.map((repo: any) => (
          <div key={repo.id}>
            <Repo repo={repo} />
            <Button
              type="button"
              onClickf={() => redirect(`/repo/${repo?.id}`)}
            ></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepoPage;
