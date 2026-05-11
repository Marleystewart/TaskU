import { NextResponse } from "next/server";

const stripeApiBase = "https://api.stripe.com/v1";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!stripeSecretKey || !stripePublishableKey || !siteUrl) {
    return NextResponse.json(
      { error: "Payment setup is not complete yet." },
      { status: 500 },
    );
  }

  const body = new URLSearchParams({
    mode: "payment",
    "automatic_payment_methods[enabled]": "true",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": "300",
    "line_items[0][price_data][product_data][name]": "TaskU Posting Fee",
    success_url: `${siteUrl}?payment=success`,
    cancel_url: `${siteUrl}?payment=cancel`,
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
      { error: "Payment setup is not complete yet." },
      { status: response.status },
    );
  }

  return NextResponse.json({ url: data.url });
}
