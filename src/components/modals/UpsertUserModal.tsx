"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type UserSchema, userSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { api } from "@/trpc/react";
import PasswordInput from "@/components/form/PasswordInput";
import { type User } from "@/app/admin/page.client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/FormInput";
import ActionButton from "@/components/ActionButton";
import CheckboxInput from "@/components/form/CheckboxInput";
import { toast } from "sonner";

const defaultValues: UserSchema = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  isAdmin: false,
};

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
}

const UpsertUserModal: React.FC<Props> = ({ isOpen, setIsOpen, user }) => {
  const form = useForm<UserSchema>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(userSchema),
    defaultValues,
    values: user
      ? {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
        }
      : defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isDirty },
  } = form;

  const utils = api.useUtils();
  const { mutate: upsert, isPending } = api.user.upsert.useMutation({
    async onSuccess() {
      setIsOpen(false);
      await utils.user.getAll.invalidate();
    },
    onError(error, variables) {
      if (error.data?.code === "BAD_REQUEST") {
        toast.warning(error.message);
      } else {
        toast.error(
          `Failed to ${variables.userId ? "edit the" : "create new"} user.`,
        );
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent onCloseAutoFocus={() => reset()} className="max-w-sm">
        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={handleSubmit((data) => upsert(data))}
          >
            <FormInput
              control={form.control}
              name="firstName"
              label="First Name"
            />
            <FormInput
              control={form.control}
              name="lastName"
              label="Last Name"
            />
            <FormInput control={form.control} name="email" label="Email" />
            {!user && (
              <PasswordInput
                control={form.control}
                name="password"
                label="Password"
              />
            )}
            <CheckboxInput
              control={form.control}
              name="isAdmin"
              label="Admin"
            />

            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <ActionButton
                type="submit"
                disabled={!isDirty}
                isPending={isPending}
                pendingText={user ? "Updating..." : "Creating..."}
              >
                {user ? "Update" : "Create"}
              </ActionButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertUserModal;
