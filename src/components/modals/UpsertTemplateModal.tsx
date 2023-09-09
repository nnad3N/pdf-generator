"use client";

import { Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { type TemplateSchema, templateSchema } from "@/utils/schemas";
import { api } from "@/utils/api";
import { type Template } from "@/app/templates/page";
import fileToBase64 from "@/utils/base64";
import TemplateVariables from "@/components/TemplateVariables";
import Button from "@/components/buttons/Button";
import FileInput from "@/components/form/FileInput";
import Input from "@/components/form/Input";
import ModalRoot, { ModalControlsWrapper } from "@/components/modals/ModalRoot";

const defaultValues: TemplateSchema = {
  name: "",
  filename: "",
  variables: [
    {
      label: "",
      name: "",
      type: "text",
    },
  ],
};

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  template: Template | null;
}

const UpsertTemplateModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  template,
}) => {
  const methods = useForm<TemplateSchema>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(templateSchema),
    defaultValues,
    values: template
      ? {
          templateId: template.id,
          name: template.name,
          filename: template.filename,
          variables: template.variables,
        }
      : defaultValues,
  });

  const {
    setValue,
    trigger,
    setError,
    getValues,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = methods;

  const utils = api.useContext();
  const { mutate: upsert, isLoading } = api.template.upsert.useMutation({
    async onSuccess() {
      await Promise.all([
        utils.template.getAll.invalidate(),
        utils.pdf.getTemplates.invalidate(),
      ]);
      setIsOpen(false);
    },
  });

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const filename = file.name ? file.name : "";
      setValue("filename", filename, { shouldDirty: true });
      await trigger("filename");

      if (errors.filename) return;

      try {
        const base64String = await fileToBase64(file);
        setValue("file", base64String, { shouldDirty: true });
      } catch (error) {
        console.error(error);
        setError("filename", { message: "Could not upload file." });
      }
    }
  };

  return (
    <ModalRoot isOpen={isOpen} setIsOpen={setIsOpen}>
      <Dialog.Panel
        as="form"
        onSubmit={handleSubmit((template) => upsert(template))}
        className="modal-box flex max-w-4xl flex-col gap-y-4"
      >
        <Input
          label="Template Name"
          {...register("name")}
          error={errors.name}
        />
        <FileInput
          handleFile={handleFile}
          filename={getValues("filename")}
          error={errors.filename}
        />
        <FormProvider {...methods}>
          <TemplateVariables />
        </FormProvider>
        <ModalControlsWrapper>
          <Button onClick={() => setIsOpen(false)} intent="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty} isLoading={isLoading}>
            {template ? "Update" : "Create"}
          </Button>
        </ModalControlsWrapper>
      </Dialog.Panel>
    </ModalRoot>
  );
};

export default UpsertTemplateModal;
