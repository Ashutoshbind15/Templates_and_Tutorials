"use client";
import axios from "axios";
import Button from "../UI/Button";
import { useSession } from "next-auth/react";
import { loadRazorpayScript } from "@/app/lib/loadrazorpay";
import { Avatar, AvatarFallback, AvatarImage } from "../uilib/ui/avatar";

const Repo = ({ repo, hasConnectedPayments, isOwner }: any) => {
  console.log(hasConnectedPayments, isOwner);

  const sess = useSession();
  const uid = sess?.data?.user?.id;

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

  const buyHandler = async () => {
    const { data } = await axios.post("/api/gauth/repos/orders", {
      userId: uid,
      repoId: repo.id,
    });

    const scriptSrc = "https://checkout.razorpay.com/v1/checkout.js";
    await loadRazorpayScript(scriptSrc);

    const order = data.order;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use the public key here
      amount: +order.amount,
      currency: order.currency,
      name: "Your Company Name",
      description: "Test Transaction",
      order_id: order.id,
      handler: async function (response: any) {
        // Handle payment success, send details to server for verification
        console.log(response);

        const verifyResponse = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: order.id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }),
        });

        const verifyData = await verifyResponse.json().then((data) => data);
        console.log(verifyData);

        if (verifyData) {
          console.log("Payment success");
          if (verifyData.paymentStatus === "captured") {
            accessgrantHandler(uid as string);
          }
        }
      },
      prefill: {
        name: "Test Namse",
        email: "test1@example.com",
        contact: "9999992999",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="my-2 border-b-2 border-white" key={repo?.id}>
      <h1>repo : {repo.title}</h1>
      <h1>owner : {JSON.stringify(repo?.owner?.name)}</h1>
      <p>
        description: {repo?.description} <br />
      </p>

      <div>
        {isOwner &&
          (hasConnectedPayments ? (
            <button onClick={() => {}}>View Stats</button>
          ) : (
            <button onClick={() => {}}>Connect To The Payment Gateway</button>
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
