"use client";

import { type SignInSchema, signInSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import clsx from "clsx";

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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SignInButton className="mt-2" isPending={isPending} />
      </form>
    </Form>
  );
};

export default SignIn;

interface SignInButtonProps {
  className: string;
  isPending: boolean;
}

const SignInButton: React.FC<SignInButtonProps> = ({
  isPending,
  className,
}) => {
  return (
    <>
      {isPending ? (
        <Button className={clsx("w-full", className)} disabled>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </Button>
      ) : (
        <Button type="submit" className={clsx("w-full", className)}>
          Sign In
        </Button>
      )}
    </>
  );
};
