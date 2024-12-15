// layout.tsx
import React, { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import {
  afterCheckoutUrl,
  afterSignUpUrl,
  afterVerifyUrl,
  unauthenticatedUrl,
} from "@/constants";
import { getAllUserWorkspaces } from "@/data-access/workspaces";
import { selectedWorkspaceCookie } from "@/constants";
import { validateRequest } from "@/lib/lucia";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar/app-sidebar";
import { UserWithWorkspaceAndProfile } from "@/types/entities";
import { Profile } from "@database/types";
import { CommandPaletteProvider } from "@/providers/command-provider";
import { CommandPalette } from "@/components/command-palette";
import { Shortcuts } from "@/components/shortcuts";

export default async function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const validator = await validateRequest();
  if (!validator.user) {
    return redirect(unauthenticatedUrl);
  }
  const dbUser = await getUserById(validator.user.id);
  if (!dbUser) {
    return redirect(unauthenticatedUrl);
  }
  if (!dbUser.verifiedAt) {
    return redirect(afterSignUpUrl);
  }
  if (!dbUser.checkoutAt) {
    return redirect(afterVerifyUrl);
  }
  if (!dbUser.onboardedAt) {
    return redirect(afterCheckoutUrl);
  }

  const workspaces = await getAllUserWorkspaces(dbUser.id);

  const cookieSelectedWorkspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";

  const userProfileWorkspace: UserWithWorkspaceAndProfile = {
    ...dbUser,
    profile: dbUser.profile as Profile,
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
