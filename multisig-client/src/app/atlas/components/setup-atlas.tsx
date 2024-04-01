"use client";
import { Button } from "@/components/ui/button";
import { useMultistepForm } from "@/hooks/useMultistepForm";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";
import React from "react";
import { ScanQr } from "./setup-atlas/components/scan-qr";
import { ValidateOTP } from "./setup-atlas/components/validate-otp";

export const Setup2fa = () => {
  const disclosure = useDisclosure();
  const { next, step, back } = useMultistepForm([
    <ScanQr key="qr" handleNext={() => next()} />,
    <ValidateOTP key="otp" handleNext={() => next()} handleBack={() => back()} />,
  ]);
  return (
    <>
      <Button onClick={disclosure.onOpen}>Setup Atlas</Button>
      <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
        <ModalContent>
          <ModalHeader>Setup Atlas</ModalHeader>
          <ModalBody>
            <div className="h-[350px] p-4">{step}</div>
          </ModalBody>
        </ModalContent>
        <ModalFooter />
      </Modal>
    </>
  );
};
