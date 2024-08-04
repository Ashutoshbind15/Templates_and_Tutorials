import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options1 } from "../auth/[...nextauth]/options";
import { userOrders } from "@/app/lib/apihelpers";

export const GET = async (req: NextRequest) => {
  const sess = await getServerSession(options1);

  const uid = sess?.user.id;

  if (!uid) {
    return NextResponse.json({ msg: "Unauthenticated" }, { status: 401 });
  }

  const userOrdersList = await userOrders(uid);

  console.log(userOrdersList);

  return NextResponse.json(userOrdersList, { status: 200 });
};
