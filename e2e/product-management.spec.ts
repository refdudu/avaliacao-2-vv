import { test, expect } from "@playwright/test";

test.describe("Gerenciamento de Produtos E2E", () => {
  let userName: string;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    userName = `Usuario E2E ${Date.now()}`;

    await page.click('button[aria-label="Adicionar usuário"]');
    await page.fill('input[name="name"]', userName);
    await page.click('form button[type="submit"]');
    await page.waitForTimeout(300);

    await page.locator(`button:has-text("${userName}")`).first().click();
    await page.waitForTimeout(300);
  });

  test("deve criar múltiplos produtos e modificar quantidades", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const products = [
      { name: `Mouse ${timestamp}`, price: "150.00", quantity: "5" },
      { name: `Teclado ${timestamp}`, price: "300.00", quantity: "3" },
      { name: `Monitor ${timestamp}`, price: "1200.00", quantity: "2" },
    ];

    for (const product of products) {
      await page.click('button[aria-label="Adicionar produto"]');
      await page.fill('input[name="name"]', product.name);
      await page.fill('input[name="price"]', product.price);
      await page.fill('input[name="quantity"]', product.quantity);
      await page.click('form button[type="submit"]');
      await page.waitForTimeout(500);
    }

    await expect(
      page.getByRole("heading", { name: products[0].name, level: 3 })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: products[1].name, level: 3 })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: products[2].name, level: 3 })
    ).toBeVisible();

    const totalText = page.locator("text=/Total: \\d+/");
    await expect(totalText).toContainText("Total: 3");

    const mouseCard = page
      .getByTestId("product-card")
      .filter({ hasText: products[0].name });

    await expect(
      mouseCard.locator("span.w-20").filter({ hasText: "5" })
    ).toBeVisible();

    await mouseCard
      .getByRole("button", { name: "Adicionar quantidade" })
      .click();
    await page.waitForTimeout(500);

    await expect(
      mouseCard.locator("span.w-20").filter({ hasText: "6" })
    ).toBeVisible();

    await mouseCard.getByRole("button", { name: "Remover quantidade" }).click();
    await page.waitForTimeout(500);

    await expect(
      mouseCard.locator("span.w-20").filter({ hasText: "5" })
    ).toBeVisible();

    await mouseCard.getByRole("button", { name: "Deletar produto" }).click();
    await page.waitForTimeout(500);

    await expect(page.locator(`text="${products[0].name}"`)).not.toBeVisible();
    await expect(
      page.locator(`text="${products[1].name}"`).first()
    ).toBeVisible();
    await expect(
      page.locator(`text="${products[2].name}"`).first()
    ).toBeVisible();

    await expect(totalText).toContainText("Total: 2");
  });
});
