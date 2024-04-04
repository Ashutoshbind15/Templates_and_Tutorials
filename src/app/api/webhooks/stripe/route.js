import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const POST = async (req) => {
  const body = await req.text();
  const sig = headers().get("Stripe-Signature");
  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Webhook signature verification failed",
      },
      {
        status: 400,
      }
    );
  }

  const session = event.data.object;

  if (!session?.metadata?.userId) {
    return new Response(null, {
      status: 200,
    });
  }

  if (event.type === "account.updated") {
    const dbUserId = session.metadata.userId;
    const stripeAccountId = session.id;

    // check for whether details have been updated

    console.log("Session", session);
    console.log(`Event`, event);

    await prisma.user.update({
      where: { id: dbUserId },
      data: {
        stripeAccountOnBoarded: true,
      },
    });
  }

  return NextResponse.json({ received: true });
};
