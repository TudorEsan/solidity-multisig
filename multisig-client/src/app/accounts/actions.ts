"use server";

import { WalletsTable, db } from "@/db/drizzle";
import { sql } from "drizzle-orm";

export const deleteWallet = async (id: number) => {
  await db.delete(WalletsTable).where(sql`${WalletsTable.id} = ${id}`);
};
