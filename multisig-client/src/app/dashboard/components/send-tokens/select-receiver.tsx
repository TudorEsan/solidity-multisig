import { ScrollShadow, Skeleton, Tab, Tabs } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useCustomAnimations } from "@/hooks/useAnimations";
import { SendTokenSchema } from "@/validations/send-token-schema";
import { Contacts } from "@/types/transactions.types";
import { useGetContacts } from "@/hooks/useGetContacts";
import { DisplayAddress } from "@/components/display-address";
import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import { ethers } from "ethers";
import { toast } from "sonner";

const DisplayAddressSkeleton = () => {
  return (
    <div className="flex gap-2 items-center w-full rounded-md p-2">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex flex-col items-start">
        <Skeleton className="w-16 h-4 bg-neutral-200 rounded-md" />
        <Skeleton className="w-24 h-4 bg-neutral-200 rounded-md mt-1" />
      </div>
    </div>
  );
};

const Recents = ({
  handleSelect,
}: {
  handleSelect: (address: Contacts) => void;
}) => {
  const recentTransfers = useGetContacts();

  if (recentTransfers.isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <DisplayAddressSkeleton key={`${i}-skeleton-receiver`} />
        ))}
      </div>
    );
  }

  if (recentTransfers.data?.length === 0 || !recentTransfers.data) {
    return (
      <div className="flex flex-col items-center jusify-center max-w-xs w-full mx-auto mt-4">
        <p className="text-base text-center font-bold">
          No Recent Transactions
        </p>
        <p className="text-muted-foreground text-center text-sm">
          Your transaction history is currently empty. After you initiate and
          complete a transfer, your most recent destinations will be displayed
          here for easy access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <ScrollShadow className="h-[175px]">
        {recentTransfers.data.map((item) => (
          <button
            type="button"
            key={"select-recent-" + item.address}
            className="hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md w-full p-2"
            onClick={() => handleSelect(item)}
          >
            <DisplayAddress
              key={`${item.address}-select-recipient`}
              address={item.address}
            />
          </button>
        ))}
      </ScrollShadow>
    </div>
  );
};

export const SelectRecipient = ({ next }: { next: () => void }) => {
  const form = useFormContext<SendTokenSchema>();
  const values = form.watch();
  const { shake, controls } = useCustomAnimations();

  const buttonDisabled = !values.toAddress;

  const handleNext = async () => {
    const isAddressValid = ethers.isAddress(values.toAddress);
    if (isAddressValid) {
      next();
    } else {
      toast.error("Invalid address");
      shake();
    }
  };

  const handleSelect = async (to: Contacts) => {
    form.setValue("toAddress", to.address, {
      shouldValidate: true,
    });
    next();
  };

  return (
    <div>
      <ControlledInput
        name="toAddress"
        label="Recipient"
        placeholder="Address"
      />
      <Tabs variant="underlined" aria-label="Tabs variants" className="mt-4">
        <Tab title="Recents">
          <Recents handleSelect={handleSelect} />
        </Tab>
        <Tab title="Contacts">
          <p className="mt-4 text-muted-foreground">Coming Soon.</p>
        </Tab>
      </Tabs>
      <motion.div animate={controls} className="w-full mt-8 max-w-xs mx-auto">
        <Button
          type="button"
          onClick={handleNext}
          className="w-full"
          disabled={buttonDisabled}
        >
          Next
        </Button>
      </motion.div>
    </div>
  );
};
