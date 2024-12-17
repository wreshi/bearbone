import { db, Session, sessionTable, User, userTable } from "@/database";
import { eq } from "drizzle-orm";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { authCookie, selectedWorkspaceCookie } from "@/constants";
import { env } from "@/env";

// Session Token Generation
export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

// Create Session
export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  };
  await db.insert(sessionTable).values(session);
  return session;
}

// Session Validation Result Type
export type SessionValidationResult = {
  session: Session | null;
  user: User | null;
};

// Validate Session Token
export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({ user: userTable, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));

  if (result.length < 1) return { session: null, user: null };

  const { session, user } = result[0];

  // Handle session expiration
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }

  // Extend session expiration if near expiry
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // Extend by 30 days
    await db
      .update(sessionTable)
      .set({ expiresAt: session.expiresAt })
      .where(eq(sessionTable.id, session.id));
  }

  return { session, user };
}

// Invalidate Session
export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

// Give out session and user
export const getAuth = async (): Promise<{
  session: Session | null;
  user: User | null;
}> => {
  const sessionToken = (await cookies()).get(authCookie)?.value ?? null;
  if (!sessionToken) return { session: null, user: null };

  const result = await validateSessionToken(sessionToken);
  return { session: result.session, user: result.user };
};

// Create Session For User and Set Cookie
export async function createSessionForUser(userId: string): Promise<void> {
  const token = generateSessionToken();
  await createSession(token, userId);

  // Set session cookie
  (await cookies()).set(authCookie, token, {
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
}

// Get Workspace ID for Authenticated User
export async function getWorkspaceId(): Promise<string> {
  const { user } = await getAuth();
  if (!user) throw new Error("You need to be logged in to access this content");
  const workspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value ?? null;
  if (!workspaceId) throw new Error("Workspace not found");
  return workspaceId;
}
