import { notFound } from "next/navigation";
import { getPortal } from "@/lib/portals";
import { PortalUpload } from "@/components/PortalUpload";

export const dynamic = "force-dynamic";

interface Props {
  params: { token: string };
}

export async function generateMetadata({ params }: Props) {
  const portal = await getPortal(params.token);
  if (!portal || !portal.active) return { title: "Upload Portal" };
  return {
    title: `${portal.label} — Secure Upload`,
    robots: { index: false, follow: false },
  };
}

export default async function PortalPage({ params }: Props) {
  const portal = await getPortal(params.token);
  if (!portal || !portal.active) notFound();

  return <PortalUpload portalToken={params.token} portalLabel={portal.label} />;
}
