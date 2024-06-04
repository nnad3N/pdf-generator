import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import PasswordInput from "@/components/form/PasswordInput";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { userEvent } from "@testing-library/user-event";

const Test = () => {
  const form = useForm<{ password: string }>({
    defaultValues: {
      password: "",
    },
  });
  return (
    <Form {...form}>
      <PasswordInput control={form.control} name="password" label="Password" />
    </Form>
  );
};

describe("<PasswordInput />", () => {
  it("shows and hides password input", async () => {
    const user = userEvent.setup();
    render(<Test />);

    const input = screen.getByLabelText<HTMLInputElement>("Password");

    await user.type(input, "mypassword");

    expect(input.getAttribute("type")).toBe("password");

    const btn = screen.getByRole("button");
    await user.click(btn);

    expect(input.getAttribute("type")).toBe("text");
    expect(input.value).toBe("mypassword");
  });
});
