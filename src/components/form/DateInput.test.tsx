import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import DateInput from "@/components/form/DateInput";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { type UserEvent, userEvent } from "@testing-library/user-event";
import { format } from "date-fns";
import { useEffect } from "react";

const Test = ({
  onChange,
  asString = false,
}: {
  onChange?: (value: string | Date | undefined) => void;
  asString?: boolean;
}) => {
  const form = useForm<{ date: string | Date }>({
    defaultValues: {
      date: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (typeof onChange !== "undefined") {
        onChange(value.date);
      }
    });
    return () => subscription.unsubscribe();

    // eslint-disable-next-line
  }, [form.watch]);

  return (
    <Form {...form}>
      <DateInput
        control={form.control}
        name="date"
        label="Date"
        asString={asString}
      />
    </Form>
  );
};

const selectDate = async (user: UserEvent) => {
  const dateInput = screen.getByLabelText<HTMLButtonElement>("Date");

  expect(dateInput.innerHTML).toContain("Pick a date");

  await user.click(dateInput);

  const calendarBtn = await screen.findByText("15", {
    selector: 'button[name="day"]',
  });

  await user.click(calendarBtn);
};

describe("<DateInput />", () => {
  const user = userEvent.setup();

  it("displays the date in the correct format", async () => {
    render(<Test />);

    const dateInput = screen.getByLabelText<HTMLButtonElement>("Date");

    await selectDate(user);

    const today = new Date();
    expect(dateInput.innerHTML).toContain(`15/${format(today, "MM/yyyy")}`);
  });
  it("returns value as date", async () => {
    let date: unknown = undefined;
    render(
      <Test
        onChange={(value) => {
          date = value;
        }}
      />,
    );

    await selectDate(user);

    assert.exists(date);
    assert.isNotString(date);

    const today = new Date();
    today.setUTCDate(15);

    expect(format(today, "dd/MM/yyyy")).toEqual(
      format(date as Date, "dd/MM/yyyy"),
    );
  });
  it("returns value as string", async () => {
    let date: unknown = undefined;
    render(
      <Test
        onChange={(value) => {
          date = value;
        }}
        asString={true}
      />,
    );

    await selectDate(user);

    assert.isString(date);
  });
});
