"use client";

import ConfirmModal from "@/components/modals/ConfirmModal";
import UpsertTemplateModal from "@/components/modals/UpsertTemplateModal";
import { type RouterOutputs, api } from "@/utils/api";
import { Menu } from "@headlessui/react";
import {
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  DocumentPlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);

export type Template = RouterOutputs["template"]["getAll"][number];

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null);
  const [data] = api.template.getAll.useSuspenseQuery();

  return (
    <>
      <div className="rounded-box w-full max-w-3xl bg-base-200 p-5">
        <table className="table [&_tr]:border-base-100">
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
                <td>{formatDate(template.createdAt)}</td>
                <td>{formatDate(template.updatedAt)}</td>
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
        </table>
        <button
          onClick={() => {
            setTemplate(null);
            setIsOpen(true);
          }}
          className="btn btn-sm mx-auto mt-5 flex border-none text-accent hover:bg-transparent hover:text-accent-focus"
        >
          Add new <DocumentPlusIcon className="h-5 w-5" />
        </button>
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
  const utils = api.useContext();

  const { mutate: duplicateTemplate } = api.template.duplicate.useMutation({
    async onSuccess() {
      await utils.template.getAll.invalidate();
    },
  });

  const { mutate: deleteTemplate } = api.template.delete.useMutation({
    async onSuccess() {
      await utils.template.getAll.invalidate();
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
              onClick={() => duplicateTemplate({ templateId: template.id })}
            >
              <DocumentDuplicateIcon className="h-4 w-4" aria-hidden="true" />
              Duplicate
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
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        action={() => deleteTemplate({ templateId: template.id })}
        actionHeader={`Deleting template ${template.name}`}
        actionDescription={`You are about to delete template ${template.name} with file ${template.filename}. This action is permament and cannot be reversed.`}
        confirmText="Delete"
        actionButtonColor="danger"
      />
    </>
  );
};
