import { authenticatedUrl } from "@/constants";
import { getAuth } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Magic Link",
};

export default async function MagicLinkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getAuth();
  if (user) return redirect(authenticatedUrl);
  return <>{children}</>;
}
