"use client";
import { ArrowUpIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { Modal, ModalContent } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { SendTokenSchema } from "@/validations/send-token-schema";
import { useGetTokenBalance } from "@/hooks/useGetTokenBalance";
import { useMultistepForm } from "@/hooks/useMultistepForm";
import { SelectWalletTokenAmountWidget } from "@/components/ui/controlled/select-wallet-token-amount-widget";
import useModalStore from "@/hooks/useModalStore";
import { SelectRecipient } from "./select-receiver";
import { ReviewTokenSend } from "./review-token-send";

const pageTransitionVariants = {
  initial: {
    opacity: 0,
    scale: 0.99,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 0.99,
  },
};

const SendTokensForm = ({ onClose }: { onClose: () => void }) => {
  const form = useForm<SendTokenSchema>({
    resolver: zodResolver(SendTokenSchema),
  });
  const { tokens, isLoading } = useGetTokenBalance([]);
  const { next, back, step, currentStepIndex, isFirstStep } = useMultistepForm([
    <SelectWalletTokenAmountWidget
      key="select"
      walletTokens={tokens ?? []}
      isLoading={isLoading}
      next={() => next()}
    />,
    <SelectRecipient key="recipient" next={() => next()} />,
    <ReviewTokenSend
      close={() => {
        onClose();
      }}
      key="review"
    />,
  ]);

  const getTitle = () => {
    if (currentStepIndex === 0) {
      return "Send";
    }
    if (currentStepIndex === 1) {
      return "Select Recipient";
    }
    return "Review";
  };

  return (
    <FormProvider {...form}>
      <div className="flex flex-col max-w-md w-full mx-auto p-2 pb-8">
        <div className="relative">
          {!isFirstStep && (
            <Button
              size="icon"
              className="absolute top-1/2 transform -translate-y-1/2 z-10"
              variant="ghost"
              onClick={back}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
          )}
          <h2 className="text-xl font-bold text-center relative">
            {getTitle()}
          </h2>
        </div>
        <form className="w-full max-w-md mx-auto mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageTransitionVariants}
              transition={{ duration: 0.3 }}
            >
              {step}
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </FormProvider>
  );
};

export const SendTokensButton = ({ onClick }: { onClick?: () => void }) => {
  const handleOpen = useModalStore((s) => s.showSendTokens);
  return (
    <Button
      size="icon"
      className="rounded-full"
      onClick={() => {
        onClick?.();
        handleOpen();
      }}
    >
      <ArrowUpIcon className="w-6 h-6" />
    </Button>
  );
};

export const SendTokensModal = () => {
  const { isOpen, onOpenChange } = useModalStore((s) => ({
    isOpen: s.isSendTokensVisible,
    onOpenChange: s.hideSendTokens,
  }));
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent className="pt-4">
        <SendTokensForm onClose={onOpenChange} />
      </ModalContent>
    </Modal>
  );
};
