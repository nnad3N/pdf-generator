"use client";

import { Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type UserSchema, userSchema } from "@/utils/schemas";
import { api } from "@/utils/api";
import PasswordInput from "@/components/form/PasswordInput";
import { type User } from "@/app/admin/page";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import ModalRoot, { ModalControlsWrapper } from "@/components/modals/ModalRoot";

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
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UserSchema>({
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

  const utils = api.useContext();
  const { mutate: upsert, isLoading } = api.user.upsert.useMutation({
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
    <ModalRoot isOpen={isOpen} onClose={handleClose}>
      <Dialog.Panel
        as="form"
        onSubmit={handleSubmit((data) => upsert(data))}
        className="modal-box flex w-96 flex-col gap-y-2"
      >
        <Input
          label="First Name"
          {...register("firstName")}
          error={errors.firstName}
        />
        <Input
          label="Last Name"
          {...register("lastName")}
          error={errors.lastName}
        />
        <Input label="Email" {...register("email")} error={errors.email} />
        {!user && (
          <PasswordInput
            label="Password"
            {...register("password")}
            error={errors.password}
          />
        )}
        <div className="form-control w-max">
          <label className="label cursor-pointer justify-start gap-x-4">
            <span className="label-text">Admin account</span>
            <input
              {...register("isAdmin")}
              type="checkbox"
              className="checkbox-primary checkbox"
            />
          </label>
        </div>
        <ModalControlsWrapper>
          <Button onClick={handleClose} intent="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty} isLoading={isLoading}>
            {user ? "Update" : "Create"}
          </Button>
        </ModalControlsWrapper>
      </Dialog.Panel>
    </ModalRoot>
  );
};

export default UpsertUserModal;
