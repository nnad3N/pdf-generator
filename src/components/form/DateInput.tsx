"use client";

import { CalendarIcon } from "lucide-react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { splitProps } from "@/lib/splitProps";
import {
  type WithControllerProps,
  formFieldPropsKeys,
} from "@/components/form/shared";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface Props {
  label: string;
  className?: string;
  asString?: boolean;
}

const DateInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: WithControllerProps<Props, TFieldValues, TName>,
) => {
  const [baseProps, formFieldProps] = splitProps(
    props,
    ["label", "className", "asString"],
    formFieldPropsKeys,
  );

  return (
    <FormField
      {...formFieldProps}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{baseProps.label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-60 pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                    baseProps.className,
                  )}
                >
                  <DisplayDate value={field.value} />
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={
                  baseProps.asString
                    ? (date) => {
                        field.onChange(
                          date ? format(date, "dd/MM/yyyy") : undefined,
                        );
                      }
                    : field.onChange
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateInput;

interface DisplayDateProps {
  value: string | Date | undefined | null;
}

const DisplayDate: React.FC<DisplayDateProps> = ({ value }) => {
  if (!value) {
    return <span>Pick a date</span>;
  }

  if (typeof value === "string") {
    return <span>{value}</span>;
  }

  return <span>{format(value, "dd/MM/yyyy")}</span>;
};
