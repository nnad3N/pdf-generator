"use client";

import { type FieldError } from "react-hook-form";
import InputError from "./InputError";

interface Props {
  filename?: string;
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: FieldError;
}

const FileInput: React.FC<Props> = ({ filename, handleFile, error }) => {
  return (
    <div className="form-control pt-2">
      <button
        type="button"
        className={`focus-visible:outline-offset-3 w-full focus-visible:rounded-sm focus-visible:outline-none ${
          error ? "focus-visible:outline-error" : "focus-visible:outline-accent"
        }`}
      >
        <label
          htmlFor="file"
          className={`flex h-12 cursor-pointer rounded-sm border ${
            error ? "border-error" : "border-accent"
          }`}
        >
          <span
            className={`flex items-center px-4 text-sm font-medium uppercase ${
              error ? "bg-error" : "bg-accent text-base-100"
            }`}
          >
            Choose file
          </span>
          <span className="mx-4 my-auto w-56 flex-1 truncate text-left">
            {!filename ? "No file chosen" : filename}
          </span>
          <input
            onChange={(e) => handleFile(e)}
            type="file"
            id="file"
            className="hidden"
          />
        </label>
      </button>
      {error?.message && <InputError message={error.message} />}
    </div>
  );
};

export default FileInput;
