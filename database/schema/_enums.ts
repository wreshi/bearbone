import { pgEnum } from "drizzle-orm/pg-core";

export const providerValues = ["google", "microsoft", "apple"] as const;
export const providerEnum = pgEnum("identity_provider", providerValues);