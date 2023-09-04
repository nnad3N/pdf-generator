"use client";

import ConfirmModal from "@/components/modals/ConfirmModal";
import UpdatePasswordModal from "@/components/modals/UpdatePasswordModal";
import UpsertUserModal from "@/components/modals/UpsertUserModal";
import { type RouterOutputs, api } from "@/utils/api";
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
      <div className="rounded-box w-full max-w-3xl bg-base-200 p-5">
        <table className="table [&_tr]:border-base-100">
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
                className={user.isDeactivated ? "deactivated" : ""}
                key={user.id}
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
        </table>
        <button
          onClick={() => {
            setUser(null);
            setIsOpen(true);
          }}
          className="btn btn-sm mx-auto mt-5 flex border-none text-accent hover:bg-transparent hover:text-accent-focus"
        >
          Add new <UserPlusIcon className="h-5 w-5" />
        </button>
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
  const utils = api.useContext();

  const { mutate: setIsDeactivated } = api.user.toggleActive.useMutation({
    async onSuccess() {
      await utils.user.getAll.invalidate();
    },
  });

  const { mutate: deleteUser } = api.user.delete.useMutation({
    async onSuccess() {
      await utils.user.getAll.invalidate();
    },
  });

  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button className="text-accent hover:text-accent-focus ui-open:text-accent-focus">
          <Cog6ToothIcon className="h-5 w-5" />
        </Menu.Button>
        <Menu.Items
          as="ul"
          className="menu rounded-box absolute right-0 z-20 mt-2 w-56 origin-top-right bg-base-300 p-2 shadow-md"
        >
          <Menu.Item as="li">
            <button
              className="capitalize ui-active:bg-base-content ui-active:bg-opacity-10"
              onClick={openEditModal}
            >
              <PencilIcon className="h-4 w-4" aria-hidden="true" />
              Edit
            </button>
          </Menu.Item>
          <Menu.Item as="li">
            <button
              className="capitalize ui-active:bg-base-content ui-active:bg-opacity-10"
              onClick={() => setIsUpdatePasswordModalOpen(true)}
            >
              <KeyIcon className="h-4 w-4" aria-hidden="true" />
              Change Password
            </button>
          </Menu.Item>
          <Menu.Item as="li">
            <button
              className="capitalize ui-active:bg-base-content ui-active:bg-opacity-10"
              onClick={() =>
                setIsDeactivated({
                  userId: user.id,
                  isDeactivated: !isDeactivated,
                })
              }
            >
              {isDeactivated ? (
                <>
                  <LockOpenIcon className="h-4 w-4" aria-hidden="true" />
                  Activate
                </>
              ) : (
                <>
                  <LockClosedIcon className="h-4 w-4" aria-hidden="true" />
                  Deactivate
                </>
              )}
            </button>
          </Menu.Item>
          <Menu.Item as="li">
            <button
              className="capitalize text-red-500 hover:text-red-600 ui-active:bg-base-content ui-active:bg-opacity-10"
              onClick={() => setIsConfirmModalOpen(true)}
            >
              <TrashIcon className="h-4 w-4" aria-hidden="true" />
              Delete
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <UpdatePasswordModal
        isOpen={isUpdatePasswordModalOpen}
        setIsOpen={setIsUpdatePasswordModalOpen}
        userId={user.id}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        action={() => deleteUser({ userId: user.id })}
        actionHeader={`Deleting user ${user.email}`}
        actionDescription={`You are about to delete a user ${user.firstName} ${user.lastName}. This action is permament and cannot be reversed.`}
        confirmText="Delete"
        actionButtonColor="danger"
      />
    </>
  );
};
