"use client";
import axios from "axios";
import Button from "../UI/Button";
import { useSession } from "next-auth/react";
import { loadRazorpayScript } from "@/app/lib/loadrazorpay";
import { toast } from "sonner";

const Repo = ({ repo, isOwner, owner }: any) => {
  const sess = useSession();
  const uid = sess?.data?.user?.id;

  const accessgrantHandler = async (userId: string) => {
    toast.loading("Granting access", {
      duration: 100000,
      id: "granting",
    });
    const { data } = await axios.post("/api/gauth/grantaccess", {
      userId: userId,
      repoId: repo.id,
    });
    toast.dismiss("granting");
    console.log(data);
    toast.success("Access granted");
  };

  const buyHandler = async () => {
    toast.loading("Initiating payment", {
      duration: 100000,
      id: "initiating",
    });

    const { data } = await axios.post("/api/gauth/repos/orders", {
      userId: uid,
      repoId: repo.id,
    });

    toast.dismiss("initiating");

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

        toast.loading("Verifying payment", {
          duration: 100000,
          id: "verifying",
        });

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

        if (verifyData) {
          console.log("Payment success");
          if (verifyData.paymentStatus === "captured") {
            accessgrantHandler(uid as string);
          }
        }

        toast.dismiss("verifying");
        toast.success("Payment success");
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
      <h1>owner : {owner}</h1>
      <p>
        description: {repo?.description} <br />
      </p>

      <div>
        {isOwner && <button onClick={() => {}}>View Stats</button>}

        {!isOwner && (
          <Button onClickf={() => buyHandler()} type="button">
            {repo.hasBought ? "Bought" : "Buy"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Repo;
