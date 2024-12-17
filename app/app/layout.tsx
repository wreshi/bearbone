// layout.tsx
import React, { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getProfile, getUserById } from "@/data-access/users";
import { unauthenticatedUrl } from "@/constants";
import { getAllUserWorkspaces } from "@/data-access/workspaces";
import { selectedWorkspaceCookie } from "@/constants";
import { getAuth } from "@/lib/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar/app-sidebar";
import { UserWithWorkspaceAndProfile } from "@/types/auth";
import { Profile } from "@/database/types";
import { CommandPaletteProvider } from "@/providers/command-provider";
import { CommandPalette } from "@/components/command-palette";
import { Shortcuts } from "@/components/shortcuts";

export default async function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getAuth();
  if (!user) return redirect(unauthenticatedUrl);
  if (!user.onboardedAt) return redirect("/signup/onboarding");

  const workspaces = await getAllUserWorkspaces(user.id);
  const profile = await getProfile(user.id);

  const cookieSelectedWorkspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";

  const userProfileWorkspace: UserWithWorkspaceAndProfile = {
    ...user,
    profile: profile as Profile,
    workspaces: workspaces,
  };

  return (
    <CommandPaletteProvider>
      <CommandPalette />
      <Shortcuts />
      <SidebarProvider>
        <AppSidebar
          user={userProfileWorkspace}
          cookieselectedworkspaceid={cookieSelectedWorkspaceId}
        />
        <main className="grid min-h-screen w-full">{children}</main>
      </SidebarProvider>
    </CommandPaletteProvider>
  );
}
