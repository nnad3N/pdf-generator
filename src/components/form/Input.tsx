"use client";

import { forwardRef } from "react";
import { type FieldError } from "react-hook-form";
import InputError from "@/components/form/InputError";

interface Props extends React.ComponentProps<"input"> {
  label?: string;
  error?: FieldError;
}

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className, ...rest },
  ref,
) {
  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        className={`input input-bordered ${
          error ? "input-error" : ""
        } ${className}`}
        ref={ref}
        {...rest}
      />
      {error?.message && <InputError message={error.message} />}
    </div>
  );
});

export default Input;
