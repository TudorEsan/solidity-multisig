import { Button } from "@/components/ui/button";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import { generateTOTP } from "@/lib/atlas";
import { CircularProgress } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QRCode } from "react-qrcode-logo";

export const ScanQr = ({ handleNext }: { handleNext: () => void }) => {
  const { address } = useGetSelectedWallet();
  const qrCode = useQuery({
    queryKey: ["qrCode", address],
    queryFn: () => generateTOTP(address),
  });

  if (qrCode.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 items-center">
      <QRCode
        qrStyle="dots"
        value={qrCode.data}
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
