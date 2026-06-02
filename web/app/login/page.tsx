import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Sign in — BankStatements" };

export default function LoginPage() {
  return (
    <>
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
      <Footer />
    </>
  );
}
