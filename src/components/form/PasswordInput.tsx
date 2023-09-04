"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { type InputHTMLAttributes, forwardRef, useState } from "react";
import { type FieldError } from "react-hook-form";
import InputError from "./InputError";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  function PasswordInput({ label, error, className = "", ...rest }, ref) {
    const [isChecked, setIsChecked] = useState(true);

    return (
      <div className="form-control">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <div className="relative">
          <input
            className={`input input-bordered w-full ${
              error ? "input-error" : ""
            } ${className}`}
            ref={ref}
            {...rest}
            type={isChecked ? "text" : "password"}
          />
          <button
            type="button"
            onClick={() => setIsChecked((isChecked) => !isChecked)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-primary p-1 hover:bg-primary-focus"
          >
            {isChecked ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {error?.message && <InputError message={error.message} />}
      </div>
    );
  },
);

export default PasswordInput;
