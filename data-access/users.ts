import "server-only";
import {
  db,
  identityTable,
  magicLinkTable,
  profileTable,
  userTable,
  type Profile,
  type User,
  type MagicLink,
  Identity,
} from "@/database";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";
import { generateMagicLinkVerificationToken } from "@/lib/auth";

export async function getUserByEmail(email: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
    with: { profile: true },
  });
  return user;
}

export async function getUserById(id: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, id),
    with: { profile: true, workspaceUserTable: true },
  });
  return user;
}

export async function createUser(email: string) {
  const [user] = await db
    .insert(userTable)
    .values({
      id: ulid(),
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return user;
}


export async function updateUser(userId: string, updates: Partial<User>) {
  const [updated] = await db
    .update(userTable)
    .set(updates)
    .where(eq(userTable.id, userId))
    .returning();
  return updated;
}

export async function deleteUser(userId: string) {
  const deleted = await db.delete(userTable).where(eq(userTable.id, userId));
  return deleted;
}

export async function createProfile({
  userId,
  marketingConsent,
  firstName,
  lastName,
}: {
  userId: string;
  marketingConsent: boolean;
  firstName?: string;
  lastName?: string;
}) {
  const [created] = await db
    .insert(profileTable)
    .values({
      id: ulid(),
      userId,
      firstName,
      lastName,
      marketingConsent,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return created;
}

export async function getMagicLinkbyUserId(
  userId: string,
): Promise<MagicLink | undefined> {
  return await db.query.magicLinkTable.findFirst({
    where: eq(magicLinkTable.userId, userId),
  });
}

export async function getMagicLinkByToken(token: string) {
  return await db.query.magicLinkTable.findFirst({
    where: eq(magicLinkTable.verificationToken, token),
  });
}

export async function createMagicLink(userId: string) {
  const [created] = await db
    .insert(magicLinkTable)
    .values({
      id: ulid(),
      userId,
      verificationToken: generateMagicLinkVerificationToken(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return created;
}

export async function getIdentityByUserId(userId: string) {
  const identity = await db.query.identityTable.findFirst({
    where: eq(identityTable.userId, userId),
  });
  return identity;
}

export async function createIdentity({
  userId,
  provider,
  providerUserId,
}: Identity) {
  const [created] = await db
    .insert(identityTable)
    .values({
      id: ulid(),
      userId,
      provider,
      providerUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return created;
}

export async function getProfile(userId: string) {
  const profile = await db.query.profileTable.findFirst({
    where: eq(profileTable.userId, userId),
  });
  return profile;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const [updated] = await db
    .update(profileTable)
    .set(updates)
    .where(eq(profileTable.userId, userId))
    .returning();
  return updated;
}
