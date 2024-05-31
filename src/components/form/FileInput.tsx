"use client";

import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  FormControl,
  FormFieldContext,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface Props<TName> {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: TName;
}

const FileInput = <TFieldValues extends FieldValues = FieldValues>({
  handleFileChange,
  name,
}: Props<FieldPath<TFieldValues>>) => {
  const {
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext();
  const filename = getValues(name);

  return (
    <FormFieldContext.Provider value={{ name }}>
      <FormItem>
        <label
          htmlFor={`${name}-file`}
          className="group relative flex h-9 w-full cursor-default items-center text-sm"
        >
          <span className="flex h-full items-center rounded-l-md bg-muted px-3 py-1 font-medium transition-colors group-hover:bg-muted/90">
            Choose file
          </span>
          <span
            aria-label="Filename"
            className="w-56 flex-1 truncate px-3 py-1 text-left"
          >
            {filename || "No file chosen"}
          </span>

          <FormControl>
            <input
              onChange={async (e) => {
                const filename = e.target.files?.[0]?.name;
                if (!filename) return;

                setValue("filename", filename, { shouldDirty: true });
                await trigger("filename");

                if (errors[name]) return;

                handleFileChange(e);
              }}
              type="file"
              id={`${name}-file`}
              // File input text is transparent but is still accessible to screen readers, so we hide the duplicated file name
              aria-hidden
              className="absolute inset-0 cursor-pointer rounded-md border border-input text-transparent shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed [&::file-selector-button]:hidden"
            />
          </FormControl>
        </label>
        <FormMessage />
      </FormItem>
    </FormFieldContext.Provider>
  );
};

export default FileInput;
