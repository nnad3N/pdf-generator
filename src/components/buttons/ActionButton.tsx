import { cx } from "class-variance-authority";

const ActionButton: React.FC<
  React.PropsWithChildren<React.ComponentProps<"button">>
> = ({ children, className, type = "button", ...props }) => {
  return (
    <button
      className={cx(
        "btn btn-ghost btn-sm mx-auto flex text-accent hover:bg-transparent hover:text-accent-focus",
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default ActionButton;
