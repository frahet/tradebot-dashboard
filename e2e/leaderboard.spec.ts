import { test, expect } from "@playwright/test";

test.describe("Leaderboard (public)", () => {
  test("renders without auth", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  });

  test("shows stat cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Active bots")).toBeVisible();
    await expect(page.getByText("Trades (7d)")).toBeVisible();
    await expect(page.getByText("Best P&L (7d)")).toBeVisible();
  });

  test("leaderboard table is visible or shows empty state", async ({ page }) => {
    await page.goto("/");
    const hasTable = await page.locator("table").count();
    const hasEmpty = await page.getByText("No trades recorded yet.").count();
    expect(hasTable + hasEmpty).toBeGreaterThan(0);
  });

  test("bot link navigates to bot detail page", async ({ page }) => {
    await page.goto("/");
    const botLink = page.locator("table a").first();
    const count = await botLink.count();
    if (count === 0) return; // empty leaderboard — skip navigation test

    const href = await botLink.getAttribute("href");
    await botLink.click();
    await expect(page).toHaveURL(/\/bots\/.+/);
  });
});

test.describe("Trades page", () => {
  test("renders heading", async ({ page }) => {
    await page.goto("/trades");
    await expect(page.getByRole("heading", { name: "All trades" })).toBeVisible();
  });
});

test.describe("Nav", () => {
  test("all nav links are present", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Overview" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Trades" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Ops console/i })).toBeVisible();
  });
});
