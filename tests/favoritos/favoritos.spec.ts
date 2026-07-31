import { test, expect } from '../../src/fixtures/base.fixture';
import { generateUser } from '../../src/data/user.data';

// Note: Automation Exercise does not have a traditional "wishlist/favorites" feature
// However, we can test the "Recommended Items" section and "Add to Cart" from it
// For portfolio purposes, we simulate a favorites-like workflow using cart bookmarking

test.describe('Favoritos @smoke', () => {
  test('should display recommended items section on home page', async ({ page }) => {
    await page.goto('/');
    const recommendedSection = page.locator('.recommended_items');
    await expect(recommendedSection).toBeVisible();
    await expect(page.getByText('recommended items')).toBeVisible();
  });

  test('should add recommended item to cart', async ({ page }) => {
    await page.goto('/');

    // Scroll to recommended items
    const recommendedSection = page.locator('.recommended_items');
    await recommendedSection.scrollIntoViewIfNeeded();

    // Add first recommended item to cart
    const addToCartBtn = recommendedSection.locator('.add-to-cart').first();
    await addToCartBtn.click();

    // Verify modal shows product added
    await expect(page.locator('.modal-body')).toContainText('Your product has been added to cart');
    await page.locator('a[href="/view_cart"]').last().click();

    // Verify item is in cart
    const cartItems = page.locator('#cart_info_table tbody tr');
    const count = await cartItems.count();
    expect(count).toBe(1);
  });
});

test.describe('Favoritos @regression', () => {
  test('should add product to cart and verify it persists after navigation', async ({ page }) => {
    await page.goto('/products');

    // Add product to cart
    const firstProduct = page.locator('.features_items .col-sm-4').first();
    await firstProduct.hover();
    await firstProduct.locator('.product-overlay .add-to-cart').click();
    await page.locator('.modal-footer .btn-success').click();

    // Navigate to other pages
    await page.goto('/');
    await page.goto('/products');

    // Go to cart and verify item persists
    await page.goto('/view_cart');
    const cartItems = page.locator('#cart_info_table tbody tr');
    const count = await cartItems.count();
    expect(count).toBe(1);
  });

  test('should add multiple recommended items', async ({ page }) => {
    await page.goto('/');

    const recommendedSection = page.locator('.recommended_items');
    await recommendedSection.scrollIntoViewIfNeeded();

    // Add first item
    const addToCartBtn = recommendedSection.locator('.add-to-cart').first();
    await addToCartBtn.click();
    await page.locator('.modal-footer .btn-success').click();

    // Navigate carousel and add another
    await recommendedSection.locator('.right.recommended-item-control').click();
    await page.waitForTimeout(500);

    const secondBtn = recommendedSection.locator('.item.active .add-to-cart').first();
    await secondBtn.click();
    await page.locator('a[href="/view_cart"]').last().click();

    // Verify cart
    const cartItems = page.locator('#cart_info_table tbody tr');
    const count = await cartItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should keep cart items after login', async ({ page, loginPage, signupPage }) => {
    // Add product to cart before login
    await page.goto('/products');
    const firstProduct = page.locator('.features_items .col-sm-4').first();
    await firstProduct.hover();
    await firstProduct.locator('.product-overlay .add-to-cart').click();
    await page.locator('.modal-footer .btn-success').click();

    // Register new user
    const user = generateUser();
    await loginPage.navigate();
    await loginPage.startSignup(user.name, user.email);
    await signupPage.completeSignup(user);
    await signupPage.verifyAccountCreated();
    await signupPage.clickContinue();

    // Go to cart - items should persist
    await page.goto('/view_cart');
    const cartItems = page.locator('#cart_info_table tbody tr');
    const count = await cartItems.count();
    expect(count).toBe(1);

    // Cleanup
    await page.locator('a[href="/delete_account"]').click();
  });
});
