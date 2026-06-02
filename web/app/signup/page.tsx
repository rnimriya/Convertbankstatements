import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Sign up — BankStatements" };

export default function SignupPage() {
  return (
    <>
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
      <Footer />
    </>
  );
}
