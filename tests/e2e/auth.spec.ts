import { TestUserType, testUsers } from "@/lib/constants";
import { test, expect, Page } from "@playwright/test";

test("sign in with root user", async ({ page }) => {
  await page.goto("/admin");
  await signInAs("admin", page);

  await expect(page.getByRole("navigation")).toBeVisible();
  expect(page).toHaveURL(/.*admin/);
});

test("prevents deactivated user from signing in", async ({ page }) => {
  await page.goto("");
  await signInAs("deactivated", page);

  await expect(page.getByText("This account is deactivated.")).toBeVisible();
  await expect(page.getByRole("navigation")).not.toBeVisible();
});

test("sign out works", async ({ page }) => {
  await page.goto("templates");
  await signInAs("user", page);

  await page.getByTestId("sign-out-button").click();

  await assertSignInScreen(page);

  expect(page).toHaveURL(/.*templates/);
});

test("after sign out, user can't view cached pages by history.back()", async ({
  page,
}) => {
  await page.goto("templates");
  await signInAs("admin", page);
  await page.getByTestId("nav-admin-link").click();
  await page.waitForURL("**/admin");

  await page.getByTestId("sign-out-button").click();

  await page.goBack();

  await assertSignInScreen(page);

  expect(page).toHaveURL(/.*templates/);
});

const signInAs = async (userType: TestUserType, page: Page) => {
  const { email, password } = testUsers[userType];

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
};

const assertSignInScreen = async (page: Page) => {
  await expect(page.getByRole("navigation")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
};
