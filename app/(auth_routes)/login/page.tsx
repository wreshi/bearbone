import { LoginForm } from "./_components/LoginForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { authenticatedUrl } from "@/constants";
import { getAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login",
};

export default async function SignInPage() {
  const {user} = await getAuth();
  if (user && user.verifiedAt && user.checkoutAt && user.onboardedAt) {
    return redirect(authenticatedUrl);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* <Suspense fallback={<Loading />}> */}
      <LoginForm />
      {/* </Suspense> */}
    </main>
  );
}
