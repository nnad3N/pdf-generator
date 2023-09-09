import { cx } from "class-variance-authority";

const ActionButton: React.FC<
  React.PropsWithChildren<React.ComponentProps<"button">>
> = ({ children, className, ...props }) => {
  return (
    <button
      className={cx(
        "btn btn-ghost btn-sm mx-auto mt-2 flex text-accent hover:bg-transparent hover:text-accent-focus",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default ActionButton;
