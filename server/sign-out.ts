"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { cookies } from "next/headers";
import {
  invalidateSession,
  validateSessionToken,
} from "@/lib/auth";
import { authCookie } from "@/constants";
import { auth } from "@/database/schema/_schemas";

export const signOutAction = authenticatedAction
  .createServerAction()
  .handler(async ({ input }) => {
    const sessionToken = (await cookies()).get(authCookie)?.value ?? null;
    if (!sessionToken) return undefined;

    const result = await validateSessionToken(sessionToken);
    if (!result.session) {
      return false;
    }

    await invalidateSession(result.session.id);
    (await cookies()).set(authCookie, "", {
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });
    return true;
  });
