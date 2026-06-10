import { notFound } from "next/navigation";
import { getPortal } from "@/lib/portals";
import { PortalUpload } from "@/components/PortalUpload";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ token: string; locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { token } = await params;
  const portal = await getPortal(token);
  if (!portal || !portal.active) return { title: "Upload Portal" };
  return {
    title: `${portal.label} — Secure Upload`,
    robots: { index: false, follow: false },
  };
}

export default async function PortalPage({ params }: Props) {
  const { token } = await params;
  const portal = await getPortal(token);
  if (!portal || !portal.active) notFound();

  return <PortalUpload portalToken={token} portalLabel={portal.label} />;
}
