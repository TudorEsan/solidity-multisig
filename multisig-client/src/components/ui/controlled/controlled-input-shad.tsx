import { useFormContext } from "react-hook-form";
import React from "react";

import { cn } from "@/lib/utils";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import type { InputProps } from "../input";
import { Input } from "../input";

interface IControlledInputProps extends InputProps {
  name: string;
  label?: string;
  description?: string;
  inputStyles?: string;
  className?: string;
  placeholder?: string;
  readonly?: boolean;
  symbol?: React.ReactNode;
  disabled?: boolean;
  withoutErrorMessage?: boolean;
  startAdornment?: React.ReactNode;
  valueFormatter?: (value: string) => string;
  inputRef?: React.Ref<HTMLInputElement>;
}

export const ControlledInput = ({
  name,
  label,
  description,
  inputStyles,
  placeholder,
  type,
  readonly,
  symbol,
  className,
  startAdornment,
  disabled = false,
  withoutErrorMessage = false,
  valueFormatter,
  ...rest
}: IControlledInputProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn(className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative flex ">
              <div className="absolute left-3 top-1/2 transform -translate-x-1/2  flex items-center ">
                {startAdornment && (
                  <div className="absolute left-0  flex items-center h-5 w-5">
                    {startAdornment}
                  </div>
                )}
              </div>
              <Input
                disabled={disabled}
                readOnly={readonly}
                placeholder={placeholder}
                {...field}
                type={type}
                value={field.value || ""}
                className={cn(
                  inputStyles,
                  startAdornment && "pl-9",
                  fieldState.error && "border-destructive"
                )}
                onChange={(e) => {
                  let { value } = e.target;
                  if (valueFormatter) {
                    value = valueFormatter(value);
                  }
                  field.onChange(value);
                }}
                {...rest}
              />
              {symbol && (
                <div className="absolute flex right-0 bottom-0 top-0 items-center">
                  <span className="mr-3 text-slate-400 opacity-70">
                    {symbol}
                  </span>
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {!withoutErrorMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
};
