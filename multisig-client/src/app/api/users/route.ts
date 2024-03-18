import { WalletSchema } from "@/validations/wallet.schama";
import { UsersTable, WalletsTable, db } from "@/db/drizzle";
import { getServerAddress } from "@/lib/getServerAddress";
import { sql } from "drizzle-orm";

/**
 * Retrieves the server address and returns it as a JSON response.
 * @param request - The request object.
 * @returns The server address as a JSON response.
 */
export async function GET(request: Request) {
  const address = await getServerAddress();
  return Response.json({ address });
}

/**
 * Inserts a wallet into the database. If the user does not exist, creates a new user as well.
 * @param request - The request object.
 */
export async function POST(request: Request) {
  const address = await getServerAddress();
  if (!address) {
    return Unauthorized;
  }
  const body = await request.json();
  let data: WalletSchema;
  try {
    data = WalletSchema.parse(body);
  } catch (error: any) {
    console.log("error", error);
    return Response.json(
      { error: error?.message ?? "Invalid Data" },
      { status: 400 }
    );
  }

  const user = db
    .select()
    .from(UsersTable)
    .where(sql`${UsersTable.address} = ${address}`);

  if (!user) {
    await db.insert(UsersTable).values({
      address,
      createdAt: new Date(),
    });
  }

  const wallet = await db
    .insert(WalletsTable)
    .values({
      owners: data.owners,
      threshold: data.threshold,
      chain: data.chain,
      address: address,
      name: data.name,
    })
    .returning();

  return wallet;
}
