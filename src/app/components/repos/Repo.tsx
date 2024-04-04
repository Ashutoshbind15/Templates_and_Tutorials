"use client";
import axios from "axios";

const Repo = ({ repo, hasStripeProduct, hasConnectedStripe, isOwner }: any) => {
  console.log(hasConnectedStripe, hasStripeProduct, isOwner);

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
            <button onClick={() => accessgrantHandler(req.id)}>
              Grant Access
            </button>
          </div>
        ))}

        {hasStripeProduct && (
          <div>
            <h1>Stripe Product</h1>
            <p>product id: {repo?.stripeProduct?.id}</p>
            <p>product name: {repo?.stripeProduct?.name}</p>
            <p>product price: {repo?.stripeProduct?.price}</p>
            <p>product currency: {repo?.stripeProduct?.currency}</p>
          </div>
        )}

        {!hasStripeProduct &&
          isOwner &&
          (hasConnectedStripe ? (
            <form></form>
          ) : (
            <button onClick={stripeConnectionHandler}>Connect Stripe</button>
          ))}
      </div>
    </div>
  );
};

export default Repo;
