import { type VariantProps, cva } from "class-variance-authority";

const button = cva("btn", {
  variants: {
    intent: {
      primary: "btn-primary",
      outline: "btn-outline",
      danger: "btn-error hover:bg-opacity-80",
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

type ButtonProps = VariantProps<typeof button>;
export type ButtonIntents = NonNullable<ButtonProps["intent"]>;

interface Props extends React.ComponentProps<"button">, ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

const Button: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  isLoading,
  loadingText,
  intent,
  className,
  disabled,
  type = "button",
  ...props
}) => {
  return (
    <button
      className={button({ intent, className })}
      disabled={isLoading ? true : disabled}
      type={type}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner"></span>
          {loadingText ? loadingText : getDefaultLoadingText(children)}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

const getDefaultLoadingText = (children: React.ReactNode) => {
  const s = children?.toString();
  if (!s) return "Loading";

  return s.endsWith("e") ? s.slice(0, -1) + "ing" : s;
};
