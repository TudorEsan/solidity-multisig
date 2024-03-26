import { useFormContext } from "react-hook-form";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { SearchIcon } from "@heroicons/react/solid";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

import { Button } from "../button";

import { SelectableTokenList } from "./selectable-token-list";
import { Token } from "@/types/token.type";
import { TokenImage } from "@/components/token-image";

const priorityTokens = [
  "ETH",
  "USDC",
  "USDT",
  "SEGLD",
  "WBTC",
  "WETH",
  "HTM",
  "MEX",
  "TADA",
  "ITHEUM",
  "ASH",
  "DAI",
  "RIDE",
  "UTK",
  "CYBER",
  "ONE",
  "CRT",
];

const prioritizeToken = (token: Token) => {
  const index = priorityTokens.indexOf(token.identifier.split("-")[0]);
  return index !== -1 ? index : priorityTokens.length;
};

interface InputProps {
  name: string;
  tokens: Token[];
  hiddenTokens?: string[];
  label?: string;
  withoutErrorMessage?: boolean;
  placeholder?: string;
  className?: string;
  defaultValue?: Token | null;
}

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Props {
  select: InputProps;
  root?: RootProps;
}

export const ControlledTokenSelectModal = ({ select, root }: Props) => {
  const form = useFormContext();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const searchDeferred = useDeferredValue(search);
  const inputRef = useRef<HTMLInputElement>(null);

  const tokens = useMemo(() => {
    const sortedTokens = select.tokens.sort((a, b) => {
      return prioritizeToken(a) - prioritizeToken(b);
    });

    const filtered = sortedTokens.filter((token) => {
      return (
        token.identifier.toLowerCase().includes(searchDeferred.toLowerCase()) &&
        !select.hiddenTokens?.includes(token.identifier)
      );
    });
    return filtered;
  }, [searchDeferred, select.hiddenTokens, select.tokens]);

  const findItemByIdentifier = (identifier?: string) => {
    if (!identifier) {
      return undefined;
    }
    const item = select.tokens.find((item) => item.identifier === identifier);
    return item;
  };

  useEffect(() => {
    if (select.tokens.length > 0) {
      if (select.defaultValue !== undefined) {
        const identifier = select.defaultValue?.identifier;
        const item = findItemByIdentifier(identifier);
        form.setValue(select.name, item);
        return;
      }
      const token = select.tokens[0];
      form.setValue(select.name, token);
    }
  }, [select.tokens]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const token = tokens[0];
      form.setValue(select.name, token);
      onClose();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div
      className="button-disabled-cursor-default flex flex-col space-y-1"
      {...root}
    >
      <div className={cn("flex  rounded-md ")}>
        <FormField
          control={form.control}
          name={select.name}
          render={({ field }) => {
            return (
              <FormItem className={cn("flex-1", select.className)}>
                {select.label && <FormLabel>{select.label}</FormLabel>}
                <Button
                  variant="outline"
                  type="button"
                  className={cn(
                    "w-[150px] rounded-lg shadow-none border-none hover:bg-neutral-100 dark:hover:bg-neutral-800 flex justify-between items-center h-12 p-2",
                    !field.value && "text-muted-foreground"
                  )}
                  onClick={onOpen}
                >
                  {!field.value && select.placeholder}
                  {field.value && (
                    <div className="flex items-center space-x-2">
                      <TokenImage
                        tokenUrl={field.value?.url}
                        identifier={field.value?.identifier}
                        className="w-9 h-9"
                      />
                      <p className="text-lg">
                        {field.value?.identifier?.split("-")[0]}
                      </p>
                    </div>
                  )}
                  <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Modal
                  isKeyboardDismissDisabled
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  // className="lg:absolute lg:top-1/3 lg:left-[55%] lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2"
                >
                  <ModalContent>
                    <ModalHeader>Select Token</ModalHeader>
                    <ModalBody className="p-2">
                      <Input
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        size="sm"
                        ref={inputRef}
                        value={search}
                        placeholder="Search token"
                        startContent={<SearchIcon className="w-4 h-4" />}
                      />
                    </ModalBody>
                    <SelectableTokenList
                      tokens={tokens}
                      name={select.name}
                      onClick={onClose}
                    />
                  </ModalContent>
                </Modal>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    </div>
  );
};
