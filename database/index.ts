import * as tables from "./tables";
import * as relations from "./relations";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@/env";
import postgres from "postgres";

// Determine the database URL based on the environment
const databaseUrl =
  env.NODE_ENV === "development"
    ? env.DATABASE_POSTGRES_URL_DEV
    : env.DATABASE_POSTGRES_URL;

// Set up the SQL client depending on the environment
const sql = postgres(databaseUrl);

// Initialize the database with the appropriate drizzle function and schema
export const db = drizzle(sql, { schema: { ...tables, ...relations } })
