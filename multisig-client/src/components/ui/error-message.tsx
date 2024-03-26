import { cn } from "@/lib/utils";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import React from "react";

interface Props {
  message?: string;
  className?: string;
}

export const ErrorMessage = ({ message, className }: Props) => {
  return (
    <p
      className={cn(
        "flex items-center gap-1 text-[0.8rem] font-medium text-destructive",
        className
      )}
    >
      {" "}
      {message && (
        <>
          <ExclamationCircleIcon className="w-4 h-4" />
          {message}
        </>
      )}
    </p>
  );
};
