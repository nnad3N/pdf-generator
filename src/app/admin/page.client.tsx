"use client";

import ConfirmModal from "@/components/modals/ConfirmModal";
import UpdatePasswordModal from "@/components/modals/UpdatePasswordModal";
import UpsertUserModal from "@/components/modals/UpsertUserModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type RouterOutputs, api } from "@/trpc/react";
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

const Admin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [users] = api.user.getAll.useSuspenseQuery();

  return (
    <>
      <div className="rounded-box bg-base-200 flex w-full max-w-3xl flex-col items-center p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>FIRST NAME</TableHead>
              <TableHead>LAST NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className={
                  user.isDeactivated
                    ? "[&_td:not(:last-child)]pointer-events-none [&_td:not(:last-child)]:select-none [&_td:not(:last-child)]:opacity-50"
                    : ""
                }
              >
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
                <TableCell className="w-12">
                  <OptionsMenu
                    user={user}
                    isDeactivated={user.isDeactivated}
                    openEditModal={() => {
                      setUser(user);
                      setIsOpen(true);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          onClick={() => {
            setUser(null);
            setIsOpen(true);
          }}
          className="mt-1"
          variant="ghost"
        >
          <UserPlusIcon className="mr-2 h-5 w-5" /> Add New
        </Button>
      </div>
      <UpsertUserModal isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
    </>
  );
};

export default Admin;

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <Cog6ToothIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={openEditModal}>
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsUpdatePasswordModalOpen(true)}>
            <KeyIcon className="mr-2 h-4 w-4" />
            Change Password
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setIsDeactivated({
                userId: user.id,
                isDeactivated: !isDeactivated,
              })
            }
          >
            {isDeactivated ? (
              <>
                <LockOpenIcon className="mr-2 h-4 w-4" />
                Activate
              </>
            ) : (
              <>
                <LockClosedIcon className="mr-2 h-4 w-4" />
                Deactivate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsConfirmModalOpen(true)}
            variant="destructive"
          >
            <TrashIcon className="mr-2 h-4 w-4 " />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
