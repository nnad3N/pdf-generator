"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type UserSchema, userSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { api } from "@/trpc/react";
import PasswordInput from "@/components/form/PasswordInput";
import { type User } from "@/app/admin/page.client";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/FormInput";
import ActionButton from "@/components/ActionButton";
import CheckboxInput from "@/components/form/CheckboxInput";

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
      await utils.user.getAll.invalidate();
      setIsOpen(false);
      reset();
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-96">
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
                <Button onClick={handleClose} variant="outline">
                  Cancel
                </Button>
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
