import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaid(invoice);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(sub);
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(sub);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== "payment") return;

  const userId = session.metadata?.user_id;
  if (!userId) return;

  const user = await prisma.user.findFirst({ where: { externalId: userId } });
  if (!user) return;

  await prisma.payment.create({
    data: {
      userId: user.id,
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      amount: session.amount_total ?? 199,
      currency: session.currency ?? "usd",
      status: "SUCCEEDED",
      description: "Pay-as-you-go: document processing",
      pageCount: parseInt(session.metadata?.page_count ?? "0"),
    },
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subId = invoice.subscription as string | null;
  if (!subId) return;

  const priceId = invoice.lines.data[0]?.price?.id;
  const settings = getTierSettings(priceId ?? "");

  await prisma.subscription.updateMany({
    where: { stripeSubId: subId },
    data: {
      status: "ACTIVE",
      pagesUsedThisPeriod: 0,
      currentPeriodStart: new Date(invoice.period_start * 1000),
      currentPeriodEnd: new Date(invoice.period_end * 1000),
      monthlyPageLimit: settings.pageLimit,
      tier: settings.tier as never,
    },
  });
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubId: sub.id },
    data: { status: "CANCELED", tier: "FREE", monthlyPageLimit: 8 },
  });
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const priceId = sub.items.data[0]?.price?.id;
  const settings = getTierSettings(priceId ?? "");

  await prisma.subscription.updateMany({
    where: { stripeSubId: sub.id },
    data: {
      status: sub.status.toUpperCase() as never,
      tier: settings.tier as never,
      monthlyPageLimit: settings.pageLimit,
    },
  });
}

function getTierSettings(priceId: string) {
  const PRO_PRICE = process.env.STRIPE_PRICE_PRO_MONTHLY;
  const BUSINESS_PRICE = process.env.STRIPE_PRICE_BUSINESS_MONTHLY;

  if (priceId === PRO_PRICE) return { tier: "PRO", pageLimit: 200 };
  if (priceId === BUSINESS_PRICE) return { tier: "BUSINESS", pageLimit: 500 };
  return { tier: "FREE", pageLimit: 8 };
}
