"use client";

import { type RouterOutputs, api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { type PDFSchema, pdfSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import Input from "@/components/form/Input";
import Button from "@/components/Button";

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

  const [selectedTemplate, setSelectedTemplate] = useState<PDFTemplate | null>(
    templates?.[0] ?? null,
  );

  // updating the templates after invalidation
  useEffect(() => {
    setSelectedTemplate(templates?.[0] ?? null);
  }, [templates]);

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<PDFSchema>({
    mode: "onSubmit",
    resolver: zodResolver(pdfSchema),
    values: selectedTemplate
      ? {
          templateId: selectedTemplate.id,
          filename: "",
          variables: selectedTemplate.variables.map(({ name, type }) => ({
            name,
            value: "",
            type,
          })),
        }
      : undefined,
  });

  const { mutate: create, isPending } = api.pdf.create.useMutation({
    onSuccess: savePDF,
  });

  return (
    <div className="rounded-box bg-base-200 w-full max-w-xl p-5">
      <SelectCombobox
        templates={templates}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
      />
      <form
        className="mt-2 flex flex-col gap-y-2"
        onSubmit={handleSubmit((data) => create(data))}
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {selectedTemplate?.variables.map(({ id, label, type }, index) => (
            <Input
              key={id}
              label={label}
              {...register(`variables.${index}.value`)}
              error={errors.variables?.[index]?.value}
              type={type}
            />
          ))}
        </div>
        <Input
          label="Filename"
          {...register("filename")}
          error={errors.filename}
        />
        <Button
          className="mt-4"
          type="submit"
          disabled={!isDirty}
          isLoading={isPending}
          loadingText="Generating"
        >
          Generate PDF
        </Button>
      </form>
    </div>
  );
};

export default CreatePDF;

interface Props {
  templates: PDFTemplate[];
  selectedTemplate: PDFTemplate | null;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<PDFTemplate | null>>;
}

const SelectCombobox: React.FC<Props> = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
}) => {
  const [query, setQuery] = useState("");

  const filteredTemplates =
    query === "" || !templates
      ? templates
      : templates.filter((template) => {
          return template.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox value={selectedTemplate} onChange={setSelectedTemplate}>
      <div className="relative">
        <div className="relative">
          <Combobox.Input
            placeholder="Search"
            className="input input-bordered mr-2 w-full focus:outline-none"
            displayValue={(template: PDFTemplate | null) =>
              template?.name ?? ""
            }
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button
            type="button"
            className="btn btn-ghost hover:text-accent-focus focus-visible:text-accent-focus absolute inset-y-0 right-0 text-accent"
          >
            <ChevronUpDownIcon className="h-5 w-5" />
          </Combobox.Button>
        </div>
        <Combobox.Options className="bg-base-300 absolute mt-2 max-h-60 w-full overflow-auto rounded-sm shadow-lg">
          {filteredTemplates?.length === 0 && query !== "" ? (
            <div className="select-none px-4 py-3 text-center">
              Nothing found.
            </div>
          ) : (
            filteredTemplates?.map((template) => (
              <Combobox.Option
                key={template.id}
                className="ui-active:bg-primary relative cursor-pointer select-none px-4 py-2 transition-colors duration-100"
                value={template}
              >
                <span className="ui-selected:font-medium block truncate">
                  {template.name}
                </span>
                <span className="ui-selected:flex ui-active:text-base-content absolute inset-y-0 right-0 hidden items-center pr-4 text-accent transition-colors duration-100">
                  <CheckIcon className="h-5 w-5" />
                </span>
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};
