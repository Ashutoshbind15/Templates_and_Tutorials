"use client";

import axios from "axios";

const Repo = ({ repo }: any) => {
  const accessgrantHandler = async () => {
    const { data } = await axios.post("/api/gauth/grantaccess", {});
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
      <h1>repo : {repo.name}</h1>
      <h1>owner : {JSON.stringify(repo.owner.login)}</h1>
      <p>
        description: {repo.description} <br />
      </p>
      <button onClick={accessgetHandler} className="bg-white text-black">
        Req Access
      </button>
      <button onClick={accessgrantHandler} className="bg-white text-black">
        Give Access
      </button>
    </div>
  );
};

export default Repo;
