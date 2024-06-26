import { fileToBase64 } from "@/lib/base64";
import { splitProps } from "@/lib/splitProps";
import { test, expect, expectTypeOf } from "vitest";

test("fileToBase64 works", async () => {
  const file = new File([`<html>test file</html>`], "test.html", {
    type: "text/html",
  });

  const base64File = await fileToBase64(file);

  expect(base64File).toBe("PGh0bWw+dGVzdCBmaWxlPC9odG1sPg==");
});

const mockProps = {
  name: "name2",
  "1": 2,
  objectThing: {
    property: "something",
  },
  arrayThing: [1, 2, 3],
};

test("splitProps works", () => {
  const [props, otherProps] = splitProps(mockProps, ["objectThing"]);

  expect(props).toMatchObject({
    objectThing: {
      property: "something",
    },
  });

  expect(otherProps).toMatchObject({
    name: "name2",
    "1": 2,
    arrayThing: [1, 2, 3],
  });
});

test("splitProps exhausts all of the props", () => {
  const [props, exhaustedProps] = splitProps(mockProps, [
    "name",
    "1",
    "objectThing",
    "arrayThing",
  ]);

  expect(props).toMatchObject(mockProps);
  expectTypeOf(exhaustedProps).toMatchTypeOf({});
  expect(exhaustedProps).toMatchObject({});
});
