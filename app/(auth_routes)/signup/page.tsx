import { SignUpForm } from "./_components/SignUpForm";
import { Metadata } from "next";
import { fetchAuthenticatedUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import { authenticatedUrl } from "@/constants";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function SignUpPage() {
  const user = await fetchAuthenticatedUser();
  const dbUser = await getUserById(user?.id || "");
  if (dbUser && dbUser.verifiedAt && dbUser.onboardedAt && dbUser.checkoutAt) {
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
