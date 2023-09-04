"use client";

import { Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type UserSchema, userSchema } from "@/utils/schemas";
import { api } from "@/utils/api";
import PasswordInput from "@/components/form/PasswordInput";
import Input from "../form/Input";
import { type User } from "@/app/admin/page";
import ModalRoot from "./ModalRoot";
import { useEffect } from "react";

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
    reset,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UserSchema>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(
      user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: "placeholder", // must validate with the user schema
            isAdmin: user.isAdmin,
          }
        : defaultValues,
    );
    //eslint-disable-next-line
  }, [user]);

  const utils = api.useContext();
  const { mutate: upsert } = api.user.upsert.useMutation({
    async onSuccess() {
      await utils.user.getAll.invalidate();
      setIsOpen(false);
    },
  });

  return (
    <ModalRoot isOpen={isOpen} setIsOpen={setIsOpen}>
      <Dialog.Panel
        as="form"
        onSubmit={handleSubmit((data) => upsert({ ...data, userId: user?.id }))}
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
        <div className="mt-4 flex justify-between">
          <button onClick={() => setIsOpen(false)} className="btn btn-outline">
            Cancel
          </button>
          <button disabled={!isDirty} type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </Dialog.Panel>
    </ModalRoot>
  );
};

export default UpsertUserModal;
