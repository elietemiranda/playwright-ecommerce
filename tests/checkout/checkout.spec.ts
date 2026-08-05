import { test, expect } from '../../src/fixtures/base.fixture';
import { generateUser } from '../../src/data/user.data';

test.describe('Checkout @smoke', () => {
  test.setTimeout(60000);

  test('should complete full checkout flow', async ({
    page,
    loginPage,
    signupPage,
    cartPage,
    checkoutPage,
    paymentPage,
  }) => {
    const user = generateUser();

    // Register user
    await loginPage.startSignup(user.name, user.email);
    await signupPage.completeSignup(user);
    await signupPage.verifyAccountCreated();
    await signupPage.clickContinue();

    // Add product to cart
    await page.goto('/products');
    const firstProduct = page.locator('.features_items .col-sm-4').first();
    await firstProduct.hover();
    await firstProduct.locator('.product-overlay .add-to-cart').click();
    await page.locator('.modal-footer .btn-success').click();

    // Go to cart and proceed to checkout
    await cartPage.navigate();
    await cartPage.verifyCartHasItems();
    await cartPage.clickProceedToCheckout();

    // Verify checkout page
    await checkoutPage.verifyCheckoutPageVisible();
    await checkoutPage.addComment('Please deliver between 9am - 5pm');
    await checkoutPage.clickPlaceOrder();

    // Complete payment
    await paymentPage.completePayment();

    // Cleanup
    await paymentPage.clickContinue();
    await page.locator('a[href="/delete_account"]').click();
  });
});

test.describe('Checkout @regression', () => {
  test.setTimeout(60000);

  test('should display delivery address correctly', async ({
    page,
    loginPage,
    signupPage,
    cartPage,
    checkoutPage,
  }) => {
    const user = generateUser();

    // Register
    await loginPage.startSignup(user.name, user.email);
    await signupPage.completeSignup(user);
    await signupPage.verifyAccountCreated();
    await signupPage.clickContinue();

    // Add product and go to checkout
    await page.goto('/products');
    const firstProduct = page.locator('.features_items .col-sm-4').first();
    await firstProduct.hover();
    await firstProduct.locator('.product-overlay .add-to-cart').click();
    await page.locator('.modal-footer .btn-success').click();

    await cartPage.navigate();
    await cartPage.clickProceedToCheckout();

    // Verify address info
    await checkoutPage.verifyCheckoutPageVisible();
    await checkoutPage.verifyDeliveryAddress(user.title);

    // Cleanup
    await page.goto('/');
    await page.locator('a[href="/delete_account"]').click();
  });

  test('should show products in checkout review', async ({
    page,
    loginPage,
    signupPage,
    cartPage,
    checkoutPage,
  }) => {
    const user = generateUser();

    // Register
    await loginPage.startSignup(user.name, user.email);
    await signupPage.completeSignup(user);
    await signupPage.verifyAccountCreated();
    await signupPage.clickContinue();

    // Add product
    await page.goto('/products');
    const firstProduct = page.locator('.features_items .col-sm-4').first();
    await firstProduct.hover();
    await firstProduct.locator('.product-overlay .add-to-cart').click();
    await page.locator('.modal-footer .btn-success').click();

    await cartPage.navigate();
    await cartPage.clickProceedToCheckout();

    // Verify products listed in checkout
    const itemsCount = await checkoutPage.getCartItemsCount();
    expect(itemsCount).toBeGreaterThan(0);

    const total = await checkoutPage.getTotalAmount();
    expect(total).toMatch(/Rs\.\s*\d+/);

    // Cleanup
    await page.goto('/');
    await page.locator('a[href="/delete_account"]').click();
  });

  test('should require login for checkout', async ({ page, cartPage }) => {
    // Add product without being logged in
    await page.goto('/products');
    const firstProduct = page.locator('.features_items .col-sm-4').first();
    await firstProduct.hover();
    await firstProduct.locator('.product-overlay .add-to-cart').click();
    await page.locator('.modal-footer .btn-success').click();

    // Try to checkout
    await cartPage.navigate();
    await cartPage.clickProceedToCheckout();

    // Should show login/register modal
    await expect(page.locator('.modal-body')).toContainText('Register / Login');
  });
});
