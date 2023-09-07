"use client";

import { type RouterOutputs, api } from "@/utils/api";
import { useForm } from "react-hook-form";
import { type PDFSchema, pdfSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import Input from "@/components/form/Input";

export type PDFTemplate = RouterOutputs["pdf"]["getTemplates"][number];

export default function Page() {
  const [templates] = api.pdf.getTemplates.useSuspenseQuery();
  const [selectedTemplate, setSelectedTemplate] = useState<PDFTemplate | null>(
    templates?.[0] ?? null,
  );

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<PDFSchema>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(pdfSchema),
    values: selectedTemplate
      ? {
          variables: selectedTemplate.variables,
        }
      : undefined,
  });

  return (
    <div className="rounded-box w-full max-w-md bg-base-200 p-5">
      <SelectCombobox
        templates={templates}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
      />

      <form
        className="mt-2 flex flex-col gap-y-2"
        onSubmit={handleSubmit((data) => console.log(data))}
      >
        {selectedTemplate?.variables.map(({ id, label, type }, index) => (
          <Input
            key={id}
            label={label}
            {...register(`variables.${index}.value`)}
            error={errors.variables?.[index]?.value}
            type={type}
          />
        ))}
        <button disabled={!isDirty} className="btn btn-primary mt-4">
          Generate PDF
        </button>
      </form>
    </div>
  );
}

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
            className="btn btn-ghost absolute inset-y-0 right-0 text-accent hover:text-accent-focus focus-visible:text-accent-focus"
          >
            <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-sm bg-base-300 shadow-lg">
          {filteredTemplates?.length === 0 && query !== "" ? (
            <div className="select-none px-4 py-3 text-center">
              Nothing found.
            </div>
          ) : (
            filteredTemplates?.map((template) => (
              <Combobox.Option
                key={template.id}
                className="relative cursor-pointer select-none px-4 py-2 transition-colors duration-100 ui-active:bg-primary"
                value={template}
              >
                <span className="block truncate ui-selected:font-medium">
                  {template.name}
                </span>
                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-accent transition-colors duration-100 ui-selected:flex ui-active:text-base-content">
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};
