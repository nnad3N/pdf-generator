import { cx } from "class-variance-authority";

const Table: React.FC<
  React.PropsWithChildren<React.ComponentProps<"table">>
> = ({ children, className, ...props }) => {
  return (
    <table
      className={cx(
        "table [&_tbody>tr:last-child]:border-b-0 [&_tr]:border-neutral-content dark:[&_tr]:border-base-100",
        className,
      )}
      {...props}
    >
      {children}
    </table>
  );
};

export default Table;
