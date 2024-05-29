"use client";

import OptionsMenuItems from "@/components/OptionsMenuItems";
import Table from "@/components/Table";
import ActionButton from "@/components/ActionButton";
import IconButton from "@/components/buttons/IconButton";
import MenuButton from "@/components/buttons/MenuButton";
import ConfirmModal from "@/components/modals/ConfirmModal";
import UpsertTemplateModal from "@/components/modals/UpsertTemplateModal";
import { type RouterOutputs, api } from "@/trpc/react";
import { formatDateAndTime } from "@/lib/date";
import { Menu } from "@headlessui/react";
import {
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  DocumentPlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";

export type Template = RouterOutputs["template"]["getAll"][number];

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null);
  const [data] = api.template.getAll.useSuspenseQuery();

  return (
    <>
      <div className="rounded-box bg-base-200 w-full max-w-3xl p-5">
        <Table>
          <thead>
            <tr>
              <th>TEMPLATE NAME</th>
              <th>CHANGED BY</th>
              <th>CREATED AT</th>
              <th>UPDATED AT</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((template) => (
              <tr key={template.id}>
                <td>{template.name}</td>
                <td>{template.changedBy.email}</td>
                <td>{formatDateAndTime(template.createdAt, "medium")}</td>
                <td>{formatDateAndTime(template.updatedAt, "medium")}</td>
                <td className="w-12">
                  <OptionsMenu
                    template={template}
                    openEditModal={() => {
                      setTemplate(template);
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
            setTemplate(null);
            setIsOpen(true);
          }}
          className="mt-1"
        >
          Add new <DocumentPlusIcon className="h-5 w-5" />
        </ActionButton>
      </div>
      <UpsertTemplateModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        template={template}
      />
    </>
  );
}

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
      await utils.template.getAll.invalidate();
    },
  });

  const { mutate: deleteTemplate, isPending } = api.template.delete.useMutation(
    {
      async onSuccess() {
        await utils.template.getAll.invalidate();
      },
    },
  );

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
          <MenuButton
            onClick={() => duplicateTemplate({ templateId: template.id })}
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
            Duplicate
          </MenuButton>
          <MenuButton
            intent="danger"
            onClick={() => setIsConfirmModalOpen(true)}
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </MenuButton>
        </OptionsMenuItems>
      </Menu>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        action={() => deleteTemplate({ templateId: template.id })}
        isLoading={isPending}
        actionHeader={`Deleting template ${template.name}`}
        actionDescription={`You are about to delete template ${template.name} with file ${template.filename}. This action is permament and cannot be reversed.`}
        confirmText="Delete"
        actionButtonIntent="danger"
      />
    </>
  );
};
