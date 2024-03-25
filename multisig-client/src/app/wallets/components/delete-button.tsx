"use client";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { deleteWallet } from "../actions";

export const DeleteButton = ({ id }: { id: number }) => {
  return (
    <Button
      size="icon"
      variant="outline"
      type="submit"
      className="hover:text-destructive-foreground"
      onClick={async (e) => {
        e.stopPropagation();
        e.preventDefault();
        await deleteWallet(id);
      }}
    >
      <TrashIcon />
    </Button>
  );
};
