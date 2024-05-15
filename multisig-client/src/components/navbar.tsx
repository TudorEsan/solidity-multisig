import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
/**
 * Renders the application navbar.
 * @returns The JSX element representing the application navbar.
 */
export function AppNavbar() {
  return (
    <div className="fixed z-50 top-0 left-0 lg:left-60 right-0  h-16 bg-white dark:bg-black border-b flex items-center ">
      <div className="flex justify-between items-center  my-auto px-6 xl:px-12 w-full ">
        <p className="text-2xl font-semibold">Vault</p>
        <div className="flex items-center gap-3">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
