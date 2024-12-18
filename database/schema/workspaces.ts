import {
  json,
  jsonb,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { auth } from "./_schemas";
import { userTable } from "./users";

const { table } = auth;

export const workspaceTable = table("workspaces", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  primaryOwnerId: text("primary_owner_id")
    .notNull()
    .references(() => userTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id")
    .notNull()
    .references(() => userTable.id),
  metadata: jsonb("metadata"),
});

export const billingTable = table("billing", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id),
  customerId: text("customer_id"),
  subscriptionId: text("subscription_id"),
  billingCity: text("billing_city"),
  billingCountry: text("billing_country"),
  billingState: text("billing_state"),
  billingStreet: text("billing_street"),
  billingZipcode: text("billing_zipcode"),
  billingEmailAddress: text("billing_email_address"),
  billingName: text("billing_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
  updatedById: text("updated_by_id")
    .notNull()
    .references(() => userTable.id),
});

export const workspaceUserTable = table(
  "workspace_users",
  {
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaceTable.id),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id),
    role: varchar("role", { length: 255 }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.workspaceId, t.userId] }),
  }),
);
