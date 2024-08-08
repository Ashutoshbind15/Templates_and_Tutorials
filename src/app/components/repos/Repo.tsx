"use client";
import axios from "axios";
import Button from "../UI/Button";
import { useSession } from "next-auth/react";
import { loadRazorpayScript } from "@/app/lib/loadrazorpay";
import { toast } from "sonner";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../uilib/ui/avatar";
import { redirect, useRouter } from "next/navigation";

const Repo = ({ repo, isOwner, owner, avatar }: any) => {
  const sess = useSession();
  const uid = sess?.data?.user?.id;
  const rtr = useRouter();

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
    <div className="w-1/3 px-3" key={repo?.id}>
      <div className="w-full border-4 border-white rounded-xl py-6 px-2 flex flex-col items-center">
        <div className="mb-3 flex justify-between items-center px-3 w-full">
          <h1 className="text-xl font-mono font-semibold ">{repo.title}</h1>
          <div className="text-sm font-sans">{repo.cost / 100} $</div>
        </div>

        <Image
          src={repo?.thumbnail}
          alt={repo?.title}
          width={300}
          height={300}
          className="mb-6"
        />

        <div className="mb-4 text-center">
          <div className="flex items-center justify-between gap-x-3 my-4">
            <span>{owner}</span>
            <Avatar>
              <AvatarImage src={avatar} />
              <AvatarFallback>{owner[0]} </AvatarFallback>
            </Avatar>
          </div>
          <p className="font-sans text-center">
            {repo?.description} <br />
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center">
          {repo.tags.map((tag: string) => (
            <span
              key={tag}
              className="bg-white text-gray-950 font-semibold rounded-lg text-md font-sans mr-2 py-1 px-4"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="w-full flex justify-center gap-x-3 items-center">
          {isOwner && (
            <Button
              onClickf={() => {
                console.log("Edit and stats");
                rtr.push(`/repo/${repo.id}`);
              }}
              type="button"
              className="w-3/4"
            >
              Edit and stats
            </Button>
          )}

          {!isOwner && (
            <Button
              onClickf={() => {
                if (!repo.hasBought) buyHandler();
                else {
                  rtr.push(`/repo/${repo.id}`);
                }
              }}
              type="button"
              className="w-3/4"
            >
              {repo.hasBought ? "View" : "Buy"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Repo;
