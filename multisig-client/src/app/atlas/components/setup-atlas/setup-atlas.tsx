import Image from "next/image";
import React from "react";
import { Setup2fa } from "../setup-atlas";

export const SetupAtlas = ({ code }: { code: string }) => {
  return (
    <div className="flex gap-8 flex-wrap-reverse items-center">
      <div>
        <h1 className="text-2xl">Setup Atlas</h1>
        <p className="text-sm text-gray-500 mt-8 mb-2">What is Atlas?</p>
        <p className="max-w-md">
          Atlas is a two-factor authentication (2FA) code that you can set up
          for your multisig to approve transactions. It provides an additional
          layer of security by requiring you to enter a unique code along with
          your regular authentication credentials.
        </p>
        <div className="mt-4">
          <Setup2fa code={code}/>
        </div>
      </div>
      <Image width={300} height={400} src="/images/atlas.png" alt="atlas" />
    </div>
  );
};
