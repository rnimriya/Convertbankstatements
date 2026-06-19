import { Suspense } from "react";
import { VerifyEmailContent } from "./VerifyEmailContent";

export const metadata = { title: "Verify Email — Convert Statement" };

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
