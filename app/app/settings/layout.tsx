// layout.tsx
import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import {
  afterSignUpUrl,
  afterVerifyUrl,
  unauthenticatedUrl,
} from "@/constants";
import { SidebarItem } from "./_components/settings-sidebar-link";
import { PageTitle } from "@/components/page-title";
import { getAuth } from "@/lib/auth";

export default async function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {user} = await getAuth();
  if (!user) {
    return redirect(unauthenticatedUrl);
  }
  if (!user) {
    return redirect(unauthenticatedUrl);
  }
  if (!user.verifiedAt) {
    return redirect(afterSignUpUrl);
  }
  if (!user.onboardedAt) {
    return redirect(afterVerifyUrl);
  }

  return (
    <section className="flex h-screen min-h-screen w-full flex-col items-start p-5">
      <div className="flex flex-col gap-2">
        <PageTitle>settings</PageTitle>
      </div>
      <section className="grid h-full w-full grid-cols-[225px_1fr] gap-3 pt-4">
        <section className="flex h-full flex-col gap-[0.2rem] -ml-1">
          <SidebarItem label="Account" />
          <SidebarItem label="Workspace" />
          <SidebarItem label="Billing" />
          <SidebarItem label="Appearance" />
        </section>
        {children}
      </section>
    </section>
  );
}
