"use client";

import { Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { type UserSchema, userSchema } from "@/utils/schemas";
import { api } from "@/utils/api";
import PasswordInput from "@/components/form/PasswordInput";
import Input from "../form/Input";
import { type User } from "@/app/admin/page";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user?: User | null;
}

const EditModal: React.FC<Props> = ({ isOpen, setIsOpen, user }) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchema>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      password: "",
      isAdmin: user?.isAdmin ?? false,
    });
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
    <Dialog
      as="div"
      className="relative z-10"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
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
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default EditModal;
