"use client";

import { type SignInSchema, signInSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import ActionButton from "@/components/ActionButton";
import FormInput from "@/components/form/FormInput";

const SignIn = () => {
  const router = useRouter();

  const form = useForm<SignInSchema>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(signInSchema),
  });

  const { handleSubmit, setError } = form;

  const { mutate: signIn, isPending } = api.user.signIn.useMutation({
    onSuccess() {
      router.refresh();
    },
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
    <Form {...form}>
      <form
        onSubmit={handleSubmit((data) => signIn(data))}
        className="flex flex-col gap-y-2"
      >
        <FormInput control={form.control} name="email" label="Email" />
        <FormInput
          control={form.control}
          name="password"
          label="Password"
          type="password"
        />
        <ActionButton
          className="mt-2 w-full"
          isPending={isPending}
          pendingText="Signing in..."
        >
          Sign In
        </ActionButton>
      </form>
    </Form>
  );
};

export default SignIn;
