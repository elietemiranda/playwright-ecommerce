import { test, expect } from '../../src/fixtures/base.fixture';

test.describe('Busca @smoke', () => {
  test('should display all products page', async ({ productsPage }) => {
    await productsPage.verifyAllProductsVisible();
  });

  test('should search for a product and display results', async ({ productsPage }) => {
    await productsPage.searchProduct('Top');
    await productsPage.verifySearchedProductsVisible();

    const count = await productsPage.getProductsCount();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Busca @regression', () => {
  test('should show results matching search term', async ({ productsPage }) => {
    await productsPage.searchProduct('Tshirt');
    await productsPage.verifySearchedProductsVisible();

    const productNames = await productsPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);

    const hasMatch = productNames.some((name) =>
      name.toLowerCase().includes('tshirt') || name.toLowerCase().includes('t-shirt'),
    );
    expect(hasMatch).toBeTruthy();
  });

  test('should show no results for non-existing product', async ({ productsPage }) => {
    await productsPage.searchProduct('xyznonexistentproduct123');
    await productsPage.verifySearchedProductsVisible();

    const count = await productsPage.getProductsCount();
    expect(count).toBe(0);
  });

  test('should display product prices', async ({ productsPage }) => {
    const price = await productsPage.getProductPrice(0);
    expect(price).toMatch(/Rs\.\s*\d+/);
  });

  test('should navigate to product details', async ({ productsPage, page }) => {
    await productsPage.viewProductDetails(0);
    await expect(page).toHaveURL(/product_details/);
    await expect(page.locator('.product-information')).toBeVisible();
  });
});
