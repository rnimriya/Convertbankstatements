import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.BACKEND_API_KEY) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    userId: externalId,
    fileName,
    fileHash,
    pageCount,
    pagesCharged,
    billingType,
    transactionCount,
    processingMs,
    bankName,
    exportFormats,
    paymentId,
  } = body;

  const user = await prisma.user.findFirst({ where: { externalId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.usageLog.create({
      data: {
        userId: user.id,
        fileName,
        fileHash,
        pageCount,
        pagesCharged,
        billingType,
        isFreePages: billingType === "FREE_TIER",
        paymentId: paymentId ?? null,
        exportFormats: exportFormats ?? [],
        transactionCount,
        processingMs,
        bankName: bankName ?? null,
      },
    }),
    prisma.subscription.updateMany({
      where: { userId: user.id },
      data: {
        pagesUsedThisPeriod: { increment: pagesCharged },
        totalPagesProcessed: { increment: pageCount },
        totalDocuments: { increment: 1 },
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
