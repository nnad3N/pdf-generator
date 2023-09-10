import { Dialog } from "@headlessui/react";

interface Props {
  isOpen: boolean;
  onClose: (value: boolean) => void;
}

const ModalRoot: React.FC<React.PropsWithChildren<Props>> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <Dialog as="div" className="relative z-10" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          {children}
        </div>
      </div>
    </Dialog>
  );
};

export default ModalRoot;

export const ModalControlsWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <div className="mt-4 flex justify-between">{children}</div>;
};
