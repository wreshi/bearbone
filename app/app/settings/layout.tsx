// layout.tsx
import React from "react";
import { redirect } from "next/navigation";
import { unauthenticatedUrl } from "@/constants";
import { SidebarItem } from "./_components/settings-sidebar-link";
import { PageTitle } from "@/components/page-title";
import { getAuth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Settings",
    template: "%s | Settings | Bearbone",
  },
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getAuth();
  if (!user) return redirect(unauthenticatedUrl);
  if (!user.onboardedAt) return redirect("/signup/onboarding");

  return (
    <section className="flex h-screen min-h-screen w-full flex-col items-start p-5">
      <div className="flex flex-col gap-2">
        <PageTitle>Settings</PageTitle>
      </div>
      <section className="grid h-full w-full gap-3 pt-4 sm:grid-cols-[225px_1fr] grid-rows-[min-content_1fr]">
        <section className="-ml-1 flex h-full flex-col gap-[0.2rem] mb-4 sm:mb-0">
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
