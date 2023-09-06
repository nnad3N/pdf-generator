"use client";

import { Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type TemplateSchema, templateSchema } from "@/utils/schemas";
import { api } from "@/utils/api";
import Input from "../form/Input";
import { type Template } from "@/app/templates/page";
import ModalRoot from "./ModalRoot";
import { useEffect } from "react";
import FileInput from "../form/FileInput";
import toBase64 from "@/utils/toBase64";
// import toBase64 from "@/utils/toBase64";

const defaultValues: TemplateSchema = {
  name: "",
  filename: "",
  variables: [],
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
  const {
    reset,
    setValue,
    trigger,
    setError,
    getValues,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TemplateSchema>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(templateSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(
      template
        ? {
            name: template.name,
            filename: template.filename,
            variables: template.variables,
          }
        : defaultValues,
    );
    //eslint-disable-next-line
  }, [template]);

  // const utils = api.useContext();
  // const { mutate: upsert } = api.user.upsert.useMutation({
  //   async onSuccess() {
  //     await utils.user.getAll.invalidate();
  //     setIsOpen(false);
  //   },
  // });

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const filename = file.name ? file.name : "";
      setValue("filename", filename, { shouldDirty: true });
      await trigger("filename");

      if (errors.filename) return;

      try {
        const base64String = await toBase64(file);
        console.log(base64String);
        // store.setFile(base64String);
        // setIsFileInputDirty(true);
      } catch (error) {
        console.error(error);
        setError("filename", { message: "Could not upload file." });
      }
    }
    event.target.value = "";
  };

  return (
    <ModalRoot isOpen={isOpen} setIsOpen={setIsOpen}>
      <Dialog.Panel
        as="form"
        onSubmit={handleSubmit((data) => console.log(data))}
        className="modal-box flex w-96 flex-col gap-y-2"
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

        <div className="mt-4 flex justify-between">
          <button onClick={() => setIsOpen(false)} className="btn btn-outline">
            Cancel
          </button>
          <button
            disabled={!isDirty || Object.keys(errors).length !== 0}
            type="submit"
            className="btn btn-primary"
          >
            Submit
          </button>
        </div>
      </Dialog.Panel>
    </ModalRoot>
  );
};

export default UpsertTemplateModal;
