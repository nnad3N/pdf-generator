import { Dialog } from "@headlessui/react";
import Button, { type ButtonIntents } from "@/components/buttons/Button";
import ModalRoot, { ModalControlsWrapper } from "@/components/modals/ModalRoot";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: () => void;
  isLoading: boolean;
  loadingText?: string;
  actionHeader: string;
  actionDescription: string;
  confirmText: string;
  actionButtonIntent: ButtonIntents;
}

const ConfirmModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  action,
  isLoading,
  loadingText,
  actionHeader,
  actionDescription,
  confirmText,
  actionButtonIntent,
}) => {
  return (
    <ModalRoot isOpen={isOpen} onClose={setIsOpen}>
      <Dialog.Panel className="modal-box flex w-96 flex-col">
        <div className="text-left">
          <h3 className="mb-1 text-lg font-semibold">{actionHeader}</h3>
          <p>{actionDescription}</p>
        </div>
        <ModalControlsWrapper>
          <Button onClick={() => setIsOpen(false)} intent="outline">
            Cancel
          </Button>
          <Button
            onClick={action}
            intent={actionButtonIntent}
            isLoading={isLoading}
            loadingText={loadingText}
          >
            {confirmText}
          </Button>
        </ModalControlsWrapper>
      </Dialog.Panel>
    </ModalRoot>
  );
};

export default ConfirmModal;
