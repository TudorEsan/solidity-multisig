import { CircularProgress } from "@nextui-org/react";
import React from "react";

export const LoadingScreen = () => {
  return (
    <div className="h-[80vh] flex items-center justify-center">
      <CircularProgress size="lg" />
    </div>
  );
};
