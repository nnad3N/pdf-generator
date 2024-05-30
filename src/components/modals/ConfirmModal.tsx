import ActionButton from "@/components/ActionButton";
import { type ButtonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAction: () => void;
  isPending: boolean;
  pendingText: string;
  actionHeader: string;
  actionDescription: string;
  actionText: string;
  actionButtonVariant: ButtonVariants;
}

const ConfirmModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  onAction,
  isPending,
  pendingText,
  actionHeader,
  actionDescription,
  actionText,
  actionButtonVariant,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-96">
        <AlertDialogHeader>
          <AlertDialogTitle>{actionHeader}</AlertDialogTitle>
          <AlertDialogDescription>{actionDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <ActionButton
            onClick={onAction}
            isPending={isPending}
            pendingText={pendingText}
            variant={actionButtonVariant}
          >
            {actionText}
          </ActionButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
