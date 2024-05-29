import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/trpc/react";
import PasswordInput from "@/components/form/PasswordInput";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Form } from "@/components/ui/form";
import ActionButton from "@/components/ActionButton";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
}

const PasswordModal: React.FC<Props> = ({ isOpen, setIsOpen, userId }) => {
  const form = useForm<{
    password: string;
  }>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(
      z.object({
        password: z.string().min(1, "Password is required."),
      }),
    ),
    defaultValues: {
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isDirty },
  } = form;

  const { mutate: updatePassword, isPending } =
    api.user.updatePassword.useMutation({
      onSuccess() {
        setIsOpen(false);
      },
    });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="modal-box flex w-96 flex-col gap-y-4">
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

            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <ActionButton
                type="submit"
                disabled={!isDirty}
                isPending={isPending}
                pendingText="Updating"
              >
                Update
              </ActionButton>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasswordModal;
