import React from "react";
import { Header } from "./components/header";
import { Tokens } from "./components/tokens";

const Page = () => {
  return (
    <div className="grid grid-cols-2 w-full">
      <div className="col-span-full">
        <Header />
      </div>
      <Tokens />

    </div>
  );
};

export default Page;
