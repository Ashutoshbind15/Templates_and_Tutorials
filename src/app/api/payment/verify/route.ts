import prisma from "@/app/lib/prisma";
import { razorpayInstance } from "@/app/lib/razorpay";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const razorpay = razorpayInstance;
    const data = await req.json();
    const { order_id, payment_id, signature } = data;

    // Signature verification for payment validation
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(order_id + "|" + payment_id)
      .digest("hex");

    if (signature === expectedSignature) {
      // Update payment status in your database

      //   find the payment status of the payment_id
      const payment = await razorpay.payments.fetch(payment_id);
      const paymentStatus = payment.status;

      const dbOrder = await prisma.order.findFirst({
        where: {
          orderId: order_id,
        },
      });

      const dbPayment = await prisma.payment.create({
        data: {
          paymentId: payment_id,
          status: paymentStatus,
          amount: +payment.amount,
          currency: "INR",
          orderId: dbOrder?.id as string,
        },
      });

      // Send success response
      return NextResponse.json({
        paymentStatus,
        success: true,
        message: "Payment verification successful",
      });
    } else {
      // Log the error, update payment status in your database as failed
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 }
    );
  }
};
