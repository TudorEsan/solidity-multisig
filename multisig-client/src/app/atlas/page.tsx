import React from "react";
import { Activate2FaButton } from "./components/Activate2FaButton";
import { SetupAtlas } from "./components/setup-atlas/setup-atlas";
import { getServerAddress } from "@/lib/getServerAddress";
import { generateTOTP } from "@/lib/2fa";

const Settings = async ({
  searchParams,
}: {
  searchParams: { acc: string };
}) => {
  const acc = searchParams.acc.split(":")[1];
  const code = await generateTOTP(acc);
  console.log(code);

  return (
    <div>
      <SetupAtlas code={code} />
    </div>
  );
};

export default Settings;
