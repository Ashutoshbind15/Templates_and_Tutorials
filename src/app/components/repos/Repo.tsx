"use client";
import axios from "axios";
import Button from "../UI/Button";

const Repo = ({ repo, hasConnectedPayments, isOwner }: any) => {
  console.log(hasConnectedPayments, isOwner);

  const accessgrantHandler = async (userId: string) => {
    const { data } = await axios.post("/api/gauth/grantaccess", {
      userId: userId,
      repoId: repo.id,
    });
    console.log(data);
  };

  const accessgetHandler = async () => {
    const { data } = await axios.post("/api/gauth/reqaccess", {
      repoId: repo.id,
    });
    console.log(data);
  };

  const stripeConnectionHandler = async () => {
    const { data } = await axios.post("/api/stripe/connect");
    console.log(data);
    window.location.replace(data);
  };

  const buyHandler = () => {};

  return (
    <div className="my-2 border-b-2 border-white" key={repo?.id}>
      <h1>repo : {repo.title}</h1>
      <h1>owner : {JSON.stringify(repo?.owner?.name)}</h1>
      <p>
        description: {repo?.description} <br />
      </p>
      <button onClick={accessgetHandler} className="bg-white text-black">
        Req Access
      </button>

      <div>
        <h1>Requesters</h1>
        {repo?.requesters?.map((req: any) => (
          <div key={req.id}>
            <p>{req.name}</p>
            {isOwner &&
              (hasConnectedPayments ? (
                <button onClick={() => accessgrantHandler(req.id)}>
                  Grant Access
                </button>
              ) : (
                <button onClick={() => {}}>
                  Connect To The Payment Gateway
                </button>
              ))}
          </div>
        ))}

        {!isOwner && (
          <Button onClickf={() => buyHandler()} type="button">
            Buy now
          </Button>
        )}
      </div>
    </div>
  );
};

export default Repo;
