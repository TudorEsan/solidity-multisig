import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  integer,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel, relations } from "drizzle-orm";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const UsersTable = pgTable(
  "users",
  {
    address: text("address").primaryKey(),
    email: text("email"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);

export const UsersRelations = relations(UsersTable, ({ many }) => ({
  wallets: many(WalletsTable),
}));

export const WalletsTable = pgTable("wallets", {
  id: serial("id").primaryKey(),
  owners: text("owners").array().notNull(),
  threshold: integer("threshold").notNull(),
  chain: integer("chain").notNull(),
  address: text("address")
    .references(() => UsersTable.address)
    .notNull(),
  name: text("name"),
});

export const WalletsRelations = relations(WalletsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [WalletsTable.address],
    references: [UsersTable.address],
  }),
}));

export type User = InferSelectModel<typeof UsersTable>;
export type NewUser = InferInsertModel<typeof UsersTable>;
export type Wallet = InferSelectModel<typeof WalletsTable>;
export type NewWallet = InferInsertModel<typeof WalletsTable>;

// Connect to Vercel Postgres
export const db = drizzle(sql);
