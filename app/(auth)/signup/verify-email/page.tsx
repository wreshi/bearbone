import { Metadata } from "next";
import React from "react";
import { VerifyEmailForm } from "./_components/VerifyEmailForm";
import { getUserById } from "@/data-access/users";
import { redirect } from "next/navigation";
import { afterVerifyUrl, unauthenticatedUrl } from "@/constants";
import { getAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Verify your email",
};

const VerifyEmailPage = async () => {
  const {user} = await getAuth();
  if (!user) {
    return redirect(unauthenticatedUrl);
  }
  return <VerifyEmailForm email={user?.email || ""} />;
};

export default VerifyEmailPage;
