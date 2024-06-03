"use client";

import ConfirmModal from "@/components/modals/ConfirmModal";
import UpsertTemplateModal from "@/components/modals/UpsertTemplateModal";
import { type RouterOutputs, api } from "@/trpc/react";
import { formatDateAndTime } from "@/lib/date";
import {
  SettingsIcon,
  FilePlusIcon,
  FilesIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Template = RouterOutputs["template"]["getAll"][number];

const Template = () => {
  const [isUpsertModalOpen, setIsUpsertModalOpen] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null);
  const [data] = api.template.getAll.useSuspenseQuery();

  return (
    <>
      <div className="flex w-full max-w-3xl flex-col items-center rounded-lg border px-5 py-4 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TEMPLATE NAME</TableHead>
              <TableHead>CHANGED BY</TableHead>
              <TableHead>CREATED AT</TableHead>
              <TableHead>UPDATED AT</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((template) => (
              <TableRow key={template.id}>
                <TableCell>{template.name}</TableCell>
                <TableCell>{template.changedBy.email}</TableCell>
                <TableCell>
                  {formatDateAndTime(template.createdAt, "medium")}
                </TableCell>
                <TableCell>
                  {formatDateAndTime(template.updatedAt, "medium")}
                </TableCell>
                <TableCell className="w-12">
                  <OptionsMenu
                    template={template}
                    openEditModal={() => {
                      setTemplate(template);
                      setIsUpsertModalOpen(true);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.length === 0 && (
          <div className="mb-1 mt-6">You do not have any templates yet.</div>
        )}
        <Button
          onClick={() => {
            setTemplate(null);
            setIsUpsertModalOpen(true);
          }}
          className="mt-1"
          variant="ghost"
        >
          <FilePlusIcon className="mr-2 h-5 w-5" />
          Add new
        </Button>
      </div>
      <UpsertTemplateModal
        isOpen={isUpsertModalOpen}
        setIsOpen={setIsUpsertModalOpen}
        template={template}
      />
    </>
  );
};

export default Template;

interface OptionsMenuProps {
  template: Template;
  openEditModal: () => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  template,
  openEditModal,
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const utils = api.useUtils();

  const { mutate: duplicateTemplate } = api.template.duplicate.useMutation({
    async onSuccess() {
      await Promise.all([
        utils.template.getAll.invalidate(),
        utils.pdf.getTemplates.invalidate(),
      ]);
    },
    onError() {
      toast.error("Failed to duplicate the template.");
    },
  });

  const { mutate: deleteTemplate, isPending } = api.template.delete.useMutation(
    {
      async onSuccess() {
        await Promise.all([
          utils.template.getAll.invalidate(),
          utils.pdf.getTemplates.invalidate(),
        ]);
      },
      onError() {
        toast.error("Failed to delete the template.");
      },
    },
  );

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
          <DropdownMenuItem
            onClick={() => duplicateTemplate({ templateId: template.id })}
          >
            <FilesIcon className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsConfirmModalOpen(true)}
            variant="destructive"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        onAction={() => deleteTemplate({ templateId: template.id })}
        actionText="Delete"
        isPending={isPending}
        pendingText="Deleting..."
        actionHeader="Are you absolutely sure?"
        actionDescription={`You are about to delete template "${template.name}" with file "${template.filename}". This action is permament and cannot be reversed.`}
        actionButtonVariant="destructive"
      />
    </>
  );
};
