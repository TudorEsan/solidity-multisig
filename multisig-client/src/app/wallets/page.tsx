import { GradientAvatar } from "@/components/gradient-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { TrashIcon } from "@radix-ui/react-icons";
import { sql } from "drizzle-orm";
import { utils } from "ethers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteButton } from "./components/delete-button";
import { Routes } from "@/routes";
import Image from "next/image";
import { CHAINS_IMAGES } from "@/constants/chains";

const Page = async ({ searchParams }: { searchParams: WalletQueryParam }) => {
  const address = await getServerAddress();
  if (!address) {
    redirect(Routes.login());
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
        <div className="flex items-center justify-center w-full flex-col gap-3">
          {wallets.map((wallet) => (
            <Link
              className="flex items-center gap-4 rounded-md border hover:bg-neutral-800 p-2 w-full"
              key={wallet.id}
              href={`/dashboard?acc=${wallet.chain}:${wallet.walletAddress}`}
            >
              <GradientAvatar size={40} text={wallet.walletAddress} />
              <div className="flex flex-col">
                <p>{wallet.name}</p>
                <p className="text-muted-foreground">
                  {shortenAddress(wallet.walletAddress)}
                </p>
              </div>
              <div className="ml-auto flex gap-2 items-center">
                <Badge variant="secondary">
                  {wallet.owners.length}/{wallet.threshold}
                </Badge>
                <Image
                  height={32}
                  width={32}
                  alt="chain"
                  // @ts-ignore
                  src={`${CHAINS_IMAGES[Number(wallet.chain)] as string}`}
                />
                <DeleteButton id={wallet.id} />
              </div>
            </Link>
          ))}
          <Link href={Routes.create()} className="mt-4">
            <Button>Create Wallet</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
