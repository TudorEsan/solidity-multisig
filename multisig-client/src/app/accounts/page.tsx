import { GradientAvatar } from "@/components/gradient-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { WalletsTable, db } from "@/db/drizzle";
import { shortenAddress } from "@/helpers/shortenAddress";
import { getServerAddress } from "@/lib/getServerAddress";
import { sql } from "drizzle-orm";
import { utils } from "ethers";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async ({ searchParams }: { searchParams: WalletQueryParam }) => {
  const address = await getServerAddress();
  if (!address) {
    redirect("/login");
  }
  const wallets = await db
    .select()
    .from(WalletsTable)
    .where(sql`${WalletsTable.address} = ${address}`);
  return (
    <Card className="max-w-2xl mx-auto w-full">
      <CardHeader>
        <CardTitle>Select a Wallet</CardTitle>
        <CardDescription>Select a wallet to view its details.</CardDescription>
      </CardHeader>
      <CardContent>
        {wallets.map((wallet) => (
          <Link
            className="flex items-center gap-4 rounded-md border hover:bg-neutral-800 p-2"
            key={wallet.id}
            href={`/dashboard?acc=${wallet.chain}:${wallet.address}`}
          >
            <GradientAvatar size={40} text={wallet.address} />
            <div className="flex flex-col">
              <p>{wallet.name}</p>
              <p className="text-muted-foreground">
                {shortenAddress(wallet.address)}
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              <Badge variant="secondary">
                {wallet.owners.length}/{wallet.threshold}
              </Badge>
              <p> {wallet.chain}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default Page;
