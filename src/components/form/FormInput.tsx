"use client";

import {
  type WithControllerProps,
  formFieldPropsKeys,
} from "@/components/form/shared";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { splitProps } from "@/lib/splitProps";
import type { FieldValues, FieldPath } from "react-hook-form";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FormInput = <
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
        <FormItem>
          <FormLabel>{baseProps.label}</FormLabel>
          <FormControl>
            <Input {...inputProps} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
