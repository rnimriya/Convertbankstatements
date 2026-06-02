import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_MAP: Record<string, string> = {
  pro: process.env.STRIPE_PRICE_PRO_MONTHLY!,
  business: process.env.STRIPE_PRICE_BUSINESS_MONTHLY!,
};

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId: priceKey } = await req.json();
  const stripePrice = PRICE_MAP[priceKey];
  if (!stripePrice) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { externalId: session.user.id },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: stripePrice, quantity: 1 }],
    customer: user?.stripeCustomerId ?? undefined,
    customer_creation: user?.stripeCustomerId ? undefined : "always",
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&status=subscribed`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?tab=billing`,
    metadata: { user_id: session.user.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
