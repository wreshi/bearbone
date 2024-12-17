import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authenticatedUrl } from "@/constants";
import { getAuth } from "@/lib/auth";
import { CheckCircle } from "lucide-react";
import { Metadata } from "next";

import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Sign Up Link Sent",
};

export default async function SignUpLinkSent() {
  const { user } = await getAuth();
  if (user) {
    redirect(authenticatedUrl);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="min-w-md max-w-md">
        <div className="px-4">
          <CardHeader className="flex flex-col items-center space-y-2">
            <CheckCircle className="h-12 w-12 text-green-500 animate-in zoom-in" />
            <CardTitle className="text-center text-2xl font-bold">
              Sign Up Link Sent!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center duration-700 animate-in fade-in">
            <p className="w-96 text-sm text-muted-foreground">
              We've sent a magic link to your email address, click the continue
              button in the email to signup. If you don't see the email in your
              inbox, check your spam folder.
            </p>
            <p className="text-sm text-muted-foreground">
              Still didn't receive the email?{" "}
              <Link
                href="/signup"
                className="cursor-pointer font-medium underline-offset-4 hover:underline"
              >
                Try Again
              </Link>
            </p>
          </CardContent>
        </div>
      </Card>
    </main>
  );
}
