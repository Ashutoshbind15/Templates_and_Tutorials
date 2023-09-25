"use client";

import prisma from "@/app/lib/prisma";
import axios from "axios";

const Repo = ({ repo, ownerName }: any) => {
  const accessgrantHandler = async (userId: string) => {
    const ownerGitHubIds = await prisma.account.findMany({
      where: {
        userId: userId,
        provider: "github",
      },
    });

    const ownerGitHubId = ownerGitHubIds[0].providerAccountId;

    const { data: gitHubUser } = await axios.get(
      `https://api.github.com/user/${ownerGitHubId}`
    );

    const { data } = await axios.post("/api/gauth/grantaccess", {
      userId: userId,
      repoId: repo.title,
      ownerId: gitHubUser?.login,
    });
    console.log(data);
  };
  const accessgetHandler = async () => {
    const { data } = await axios.post("/api/gauth/reqaccess", {
      repoId: repo.id,
    });
    console.log(data);
  };

  return (
    <div className="my-2 border-b-2 border-white" key={repo?.id}>
      <h1>repo : {repo.title}</h1>
      <h1>owner : {JSON.stringify(repo.owner.name)}</h1>
      <p>
        description: {repo.description} <br />
      </p>
      <button onClick={accessgetHandler} className="bg-white text-black">
        Req Access
      </button>
      <button
        onClick={() => accessgrantHandler("")}
        className="bg-white text-black"
      >
        Give Access
      </button>
    </div>
  );
};

export default Repo;
