"use server";

import { WalletsTable, db } from "@/db/drizzle";
import { Routes } from "@/routes";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteWallet = async (id: number) => {
  await db.delete(WalletsTable).where(sql`${WalletsTable.id} = ${id}`);
  revalidatePath(Routes.wallets());
};
