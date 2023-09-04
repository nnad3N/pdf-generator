import { Dialog } from "@headlessui/react";
import ModalRoot from "./ModalRoot";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: () => void;
  actionHeader: string;
  actionDescription: string;
  confirmText: string;
  actionButtonColor: "primary" | "accent" | "danger";
}

const ConfirmModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  action,
  actionHeader,
  actionDescription,
  confirmText,
  actionButtonColor,
}) => {
  return (
    <ModalRoot isOpen={isOpen} setIsOpen={setIsOpen}>
      <Dialog.Panel className="modal-box flex w-96 flex-col gap-y-4">
        <div className="text-left">
          <h3 className="mb-1 text-lg font-semibold">{actionHeader}</h3>
          <p>{actionDescription}</p>
        </div>
        <div className="mt-2 flex justify-between">
          <button onClick={() => setIsOpen(false)} className="btn btn-outline">
            Cancel
          </button>
          <button
            onClick={action}
            type="button"
            className={`btn ${
              actionButtonColor === "primary"
                ? "btn-primary"
                : actionButtonColor === "accent"
                ? "btn-accent"
                : "btn-error"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </Dialog.Panel>
    </ModalRoot>
  );
};

export default ConfirmModal;
