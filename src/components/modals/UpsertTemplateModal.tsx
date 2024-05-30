"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type TemplateSchema, templateSchema } from "@/lib/schemas";
import { api } from "@/trpc/react";
import { type Template } from "@/app/templates/page.client";
import { fileToBase64 } from "@/lib/base64";
import TemplateVariables from "@/components/TemplateVariables";
import FileInput from "@/components/form/FileInput";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import ActionButton from "@/components/ActionButton";
import FormInput from "@/components/form/FormInput";

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
  const form = useForm<TemplateSchema>({
    mode: "onBlur",
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
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const utils = api.useUtils();
  const { mutate: upsert, isPending } = api.template.upsert.useMutation({
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent onCloseAutoFocus={() => reset()} className="max-w-4xl">
        <Form {...form}>
          <form
            onSubmit={handleSubmit((template) => upsert(template))}
            className="flex flex-col gap-y-4"
          >
            <FormInput
              control={form.control}
              name="name"
              label="Template Name"
            />
            <FileInput
              handleFile={handleFile}
              filename={getValues("filename")}
              error={errors.filename}
            />
            <TemplateVariables />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <ActionButton
                type="submit"
                disabled={!isDirty}
                isPending={isPending}
                pendingText={template ? "Updating..." : "Creating..."}
              >
                {template ? "Update" : "Create"}
              </ActionButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertTemplateModal;
