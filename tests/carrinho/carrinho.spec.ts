import { test, expect } from '../../src/fixtures/base.fixture';

test.describe('Carrinho @smoke', () => {
  test('should add a product to cart', async ({ page, cartPage }) => {
    // Go to products and add first product
    await page.goto('/products');
    const firstProduct = page.locator('.features_items .col-sm-4').first();
    await firstProduct.hover();
    await firstProduct.locator('.product-overlay .add-to-cart').click();
    await page.locator('.modal-footer .btn-success').click(); // Continue Shopping

    // Go to cart
    await cartPage.navigate();
    await cartPage.verifyCartHasItems();

    const itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(1);
  });

  test('should display correct product info in cart', async ({ page, cartPage }) => {
    await page.goto('/products');
    const firstProduct = page.locator('.features_items .col-sm-4').first();
    await firstProduct.hover();
    await firstProduct.locator('.product-overlay .add-to-cart').click();
    await page.locator('.modal-footer .btn-success').click();

    await cartPage.navigate();

    const name = await cartPage.getProductName(0);
    const price = await cartPage.getProductPrice(0);
    const quantity = await cartPage.getProductQuantity(0);

    expect(name).toBeTruthy();
    expect(price).toMatch(/Rs\.\s*\d+/);
    expect(quantity).toBe('1');
  });
});

test.describe('Carrinho @regression', () => {
  test('should add multiple products to cart', async ({ page, cartPage }) => {
    await page.goto('/products');

    // Add first product
    const firstProduct = page.locator('.features_items .col-sm-4').nth(0);
    await firstProduct.hover();
    await firstProduct.locator('.product-overlay .add-to-cart').click();
    await page.locator('.modal-footer .btn-success').click();

    // Add second product
    const secondProduct = page.locator('.features_items .col-sm-4').nth(1);
    await secondProduct.hover();
    await secondProduct.locator('.product-overlay .add-to-cart').click();
    await page.locator('.modal-footer .btn-success').click();

    // Verify cart has 2 items
    await cartPage.navigate();
    const itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(2);
  });

  test('should remove a product from cart', async ({ page, cartPage }) => {
    await page.goto('/products');

    // Add product
    const firstProduct = page.locator('.features_items .col-sm-4').first();
    await firstProduct.hover();
    await firstProduct.locator('.product-overlay .add-to-cart').click();
    await page.locator('.modal-footer .btn-success').click();

    // Go to cart and remove
    await cartPage.navigate();
    await page.locator('.cart_quantity_delete').first().click();

    // Wait for item to be removed
    await page.waitForTimeout(1000);
    await cartPage.verifyCartIsEmpty();
  });

  test('should increase product quantity from product detail', async ({ page, cartPage }) => {
    // Go to first product detail
    await page.goto('/product_details/1');

    // Change quantity to 4
    await page.locator('#quantity').fill('4');
    await page.locator('button.btn.btn-default.cart').click();

    // View cart from modal
    await page.locator('a[href="/view_cart"]').last().click();

    // Verify quantity is 4
    const quantity = await cartPage.getProductQuantity(0);
    expect(quantity).toBe('4');
  });

  test('should show empty cart when no products added', async ({ page }) => {
    await page.goto('/view_cart');
    const cartItems = page.locator('#cart_info_table tbody tr');
    const count = await cartItems.count();
    expect(count).toBe(0);
  });
});
