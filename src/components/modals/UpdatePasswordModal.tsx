import { Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/utils/api";
import PasswordInput from "../form/PasswordInput";
import ModalRoot, { ModalControlsWrapper } from "./ModalRoot";
import Button from "../buttons/Button";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
}

const PasswordModal: React.FC<Props> = ({ isOpen, setIsOpen, email }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<{
    password: string;
  }>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(
      z.object({
        password: z.string().min(1, "Password is required."),
      }),
    ),
    shouldUnregister: true,
  });

  const { mutate: updatePassword, isLoading } =
    api.user.updatePassword.useMutation({
      onSuccess() {
        setIsOpen(false);
      },
    });

  return (
    <ModalRoot isOpen={isOpen} setIsOpen={setIsOpen}>
      <Dialog.Panel
        as="form"
        onSubmit={handleSubmit(({ password }) =>
          updatePassword({ email, password }),
        )}
        className="modal-box flex w-96 flex-col gap-y-4"
      >
        <PasswordInput
          label="New Password"
          {...register("password")}
          error={errors.password}
        />
        <ModalControlsWrapper>
          <Button onClick={() => setIsOpen(false)} intent="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty} isLoading={isLoading}>
            Update
          </Button>
        </ModalControlsWrapper>
      </Dialog.Panel>
    </ModalRoot>
  );
};

export default PasswordModal;
