import React from "react";
import { Header } from "./components/header";
import { Tokens } from "./components/tokens";
import { Owners } from "./components/owners";
import { TransactionHistory } from "./components/transaction-history";

const Page = () => {
  return (
    <div className="grid grid-cols-2 w-full gap-8">
      <div className="col-span-full">
        <Header />
      </div>
      <Tokens />
      <Owners />
      <div className="col-span-full">
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Page;
