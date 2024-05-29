import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

interface Props extends ButtonProps {
  isPending: boolean;
  pendingText: string;
}

const ActionButton: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
  isPending,
  pendingText,
  ...props
}) => {
  return (
    <>
      {isPending ? (
        <Button className={className} {...props} disabled>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          {pendingText}
        </Button>
      ) : (
        <Button className={className} {...props}>
          {children}
        </Button>
      )}
    </>
  );
};

export default ActionButton;
