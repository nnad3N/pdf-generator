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
  SettingsIcon,
  KeyRoundIcon,
  LockIcon,
  LockOpenIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

export type User = RouterOutputs["user"]["getAll"][number];

const Admin = () => {
  const [isUpsertModalOpen, setIsUpsertModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [users] = api.user.getAll.useSuspenseQuery();

  return (
    <>
      <div className="flex w-full max-w-3xl flex-col items-center rounded-lg border px-5 py-4 shadow-sm">
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
                  user.isDeactivated ? "[&_td:not(:last-child)]:opacity-50" : ""
                }
              >
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? "admin" : "user"}</TableCell>
                <TableCell className="w-12">
                  <OptionsMenu
                    user={user}
                    isDeactivated={user.isDeactivated}
                    openEditModal={() => {
                      setUser(user);
                      setIsUpsertModalOpen(true);
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
            setIsUpsertModalOpen(true);
          }}
          className="mt-1"
          variant="ghost"
        >
          <UserPlusIcon className="mr-2 h-5 w-5" /> Add new
        </Button>
      </div>
      <UpsertUserModal
        isOpen={isUpsertModalOpen}
        setIsOpen={setIsUpsertModalOpen}
        user={user}
      />
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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const utils = api.useUtils();

  const { mutate: setIsDeactivated } = api.user.toggleActive.useMutation({
    async onSuccess() {
      await utils.user.getAll.invalidate();
    },
    onError(error, variables) {
      if (error.data?.code === "BAD_REQUEST") {
        toast.warning(error.message);
      } else {
        toast.error(
          `Failed to ${
            variables.isDeactivated ? "deactivate" : "activate"
          } the user.`,
        );
      }
    },
  });

  const { mutate: deleteUser, isPending } = api.user.delete.useMutation({
    async onSuccess() {
      await utils.user.getAll.invalidate();
      setIsConfirmModalOpen(false);
    },
    onError(error) {
      if (error.data?.code === "BAD_REQUEST") {
        toast.warning(error.message);
      } else {
        toast.error("Failed to delete the user.");
      }
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <SettingsIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={openEditModal}>
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsPasswordModalOpen(true)}>
            <KeyRoundIcon className="mr-2 h-4 w-4" />
            Update password
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
                <LockIcon className="mr-2 h-4 w-4" />
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
        isOpen={isPasswordModalOpen}
        setIsOpen={setIsPasswordModalOpen}
        userId={user.id}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        onAction={() => deleteUser({ userId: user.id })}
        actionText="Delete"
        isPending={isPending}
        pendingText="Deleting..."
        actionHeader="Are you absolutely sure?"
        actionDescription={`You are about to delete user "${user.firstName} ${user.lastName}". This action is permament and cannot be reversed.`}
        actionButtonVariant="destructive"
      />
    </>
  );
};
