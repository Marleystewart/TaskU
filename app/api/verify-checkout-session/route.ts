import { NextResponse } from "next/server";

const stripeApiBase = "https://api.stripe.com/v1";

export async function GET(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment." },
      { status: 500 },
    );
  }

  if (!sessionId) {
    return NextResponse.json({ error: "Missing checkout session." }, { status: 400 });
  }

  const response = await fetch(`${stripeApiBase}/checkout/sessions/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data.error?.message ?? "Unable to verify Stripe Checkout session." },
      { status: response.status },
    );
  }

  return NextResponse.json({
    paid: data.payment_status === "paid",
    status: data.payment_status,
  });
}
