"use client";

import { type RouterOutputs, api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { type PDFSchema, pdfSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/form/FormInput";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ActionButton from "@/components/ActionButton";
import Combobox from "@/components/Combobox";
import { Separator } from "@/components/ui/separator";

interface SavePDF {
  filename: string;
  file: string;
}

const savePDF = ({ file, filename }: SavePDF) => {
  const blob = new Blob([Buffer.from(file, "base64")], {
    type: "application/pdf",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export type PDFTemplate = RouterOutputs["pdf"]["getTemplates"][number];

const CreatePDF = () => {
  const [templates] = api.pdf.getTemplates.useSuspenseQuery();

  const form = useForm<PDFSchema>({
    mode: "onSubmit",
    resolver: zodResolver(pdfSchema),
    defaultValues: {
      templateId: templates[0]?.id,
      filename: "",
      variables: templates[0]?.variables.map(({ id, label, name, type }) => ({
        id,
        label,
        name,
        value: "",
        type,
      })),
    },
    values: templates[0]
      ? {
          templateId: templates[0].id,
          filename: "",
          variables: templates[0].variables.map(
            ({ id, label, name, type }) => ({
              id,
              label,
              name,
              value: "",
              type,
            }),
          ),
        }
      : undefined,
  });

  const { setValue, watch, handleSubmit } = form;
  const variables = watch("variables");

  const { mutate: createPDF, isPending } = api.pdf.create.useMutation({
    onSuccess: savePDF,
  });

  return (
    <div className="w-full max-w-xl rounded-lg border px-5 pb-5 pt-1.5 shadow-sm">
      <Form {...form}>
        <form
          className="mt-2 flex flex-col gap-x-4 gap-y-2"
          onSubmit={handleSubmit((data) => createPDF(data))}
        >
          <div className="flex justify-between">
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <Combobox
                    items={templates.map((template) => ({
                      value: template.id,
                      label: template.name,
                    }))}
                    selectedItem={field.value}
                    setSelectedItem={(selectedTemplateId) => {
                      const newVariables = templates.find(
                        (template) => template.id === selectedTemplateId,
                      )?.variables;

                      if (newVariables) {
                        setValue(
                          "variables",
                          newVariables.map((variable) => ({
                            ...variable,
                            value: "",
                          })),
                        );
                      }

                      field.onChange(selectedTemplateId);
                    }}
                    selectText="Select template"
                    className="w-64"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormInput
              control={form.control}
              name="filename"
              label="Filename"
              className="w-64"
            />
          </div>
          {/* currentTemplate.variables can be undefined if there isn't any templates yet */}
          {variables && (
            <>
              <Separator className="mb-1.5 mt-2" />
              <div className="grid grid-cols-[auto_auto] justify-between gap-x-4 gap-y-2">
                {variables.map(({ id, label, type }, index) => (
                  <FormInput
                    key={id}
                    control={form.control}
                    name={`variables.${index}.value`}
                    label={label}
                    type={type}
                    className="w-64"
                  />
                ))}
              </div>
            </>
          )}
          <ActionButton
            className="mt-4"
            type="submit"
            isPending={isPending}
            pendingText="Generating..."
          >
            Generate PDF
          </ActionButton>
        </form>
      </Form>
    </div>
  );
};

export default CreatePDF;
