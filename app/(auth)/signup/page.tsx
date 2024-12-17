import { SignUpForm } from "./_components/SignUpForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import { authenticatedUrl } from "@/constants";
import { getAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function SignUpPage() {
  const {user} = await getAuth();
  if (user && user.onboardedAt) {
    return redirect(authenticatedUrl);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* <Suspense fallback={<Loading />}> */}
      <SignUpForm />
      {/* </Suspense> */}
    </main>
  );
}
