import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import { Button } from "@/components/ui/button";
import { Cross1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { CreateWalletForm } from "@/validations/create-wallet-schema";

export const AddressManagement = () => {
  const form = useFormContext<CreateWalletForm>();
  const addresses = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      {addresses.fields.map((field, index) => (
        <div className="flex gap-2 items-center w-full" key={field.id}>
          <ControlledInput
            size="md"
            name={`addresses.${index}.address`}
            label={`Address ${index + 1}`}
            className="w-full"
          />
          <button type="button" onClick={() => addresses.remove(index)}>
            <Cross1Icon />
          </button>
        </div>
      ))}
      <Button
        variant="secondary"
        onClick={() => addresses.append({ address: "" })}
        size={"icon"}
      >
        <PlusIcon />
      </Button>
    </div>
  );
};
