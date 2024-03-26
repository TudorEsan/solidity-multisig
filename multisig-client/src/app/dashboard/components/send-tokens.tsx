import { ArrowUpIcon } from '@heroicons/react/solid';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { Modal, ModalContent } from '@nextui-org/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';


import { SelectWalletTokenAmountWidget } from '../ui/controlled/select-wallet-token-amount-widget';

import { SelectRecipient } from './select-recepient';
import { ReviewTokenSend } from './review-token-send';

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
  const walletTokens = useGetAccountTokens();
  const { next, back, step, currentStepIndex, isFirstStep } = useMultistepForm([
    <SelectWalletTokenAmountWidget
      walletTokens={walletTokens.data ?? []}
      isLoading={walletTokens.isLoading}
      next={() => next()}
    />,
    <SelectRecipient next={() => next()} />,
    <ReviewTokenSend
      close={() => {
        onClose();
      }}
    />,
  ]);

  const getTitle = () => {
    if (currentStepIndex === 0) {
      return 'Send';
    }
    if (currentStepIndex === 1) {
      return 'Select Recipient';
    }
    return 'Review';
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
  const handleOpen = useModalStore(s => s.showSendTokens);
  return (
    <button
      type="button"
      onClick={() => {
        handleOpen();
        onClick?.();
      }}
    >
      <div className="flex flex-col items-center gap-1">
        <Button size="icon" className="rounded-full bg-sky-500">
          <ArrowUpIcon className="w-6 h-6 text-white" />
        </Button>
        <p className="text-sm font-light">Send</p>
      </div>
    </button>
  );
};

export const SendTokensModal = () => {
  const { isOpen, onOpenChange } = useModalStore(s => ({
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
