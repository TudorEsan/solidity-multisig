import type { InputProps } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import React from "react";
import { useController, useFormContext } from "react-hook-form";

interface ControlledInputProps extends Omit<InputProps, "name"> {
  name: string;
  withoutErrorMessage?: boolean;
}

/**
 * Renders a controlled input component.
 *
 * @param name - The name of the input field.
 * @param withoutErrorMessage - Optional. If set to `true`, the error message will not be displayed.
 * @param rest - Additional props to be passed to the `Input` component.
 * @returns The controlled input component.
 */
export function ControlledInput({
  name,
  withoutErrorMessage = false,
  ...rest
}: ControlledInputProps) {
  const form = useFormContext();
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    name,
    control: form.control,
  });

  return (
    <Input
      defaultValue={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value ?? ""}
      name={field.name}
      inputRef={field.ref}
      isInvalid={invalid}
      errorMessage={
        !withoutErrorMessage && (invalid ? error?.message : undefined)
      }
      {...rest}
    />
  );
}
