"use client";

import {
  type WithControllerProps,
  formFieldPropsKeys,
} from "@/components/form/shared";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { splitProps } from "@/lib/splitProps";
import type { CheckboxProps } from "@radix-ui/react-checkbox";
import type { FieldValues, FieldPath } from "react-hook-form";

interface Props extends Omit<CheckboxProps, "checked" | "onCheckedChange"> {
  label: string;
}

const CheckboxInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: WithControllerProps<Props, TFieldValues, TName>,
) => {
  const [baseProps, formFieldProps, inputProps] = splitProps(
    props,
    ["label"],
    formFieldPropsKeys,
  );

  return (
    <FormField
      {...formFieldProps}
      render={({ field }) => (
        <FormItem className="flex items-center gap-x-2 space-y-0">
          <FormLabel>{baseProps.label}</FormLabel>
          <FormControl>
            <Checkbox
              {...inputProps}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default CheckboxInput;
