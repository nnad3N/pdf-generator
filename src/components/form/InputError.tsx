interface InputError extends Omit<React.ComponentProps<"span">, "className"> {
  message: string;
}

const InputError: React.FC<InputError> = ({ message, ...props }) => {
  return (
    <span
      className="ml-1 mt-2 text-left text-sm font-bold text-red-500"
      {...props}
    >
      {message}
    </span>
  );
};

export default InputError;
