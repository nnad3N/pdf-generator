"use client";

import { Trash2Icon, PlusIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { type TemplateSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FormInput from "@/components/form/FormInput";
import SelectInput from "@/components/form/SelectInput";
import { SelectItem } from "@/components/ui/select";

const TemplateVariables = () => {
  const formContext = useFormContext<TemplateSchema>();

  const { fields, append, remove } = useFieldArray({
    control: formContext.control,
    name: "variables",
  });

  return (
    <div className="rounded-md border px-3 py-4">
      <Table>
        <TableHeader>
          <TableRow className="border-none [&_th]:h-6 [&_th]:text-center">
            <TableHead>Label</TableHead>
            <TableHead>Variable</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="w-0"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow className="border-none [&_td]:align-top" key={field.id}>
              <TableCell>
                <FormInput
                  name={`variables.${index}.label`}
                  placeholder="My Variable"
                />
              </TableCell>
              <TableCell>
                <FormInput
                  name={`variables.${index}.name`}
                  placeholder="{{my_variable}}"
                />
              </TableCell>
              <TableCell>
                <SelectInput
                  control={formContext.control}
                  name={`variables.${index}.type`}
                  placeholder="Select"
                  className="min-w-24"
                >
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectInput>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => remove(index)}
                  variant="ghost"
                  size="icon"
                >
                  <Trash2Icon className="h-5 w-5 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center">
        <Button
          onClick={() =>
            append({
              label: "",
              name: "",
              type: "text",
            })
          }
          variant="ghost"
          className="mt-1"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          New variable
        </Button>
      </div>
    </div>
  );
};

export default TemplateVariables;
