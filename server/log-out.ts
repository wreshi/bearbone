"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { cookies } from "next/headers";
import { invalidateSession, validateSessionToken } from "@/lib/auth";
import { authCookie, selectedWorkspaceCookie } from "@/constants";

export const logoutAction = authenticatedAction
  .createServerAction()
  .handler(async ({ input }) => {
    const cookieStore = await cookies();

    const sessionToken = cookieStore.get(authCookie)?.value ?? null;
    if (!sessionToken) return undefined;

    const result = await validateSessionToken(sessionToken);
    if (!result.session) {
      return false;
    }

    await invalidateSession(result.session.id);
    cookieStore.delete(authCookie);
    cookieStore.delete(selectedWorkspaceCookie);
    return true;
  });
