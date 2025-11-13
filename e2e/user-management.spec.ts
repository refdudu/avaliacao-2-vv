import { test, expect } from "@playwright/test";

test.describe("Gerenciamento de Usuários E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("deve criar um novo usuário, buscar por nome e deletar", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const userName = `Usuario Test ${timestamp}`;
    const userSearchName = `Alice Test ${timestamp}`;
    const userBob = `Bob Test ${timestamp}`;

    await page.click('button[aria-label="Adicionar usuário"]');
    await page.fill('input[name="name"]', userName);
    await page.click('form button[type="submit"]');
    await page.waitForTimeout(300);

    await expect(page.locator(`text="${userName}"`).first()).toBeVisible();

    await page.click('button[aria-label="Adicionar usuário"]');
    await page.fill('input[name="name"]', userSearchName);
    await page.click('form button[type="submit"]');
    await page.waitForTimeout(300);

    await page.click('button[aria-label="Adicionar usuário"]');
    await page.fill('input[name="name"]', userBob);
    await page.click('form button[type="submit"]');
    await page.waitForTimeout(300);

    const searchInput = page.locator('input[placeholder*="nome do usuário"]');
    await searchInput.fill("Alice Test");
    await page.waitForTimeout(1000);

    await expect(
      page.getByTestId("user-card").filter({ hasText: userSearchName })
    ).toBeVisible();
    await expect(
      page.getByTestId("user-card").filter({ hasText: userBob })
    ).not.toBeVisible();
    await expect(
      page.getByTestId("user-card").filter({ hasText: userName })
    ).not.toBeVisible();

    await searchInput.clear();
    await page.waitForTimeout(1000);

    const userCard = page
      .getByTestId("user-card")
      .filter({ hasText: userName });
    await expect(userCard).toBeVisible();

    await userCard.getByRole("button", { name: "Deletar usuário" }).click();
    await page.waitForTimeout(300);

    await expect(page.locator(`text="${userName}"`)).not.toBeVisible();
  });
});
