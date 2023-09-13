"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { forwardRef, useState } from "react";
import { type FieldError } from "react-hook-form";
import InputError from "@/components/form/InputError";
import { cx } from "class-variance-authority";

interface Props extends React.ComponentProps<"input"> {
  label: string;
  error?: FieldError;
}

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  function PasswordInput({ label, error, className, ...props }, ref) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
      <div className="form-control">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <div className="relative">
          <input
            className={cx(
              "input input-bordered w-full",
              error && "input-error",
              className,
            )}
            ref={ref}
            {...props}
            type={isPasswordVisible ? "text" : "password"}
          />
          <button
            type="button"
            onClick={() =>
              setIsPasswordVisible((isPasswordVisible) => !isPasswordVisible)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-primary p-1 hover:bg-primary-focus"
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {error?.message && (
          <InputError
            data-test={`input-error-${props.name}`}
            message={error.message}
          />
        )}
      </div>
    );
  },
);

export default PasswordInput;
