import { Menu } from "@headlessui/react";
import { type VariantProps, cva } from "class-variance-authority";

const menuButton = cva(
  "capitalize ui-active:bg-base-content ui-active:bg-opacity-10 ui-disabled:pointer-events-none ui-disabled:opacity-30",
  {
    variants: {
      intent: {
        danger: "text-red-500 hover:text-red-600 ui-active:text-red-600",
      },
    },
  },
);

interface Props extends VariantProps<typeof menuButton> {
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

const MenuButton: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  disabled,
  onClick,
  intent,
  className,
}) => {
  return (
    <Menu.Item disabled={disabled} as="li">
      <button className={menuButton({ intent, className })} onClick={onClick}>
        {children}
      </button>
    </Menu.Item>
  );
};

export default MenuButton;
