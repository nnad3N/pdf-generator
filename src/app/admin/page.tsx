"use client";

import OptionsMenuItems from "@/components/OptionsMenuItems";
import Table from "@/components/Table";
import ActionButton from "@/components/buttons/ActionButton";
import IconButton from "@/components/buttons/IconButton";
import MenuButton from "@/components/buttons/MenuButton";
import ConfirmModal from "@/components/modals/ConfirmModal";
import UpdatePasswordModal from "@/components/modals/UpdatePasswordModal";
import UpsertUserModal from "@/components/modals/UpsertUserModal";
import { type RouterOutputs, api } from "@/trpc/react";
import { Menu } from "@headlessui/react";
import {
  Cog6ToothIcon,
  KeyIcon,
  LockClosedIcon,
  LockOpenIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";

export type User = RouterOutputs["user"]["getAll"][number];

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [data] = api.user.getAll.useSuspenseQuery();

  return (
    <>
      <div className="rounded-box bg-base-200 w-full max-w-3xl p-5">
        <Table>
          <thead>
            <tr>
              <th>FIRST NAME</th>
              <th>LAST NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr
                key={user.id}
                className={user.isDeactivated ? "deactivated" : undefined}
              >
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "Admin" : "User"}</td>
                <td className="w-12">
                  <OptionsMenu
                    user={user}
                    isDeactivated={user.isDeactivated}
                    openEditModal={() => {
                      setUser(user);
                      setIsOpen(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <ActionButton
          onClick={() => {
            setUser(null);
            setIsOpen(true);
          }}
          className="mt-1"
          data-test="add-new-user"
        >
          Add new <UserPlusIcon className="h-5 w-5" />
        </ActionButton>
      </div>
      <UpsertUserModal isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
    </>
  );
}

interface OptionsMenuProps {
  user: User;
  isDeactivated: boolean;
  openEditModal: () => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  user,
  isDeactivated,
  openEditModal,
}) => {
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] =
    useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const utils = api.useUtils();

  const { mutate: setIsDeactivated } = api.user.toggleActive.useMutation({
    async onSuccess() {
      await utils.user.getAll.invalidate();
    },
  });

  const { mutate: deleteUser, isPending } = api.user.delete.useMutation({
    async onSuccess() {
      await utils.user.getAll.invalidate();
    },
  });

  return (
    <>
      <Menu as="div" className="relative">
        <IconButton variant="menu">
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <OptionsMenuItems>
          <MenuButton onClick={openEditModal}>
            <PencilIcon className="h-4 w-4" />
            Edit
          </MenuButton>
          <MenuButton onClick={() => setIsUpdatePasswordModalOpen(true)}>
            <KeyIcon className="h-4 w-4" />
            Change Password
          </MenuButton>
          <MenuButton
            onClick={() =>
              setIsDeactivated({
                userId: user.id,
                isDeactivated: !isDeactivated,
              })
            }
          >
            {isDeactivated ? (
              <>
                <LockOpenIcon className="h-4 w-4" />
                Activate
              </>
            ) : (
              <>
                <LockClosedIcon className="h-4 w-4" />
                Deactivate
              </>
            )}
          </MenuButton>
          <MenuButton
            onClick={() => setIsConfirmModalOpen(true)}
            intent="danger"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </MenuButton>
        </OptionsMenuItems>
      </Menu>
      <UpdatePasswordModal
        isOpen={isUpdatePasswordModalOpen}
        setIsOpen={setIsUpdatePasswordModalOpen}
        email={user.email}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        action={() => deleteUser({ userId: user.id })}
        isLoading={isPending}
        actionHeader={`Deleting user ${user.email}`}
        actionDescription={`You are about to delete user ${user.firstName} ${user.lastName}. This action is permament and cannot be reversed.`}
        confirmText="Delete"
        actionButtonIntent="danger"
      />
    </>
  );
};
