import React from "react";
import { Transaction } from "./transaction";

const Page = ({ params }: { params: { id: string } }) => {
  return <Transaction id={params.id} />;
};

export default Page;
