import { TestUserType, testUsers } from "@/lib/constants";
import { test, expect } from "../fixtures/admin";
import { Page } from "@playwright/test";

test("you cannot deactivate your own account", async ({ page }) => {
  await openSettingsMenu("admin", page);

  await page.getByRole("menuitem", { name: "Deactivate" }).click();

  await expect(
    page.getByText("You cannot deactivate your own account."),
  ).toBeVisible();
});

test("you cannot delete your own account", async ({ page }) => {
  await openSettingsMenu("admin", page);

  await page.getByRole("menuitem", { name: "Delete" }).click();

  const alertDialog = page.getByRole("alertdialog");
  await expect(alertDialog).toBeVisible();

  await alertDialog.getByRole("button", { name: "Delete" }).click();

  await expect(
    page.getByText("You cannot delete your own account."),
  ).toBeVisible();
});

test("you cannot demote your own account to user", async ({ page }) => {
  await openSettingsMenu("admin", page);

  await page.getByText("Edit", { exact: true }).click();

  await page.getByLabel("Admin").click();

  const updateButton = page.getByRole("button", { name: "Update" });
  await updateButton.click();

  await expect(
    page.getByText("You cannot make your own account a user."),
  ).toBeVisible();
  await expect(updateButton).toBeVisible();
});

const openSettingsMenu = async (userType: TestUserType, page: Page) => {
  const { email } = testUsers[userType];
  await page
    .locator("tr", { has: page.locator(`text="${email}"`) })
    .getByRole("button")
    .click();
};
