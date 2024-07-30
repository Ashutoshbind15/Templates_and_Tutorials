import prisma from "@/app/lib/prisma";
import { razorpayInstance } from "@/app/lib/razorpay";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  const { userId, repoId } = data;

  const buyer = await prisma.buyer.create({
    data: {
      userId,
      repoId,
    },
  });

  const rzInstance = razorpayInstance;

  const repo = await prisma.repo.findUnique({
    where: {
      id: repoId,
    },
    include: {
      metadata: true,
    },
  });

  if (!repo || !repo.metadata)
    return NextResponse.json(
      { msg: "Repo or metadata not found" },
      { status: 404 }
    );

  const dbUser = await prisma.user.findUnique({
    where: {
      id: repo?.ownerId,
    },
    select: {
      paymentGatewayAccountId: true,
    },
  });

  const payment_gateway_account_id = dbUser?.paymentGatewayAccountId;

  const order = await rzInstance.orders.create({
    amount: repo?.metadata?.cost,
    currency: "INR",
    payment_capture: true,
    transfers: [
      {
        account: payment_gateway_account_id as string,
        amount: (repo?.metadata?.cost / 100) * 80,
        currency: "INR",
      },
    ],
  });

  // update the orderId in the buyer table

  const dbOrder = await prisma.order.create({
    data: {
      orderId: order.id,
      amount: +order.amount,
      currency: order.currency,
      buyerId: buyer.id,
      status: order.status,
    },
  });

  const updatedBuyer = await prisma.buyer.update({
    where: {
      id: buyer.id,
    },
    data: {
      orderId: order.id,
    },
  });

  return NextResponse.json({ order, dbOrder, updatedBuyer });
};
