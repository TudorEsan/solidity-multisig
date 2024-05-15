"use client";
import React from "react";
import { AppNavbar } from "./navbar";
import { ShowWallet } from "./show-wallet";
import { Routes } from "@/routes";

import {
  DatabaseIcon as DatabaseIconSolid,
  ExternalLinkIcon as ExternalLinkIconSolid,
  HomeIcon as HomeIconSolid,
  SortAscendingIcon as SortAscendingIconSolid,
  PaperAirplaneIcon as PaperAirplaneIconSolid,
  SearchIcon as SearchIconSolid,
  ViewGridIcon as ViewGridIconSolid,
  SwitchHorizontalIcon as SwitchHorizontalIconSolid,
  LockClosedIcon as LockClosedIconSolid,
} from "@heroicons/react/solid";
import {
  DatabaseIcon,
  ExternalLinkIcon,
  HomeIcon,
  SortAscendingIcon,
  PaperAirplaneIcon,
  SearchIcon,
  ViewGridIcon,
  SwitchHorizontalIcon,
  LockClosedIcon,
} from "@heroicons/react/outline";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const drawerLinks = [
  {
    name: "Home",
    link: Routes.dashboard(),
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    name: "Transactions",
    link: Routes.transactions(),
    icon: SwitchHorizontalIcon,
    iconSolid: SwitchHorizontalIconSolid,
  },
  {
    name: "Atlas",
    link: Routes.atlas(),
    icon: LockClosedIcon,
    iconSolid: LockClosedIconSolid,
  },
];

const Drawer = ({ selectedWallet }: { selectedWallet: string | null }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const acc = searchParams.get("acc");
  const isActive = (link: string) => {
    if (link === "/") {
      return pathname === link;
    }
    return pathname.startsWith(link);
  };
  return (
    <div className="fixed left-0 top-0 bottom-0 w-60 border-r pt-4 p-2">
      <ShowWallet address={selectedWallet || ""} name={null} />
      <div className="mt-12 flex flex-col items-center">
        {drawerLinks.map((link) => {
          const Icon = isActive(link.link) ? link.iconSolid : link.icon;
          return (
            <Link href={`${link.link}?acc=${acc}`} key={`${link.link}drawer`}>
              <div
                className={cn(
                  "flex items-center gap-2 mb-4 px-4 py-2 rounded-md w-52",
                  isActive(link.link) && "bg-blue-500/10"
                )}
                key={`link-${link.link}`}
              >
                <Icon
                  className={cn(
                    "w-6 h-6 ",
                    isActive(link.link) && "text-blue-500"
                  )}
                />
                <p
                  className={cn(
                    "ml-2 text-sm",
                    isActive(link.link) && "text-blue-500"
                  )}
                >
                  {link.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const selectedWallet = searchParams.get("acc");
  return (
    <div>
      <Drawer selectedWallet={selectedWallet} />
      <AppNavbar />
      <div className="ml-60 px-4">
        <div className="relative max-w-5xl mx-auto top-24 pb-4">{children}</div>
      </div>
    </div>
  );
};
