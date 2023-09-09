import { Dialog } from "@headlessui/react";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalRoot: React.FC<React.PropsWithChildren<Props>> = ({
  isOpen,
  setIsOpen,
  children,
}) => {
  return (
    <Dialog
      as="div"
      className="relative z-10"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
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
