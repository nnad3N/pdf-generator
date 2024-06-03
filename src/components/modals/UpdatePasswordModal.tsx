"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/trpc/react";
import { Form } from "@/components/ui/form";
import PasswordInput from "@/components/form/PasswordInput";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import ActionButton from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
}

const formSchema = z.object({
  password: z.string().min(1, "Password is required."),
});

const PasswordModal: React.FC<Props> = ({ isOpen, setIsOpen, userId }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isDirty },
  } = form;

  const { mutate: updatePassword, isPending } =
    api.user.updatePassword.useMutation({
      onSuccess() {
        setIsOpen(false);
      },
      onError() {
        toast.error("Failed to update the password.");
      },
    });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent onCloseAutoFocus={() => reset()} className="max-w-sm">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(({ password }) =>
              updatePassword({ userId, password }),
            )}
          >
            <PasswordInput
              control={form.control}
              name="password"
              label="New Password"
            />
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <ActionButton
                type="submit"
                disabled={!isDirty}
                isPending={isPending}
                pendingText="Updating"
              >
                Update
              </ActionButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordModal;
