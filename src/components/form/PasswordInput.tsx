"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { splitProps } from "@/lib/splitProps";
import {
  type WithControllerProps,
  formFieldPropsKeys,
} from "@/components/form/shared";

interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

const PasswordInput = <
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

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <FormField
      {...formFieldProps}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{baseProps.label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...inputProps}
                {...field}
                type={isPasswordVisible ? "text" : "password"}
              />
              <Button
                className="absolute right-1 top-1/2 -translate-y-1/2"
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() =>
                  setIsPasswordVisible(
                    (isPasswordVisible) => !isPasswordVisible,
                  )
                }
              >
                {isPasswordVisible ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordInput;
