import fileToBase64 from "@/lib/base64";
import { formatDateAndTime } from "@/lib/date";
import { test, expect } from "vitest";

test("getDateAndTime returns correct format", () => {
  const date = new Date(2024, 1, 1, 12, 12, 12);
  expect(formatDateAndTime(date, "medium")).toBe("1 Feb 2024, 12:12:12");
});

test("fileToBase64 works", async () => {
  const file = new File([`<html>test file</html>`], "test.html", {
    type: "text/html",
  });

  expect(await fileToBase64(file)).toBe("PGh0bWw+dGVzdCBmaWxlPC9odG1sPg==");
});
