"use client";

import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import { type LoginSchema, loginSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { loginAction } from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/buttons/Button";

const LoginForm = () => {
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const router = useRouter();

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
    setFormError(undefined);
    try {
      const res = await loginAction(data);
      switch (res.code) {
        case "SUCCESS":
          router.refresh();

          break;
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
      <Button type="submit" className="mt-4">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
