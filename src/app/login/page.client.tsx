"use client";

import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import { type LoginSchema, loginSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Button from "@/components/buttons/Button";
import { useState } from "react";

export const unexpectedErrorString = "An unexpected error occured";

const Login = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.status === 200) {
        router.refresh();
        return;
      }
      const { error } = (await res.json()) as { error: string };

      if (res.status === 401) {
        setError("password", {
          message: error,
        });
        return;
      } else if (res.status === 404) {
        setError("email", {
          message: error,
        });
        return;
      }

      setFormError(error);
    } catch (e) {
      console.error(e);
      setFormError(unexpectedErrorString);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="flex w-96 flex-col gap-y-2 rounded-md bg-base-200 p-6 shadow-md [&_label]:first:pt-0"
    >
      {formError && (
        <span
          data-test="login-form-error"
          className="text-center font-semibold text-red-500"
        >
          {formError}
        </span>
      )}
      <Input label="Email" {...register("email")} error={errors.email} />
      <PasswordInput
        label="Password"
        {...register("password")}
        error={errors.password}
      />
      <Button
        type="submit"
        className="mt-4"
        isLoading={isLoading}
        loadingText="Logging in"
      >
        Login
      </Button>
    </form>
  );
};

export default Login;
