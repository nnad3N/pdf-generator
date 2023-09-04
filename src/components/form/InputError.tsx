const InputError: React.FC<{ message: string }> = ({ message }) => {
  return (
    <span className="ml-1 mt-2 text-left text-sm font-bold text-red-500">
      {message}
    </span>
  );
};

export default InputError;
