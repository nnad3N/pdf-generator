"use client";

import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import { type LoginSchema, loginSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { loginAction } from "../actions";
import { useState } from "react";

export default function Page() {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(loginSchema),
  });

  const handleLogin: SubmitHandler<LoginSchema> = async (data) => {
    setFormError(null);
    try {
      const res = await loginAction(data);
      switch (res.code) {
        case "NOT_FOUND":
        case "FORBIDDEN":
          setFormError(res.message);

          break;
        case "UNAUTHORIZED":
          setError("password", {
            message: "Bad password. Please try again.",
          });
          break;

        default:
          setFormError("Unexpected error. Please try again later.");
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="flex w-96 flex-col gap-y-2 rounded-md bg-base-200 px-9 py-7 shadow-md"
    >
      {formError && (
        <span className="text-center font-semibold text-red-500">
          {formError}
        </span>
      )}
      <Input label="Email" {...register("email")} error={errors.email} />
      <PasswordInput
        label="Password"
        {...register("password")}
        error={errors.password}
      />
      <button type="submit" className="btn btn-primary mt-4 w-full">
        Login
      </button>
    </form>
  );
}
