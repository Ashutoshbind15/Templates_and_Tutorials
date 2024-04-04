import { getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { stripe } from "../../../lib/stripe";
import { options1 } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export const POST = async () => {
  const sess = await getServerSession(options1);
  const uid = sess.user.id;

  const hasStripeAccount = await prisma.user.findFirst({
    where: { id: uid, stripeAccountId: { not: null } },
  });

  if (!hasStripeAccount) {
    const account = await stripe.accounts.create({
      type: "custom",
      country: "IN",
    });

    await prisma.user.update({
      where: { id: uid },
      data: { stripeAccountId: account.id },
    });
  }

  // create account link using client id

  const account = await prisma.user.findFirst({
    where: { id: uid },
    select: { stripeAccountId: true },
  });

  console.log("account", account);

  const accountLink = await stripe.accountLinks.create({
    account: account?.stripeAccountId,
    refresh_url: `${process.env.NEXTAUTH_URL}/addrepo`,
    return_url: `${process.env.NEXTAUTH_URL}/profile`,
    type: "account_onboarding",
  });

  console.log("account", accountLink);
  return NextResponse.json(accountLink.url);
};
