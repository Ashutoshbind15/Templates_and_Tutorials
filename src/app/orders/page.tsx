"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  TooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "../components/uilib/ui/tooltip";
import { InfoIcon } from "lucide-react";

import moment from "moment";

const OrdersPage = () => {
  const sess = useSession();
  const uid = sess.data?.user?.id;

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/orders");
      const data = await res.json();
      console.log(data);
      setOrders(data);
    };
    fetchOrders();
  }, []);

  if (!sess.data) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap">
        {orders?.map((order: any) => {
          return (
            <div key={order?.orderId} className="my-2 py-3 px-6 w-1/2">
              <div className="flex items-center justify-between border-y-2 pr-3 border-gray-600">
                <Image
                  src={order?.repo?.image}
                  alt="repo"
                  width={100}
                  height={100}
                />
                <div className="flex-1 flex flex-col items-center">
                  <div>{order?.repo?.title}</div>

                  <span className="bg-white text-slate-800 rounded-lg px-4 py-1 w-max">
                    {order?.payments[0]?.amount}
                  </span>
                </div>
                <div className="max-h-24 overflow-y-auto">
                  {order?.payments?.map((payment: any) => {
                    return (
                      <div
                        key={payment.id}
                        className="flex gap-x-3 border-2 p-2 rounded-lg"
                      >
                        <div>{payment.status}</div>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <InfoIcon />
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="p-2 bg-slate-800 text-white"
                            >
                              <div>
                                {moment(payment.paidAt).format(
                                  "MMMM Do YYYY, h:mm:ss a"
                                )}
                              </div>
                              <div>id: {payment.id}</div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
