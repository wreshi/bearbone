import { LoginForm } from "./_components/LoginForm";
import { Metadata } from "next";
import { fetchAuthenticatedUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import { authenticatedUrl } from "@/constants";

export const metadata: Metadata = {
  title: "Login",
};

export default async function SignInPage() {
  const user = await fetchAuthenticatedUser();
  const dbUser = await getUserById(user?.id || "");
  if (dbUser && dbUser.verifiedAt && dbUser.checkoutAt && dbUser.onboardedAt) {
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
