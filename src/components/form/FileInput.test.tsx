import { render, screen } from "@testing-library/react";
import { expect, vi } from "vitest";
import FileInput from "@/components/form/FileInput";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { userEvent } from "@testing-library/user-event";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  filename: z
    .string()
    .endsWith(".html", { message: "Only HTML files are supported" }),
});

type Form = z.infer<typeof formSchema>;

const Test = ({
  handleFileChange,
}: {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filename: "",
    },
  });

  return (
    <Form {...form}>
      <FileInput<Form> name="filename" handleFileChange={handleFileChange} />
    </Form>
  );
};

const htmlFile = new File([`<html>test</html>`], "test_file.html", {
  type: "text/html",
});
const newHtmlFile = new File([`<html>test</html>`], "new_test_file.html", {
  type: "text/html",
});
const notHtmlFile = new File([`<html>test</html>`], "test_file.txt", {
  type: "text/html",
});

const getInput = () => {
  const input = screen.getByText("Choose file").parentElement;
  assert.isDefined(input);
  return input as HTMLInputElement;
};

describe("<FileInput />", () => {
  const user = userEvent.setup();

  it("displays the filename and updates it on new file upload", async () => {
    let filename = "";
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      filename = e.target.files?.[0]?.name ?? "";
    };
    render(<Test handleFileChange={handleFileChange} />);

    const input = getInput();

    await user.upload(input, htmlFile);
    expect(input.innerHTML).toContain(filename.toLocaleLowerCase());

    await user.upload(input, newHtmlFile);
    expect(input.innerHTML).toContain(filename.toLocaleLowerCase());
  });
  it("doesn't call handleFileChange if there is an error", async () => {
    let filename = "";

    const handleFileChange = vi.fn((e: React.ChangeEvent<HTMLInputElement>) => {
      filename = e.target.files?.[0]?.name ?? "";
    });

    render(<Test handleFileChange={handleFileChange} />);

    const input = getInput();

    await user.upload(input, notHtmlFile);

    await screen.findByText("Only HTML files are supported");

    expect(handleFileChange).toBeCalledTimes(0);
    expect(filename).toEqual("");
    expect(input.innerHTML).toContain("test_file.txt");
  });
});
