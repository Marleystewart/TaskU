import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!stripeSecretKey || !siteUrl) {
    console.error("Stripe Checkout setup missing", {
      hasSecretKey: Boolean(stripeSecretKey),
      hasSiteUrl: Boolean(siteUrl),
    });

    return NextResponse.json(
      { error: "Payment setup is not complete yet." },
      { status: 500 },
    );
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: 300,
            product_data: {
              name: "TaskU Posting Fee",
            },
          },
        },
      ],
      success_url: `${siteUrl}?payment=success`,
      cancel_url: `${siteUrl}?payment=cancel`,
    });

    if (!session.url) {
      console.error("Stripe Checkout session missing URL", { sessionId: session.id });
      return NextResponse.json(
        { error: "Payment setup is not complete yet." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout session creation failed", error);
    return NextResponse.json(
      { error: "Payment setup is not complete yet." },
      { status: 500 },
    );
  }
}
