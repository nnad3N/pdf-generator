import { Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/utils/api";
import PasswordInput from "../form/PasswordInput";
import ModalRoot from "./ModalRoot";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
}

const PasswordModal: React.FC<Props> = ({ isOpen, setIsOpen, userId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const { mutate: updatePassword } = api.user.updatePassword.useMutation({
    onSuccess() {
      setIsOpen(false);
    },
  });

  return (
    <ModalRoot isOpen={isOpen} setIsOpen={setIsOpen}>
      <Dialog.Panel
        as="form"
        onSubmit={handleSubmit(({ password }) =>
          updatePassword({ userId, password }),
        )}
        className="modal-box flex w-96 flex-col gap-y-4"
      >
        <PasswordInput
          label="New Password"
          {...register("password")}
          error={errors.password}
        />
        <div className="flex justify-between">
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-outline mt-6"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary mt-6">
            Submit
          </button>
        </div>
      </Dialog.Panel>
    </ModalRoot>
  );
};

export default PasswordModal;
