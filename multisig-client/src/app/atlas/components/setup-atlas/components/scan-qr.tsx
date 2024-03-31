import { Button } from "@/components/ui/button";
import React from "react";
import { QRCode } from "react-qrcode-logo";

export const ScanQr = ({
  handleNext,
  code,
}: {
  handleNext: () => void;
  code: string;
}) => {
  return (
    <div className="flex flex-col gap-8 items-center">
      <QRCode
        qrStyle="dots"
        value={code}
        size={250}
        quietZone={5}
        removeQrCodeBehindLogo
        logoPaddingStyle="square"
      />
      <Button onClick={handleNext} className="w-[250px]">
        Next
      </Button>
    </div>
  );
};
