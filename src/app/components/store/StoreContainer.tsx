"use client";

import React, { useState } from "react";
import RepoCard from "../repos/RepoCard";
import Link from "next/link";
import { loadRazorpayScript } from "@/app/lib/loadrazorpay";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../uilib/ui/tabs";
import { Button } from "../uilib/ui/button";

const StoreContainer = ({
  repos,
  orders,
  reposToBeBought,
  currUserRepos,
  currUserBoughtRepos,
  currUserHasOnboarded,
}: any) => {
  const [cval, setCval] = useState("Mkt");
  const sessData = useSession();
  const [ctab, setCtab] = useState("buy");

  const accessgrantHandler = async (userId: string, repoId: string) => {
    const { data } = await axios.post("/api/gauth/grantaccess", {
      userId: userId,
      repoId,
    });
    console.log(data);
  };

  const orderCreationHandler = async (repoId: string) => {
    const { data } = await axios.post("/api/gauth/repos/orders", {
      userId: sessData?.data?.user.id,
      repoId,
    });

    toast("Order created");
    setCtab("orders");
  };

  const paymentHandler = async (order: any, repoId: string) => {
    const scriptSrc = "https://checkout.razorpay.com/v1/checkout.js";
    await loadRazorpayScript(scriptSrc);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use the public key here
      amount: order.amount.toString() as string,
      currency: order.currency as string,
      name: "Company xyz",
      description: "Test Transaction",
      order_id: order.orderId as string,
      handler: async function (response: any) {
        // Handle payment success, send details to server for verification
        console.log(response);

        const verifyResponse = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: order.orderId,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }),
        });

        const verifyData = await verifyResponse.json().then((data) => data);
        console.log(verifyData);

        if (verifyData) {
          console.log("Payment success");
          if (verifyData.paymentStatus === "captured") {
            accessgrantHandler(sessData?.data?.user?.id as string, repoId);
          }
        }
      },
      prefill: {
        name: "Test Namse",
        email: "test2@example.com",
        contact: "9999993999",
      },
    };

    console.log(options);

    const paymentObject = new (window as any).Razorpay(options);
    await paymentObject.open();
  };

  return (
    <div className="flex h-screen pt-6">
      <div className="flex flex-col items-center h-screen w-20">
        <div
          className={`hover:bg-gray-200 w-full text-center py-2 px-1 ${
            cval === "Mkt" ? "bg-black text-white" : null
          }`}
          onClick={() => setCval("Mkt")}
        >
          Mkt
        </div>
        <div
          className={`hover:bg-gray-200 w-full text-center py-2 px-1 ${
            cval === "Sell" ? "bg-black text-white" : null
          }`}
          onClick={() => setCval("Sell")}
        >
          Sell
        </div>
        <div
          className={`hover:bg-gray-200 w-full text-center py-2 px-1 ${
            cval === "Buy" ? "bg-black text-white" : null
          }`}
          onClick={() => setCval("Buy")}
        >
          Buy
        </div>
        <div
          className={`hover:bg-gray-200 w-full text-center py-2 px-1 ${
            cval === "My Repos" ? "bg-black text-white" : null
          }`}
          onClick={() => setCval("My Repos")}
        >
          My Repos
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {cval === "Mkt" &&
          repos.map((repo: any) => (
            <RepoCard
              repo={{
                title: repo.title,
                id: repo.id,
                cost: repo.cost,
                owner: { name: repo?.owner.name },
                description: repo.description,
              }}
              key={repo.id}
            />
          ))}

        {cval === "Buy" && (
          <Tabs onValueChange={(e) => setCtab(e)} value={ctab}>
            <TabsList>
              <TabsTrigger value="buy">buy</TabsTrigger>
              <TabsTrigger value="orders">orders</TabsTrigger>
            </TabsList>
            <TabsContent value="buy">
              {reposToBeBought.map((repo: any) => (
                <RepoCard
                  repo={{
                    title: repo.title,
                    id: repo.id,
                    cost: repo.cost,
                    owner: { name: repo?.owner.name },
                    description: repo.description,
                  }}
                  buyerCard={true}
                  orderCreationHandler={orderCreationHandler}
                  paymentHandler={paymentHandler}
                  key={repo.id}
                />
              ))}
            </TabsContent>
            <TabsContent value="orders">
              <div>OrderList here</div>
              {orders.map((order: any) => (
                <div key={order.id}>
                  <h1>{order.amount}</h1>
                  <h1>{order.id}</h1>
                  <h1>{order.currency}</h1>

                  <Button
                    onClick={() => paymentHandler(order, order.buyer.repoId)}
                  >
                    Pay
                  </Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}

        {cval === "Sell" &&
          (currUserHasOnboarded ? (
            currUserRepos.map((repo: any) => (
              <RepoCard
                repo={{
                  title: repo.title,
                  id: repo.id,
                  cost: repo.cost,
                  owner: { name: repo?.owner.name },
                  description: repo.description,
                }}
                ownerCard={true}
                key={repo.id}
              />
            ))
          ) : (
            <Link href="/profile/gatewayonboarding" className="text-center">
              Please onboard to sell your repos
            </Link>
          ))}

        {cval == "My Repos" &&
          currUserBoughtRepos.map((repo: any) => (
            <RepoCard
              repo={{
                title: repo.title,
                id: repo.id,
                cost: repo.cost,
                owner: { name: repo?.owner.name },
                description: repo.description,
              }}
              buyerCard={true}
              hasPurchased={true}
              key={repo.id}
              rerequestHandler={() =>
                accessgrantHandler(sessData?.data?.user?.id as string, repo.id)
              }
            />
          ))}
      </div>
    </div>
  );
};

export default StoreContainer;
