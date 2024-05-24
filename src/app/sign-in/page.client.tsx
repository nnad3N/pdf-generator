"use client";

import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import { type SignInSchema, signInSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/buttons/Button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInSchema>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(signInSchema),
  });

  const { mutate: signIn, isPending } = api.user.signIn.useMutation({
    onError(error) {
      switch (error.data?.code) {
        case "NOT_FOUND":
          setError("email", {
            message: "Email address not found.",
          });
          break;
        case "UNAUTHORIZED":
          setError("password", {
            message: "Wrong password.",
          });
          break;
        case "FORBIDDEN":
          toast.warning("This account is deactivated.");
          break;
        default:
          toast.error(
            "An unexpected error occured. Please try to sign in later.",
          );
          console.error(error);
          break;
      }
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => signIn(data))}
      className="bg-base-200 flex w-96 flex-col gap-y-2 rounded-md p-6 shadow-md [&_label]:first:pt-0"
    >
      <Input label="Email" {...register("email")} error={errors.email} />
      <PasswordInput
        label="Password"
        {...register("password")}
        error={errors.password}
      />
      <Button
        type="submit"
        className="mt-4"
        isLoading={isPending}
        loadingText="Logging in"
      >
        Sign In
      </Button>
    </form>
  );
};

export default Login;
