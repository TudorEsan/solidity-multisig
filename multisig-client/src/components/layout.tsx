"use client";
import React from "react";
import { AppNavbar } from "./navbar";
import { ShowWallet } from "./show-wallet";

const Drawer = ({ selectedWallet }: { selectedWallet: string | null }) => {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-60 border-r pt-20 p-2">
      <ShowWallet address={selectedWallet || ""} name={null} />
    </div>
  );
};

export const Layout = ({
  children,
  selectedWallet,
}: {
  children: React.ReactNode;
  selectedWallet: string | null;
}) => {
  console.log("selected", selectedWallet);
  return (
    <div>
      <Drawer selectedWallet={selectedWallet} />
      <AppNavbar />
      <div className="ml-60 px-4">
        <div className="relative max-w-5xl mx-auto top-24">{children}</div>
      </div>
    </div>
  );
};
