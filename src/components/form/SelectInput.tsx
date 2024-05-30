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
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { splitProps } from "@/lib/splitProps";
import type { FieldValues, FieldPath } from "react-hook-form";

interface Props {
  label?: string;
  placeholder: string;
  className?: string;
}

const SelectInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: React.PropsWithChildren<
    WithControllerProps<Props, TFieldValues, TName>
  >,
) => {
  const [baseProps, formFieldProps] = splitProps(
    props,
    ["children", "label", "placeholder", "className"],
    formFieldPropsKeys,
  );

  return (
    <FormField
      {...formFieldProps}
      render={({ field }) => (
        <FormItem>
          {baseProps.label && <FormLabel>{baseProps.label}</FormLabel>}
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={baseProps.className}>
                  <SelectValue placeholder={baseProps.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>{baseProps.children}</SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectInput;
