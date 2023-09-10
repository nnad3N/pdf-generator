import { Menu } from "@headlessui/react";
import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";

const iconButton = cva(
  "btn btn-square btn-ghost btn-sm !bg-transparent hover:bg-transparent",
  {
    variants: {
      intent: {
        accent: "text-accent hover:text-accent-focus",
        danger: "hover:text-red-600 text-red-500",
      },
      variant: {
        standalone: "",
        menu: "",
      },
    },
    compoundVariants: [
      {
        intent: "accent",
        variant: "menu",
        className: "ui-open:text-accent-focus",
      },
      {
        intent: "danger",
        variant: "menu",
        className: "ui-open:text-red-600",
      },
    ],
    defaultVariants: {
      intent: "accent",
      variant: "standalone",
    },
  },
);

interface Props
  extends React.ComponentProps<"button">,
    VariantProps<typeof iconButton> {}

const IconButton = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<Props>
>(function IconButton(
  { intent, variant, className, children, type = "button", ...props },
  ref,
) {
  return variant === "menu" ? (
    <Menu.Button
      className={iconButton({ intent, variant, className })}
      type={type}
      {...props}
      ref={ref}
    >
      {children}
    </Menu.Button>
  ) : (
    <button
      className={iconButton({ intent, variant, className })}
      type={type}
      {...props}
      ref={ref}
    >
      {children}
    </button>
  );
});

export default IconButton;
