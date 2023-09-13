"use client";

import { forwardRef } from "react";
import { type FieldError } from "react-hook-form";
import InputError from "@/components/form/InputError";
import { cx } from "class-variance-authority";

interface Props extends React.ComponentProps<"input"> {
  label?: string;
  error?: FieldError;
}

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className, ...props },
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
        className={cx(
          "input input-bordered",
          error && "input-error",
          className,
        )}
        ref={ref}
        {...props}
      />
      {error?.message && (
        <InputError
          data-test={`input-error-${props.name}`}
          message={error.message}
        />
      )}
    </div>
  );
});

export default Input;
