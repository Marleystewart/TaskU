import { NextResponse } from "next/server";

const stripeApiBase = "https://api.stripe.com/v1";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment." },
      { status: 500 },
    );
  }

  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
  const body = new URLSearchParams({
    mode: "payment",
    "automatic_payment_methods[enabled]": "true",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": "300",
    "line_items[0][price_data][product_data][name]": "TaskU Posting Fee",
    success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}#task-form`,
    cancel_url: `${origin}/?payment=cancel#task-form`,
  });

  const response = await fetch(`${stripeApiBase}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data.error?.message ?? "Unable to create Stripe Checkout session." },
      { status: response.status },
    );
  }

  return NextResponse.json({ url: data.url });
}
