import prisma from "@/app/lib/prisma";
import { razorpayInstance } from "@/app/lib/razorpay";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options1 } from "../auth/[...nextauth]/options";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const rzInstance = razorpayInstance;
    const acc = await rzInstance.accounts.create(data);

    const accId = acc.id;
    const sess = await getServerSession(options1);
    const uid = sess?.user?.id;

    // update the field providerAccountId in the user table

    await prisma.user.update({
      where: {
        id: uid,
      },
      data: {
        paymentGatewayAccountId: accId,
        paymentGatewayAccountOnBoarded: true,
      },
    });

    return NextResponse.json(acc);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {};
