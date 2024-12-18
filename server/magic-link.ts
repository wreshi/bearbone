"use server";
import {
  magicLinkAuthSchema,
  magicLinkVerifySchema,
} from "@/schemas/auth.schema";
import {
  createMagicLink,
  createUser,
  getMagicLinkByToken,
  getUserByEmail,
} from "@/data-access/users";
import { createSession, generateSessionToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { unauthenticatedAction } from "@/lib/zsa";
import { afterLoginUrl, afterSignUpUrl, authCookie } from "@/constants";
import { env } from "@/env";
import { z } from "zod";
import { cookies } from "next/headers";
import { sendVerificationEmail } from "@/emails/verification";
import { sendMagicLink } from "@/emails/magic-link";
import { url } from "inspector";

export const sendMagicLinkAction = unauthenticatedAction
  .createServerAction()
  .input(z.object({ email: z.string(), url: z.string() }))
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    const { email, url } = input;
    const res = await sendMagicLink(email, url);
    return {
      success: true,
    };
  });

export const authenticateWithMagicLinkAction = unauthenticatedAction
  .createServerAction()
  .input(magicLinkAuthSchema)
  .output(
    z.object({
      type: z.enum(["login", "signup"]),
      url: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const { email } = input;
    const user = await getUserByEmail(email);
    if (!user) {
      const createdUser = await createUser(email);
      if (!createdUser) {
        throw new Error("Something went wrong. Unable to sign up.");
      }
      const createdMagicLink = await createMagicLink(createdUser.id);
      if (!createdMagicLink.verificationToken) {
        throw new Error("Couldn't create magic link. Unable to sign up.");
      }
      const url =
        env.NEXT_PUBLIC_URL + "/magic-link/" + createdMagicLink.verificationToken;
      return {
        type: "signup",
        url: url,
      };
    } else {
      const createdMagicLink = await createMagicLink(user.id);
      if (!createdMagicLink.verificationToken) {
        throw new Error("Couldn't create magic link. Unable to sign up.");
      }
      const url =
        env.NEXT_PUBLIC_URL + "/magic-link/" + createdMagicLink.verificationToken;
      return {
        type: "login",
        url: url,
      };
    }
  });

export const verifyMagicLinkAction = unauthenticatedAction
  .createServerAction()
  .input(magicLinkVerifySchema)
  .output(
    z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const { token } = input;
    const magicLinkRes = await getMagicLinkByToken(token);
    if (!magicLinkRes) {
      return {
        success: false,
        message: "This is an invalid magic link.",
      };
    }
    const currentTimestamp = new Date().getTime();
    const magicLinkExpiry = magicLinkRes.createdAt.getTime() + 1000 * 60 * 30; // 30 minutes

    if (currentTimestamp > magicLinkExpiry) {
      return {
        success: false,
        message:
          "This is an expired magic link. Magic Links are only valid for 30 minutes.",
      };
    }

    const sessionToken = generateSessionToken();
    const sessionRes = await createSession(sessionToken, magicLinkRes.userId);
    (await cookies()).set(authCookie, sessionRes.id, {
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
    return {
      success: true,
      message: "Magic Link authentication successful.",
    };
  });
