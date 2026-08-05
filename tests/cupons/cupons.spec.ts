import { test, expect } from '../../src/fixtures/base.fixture';
import { generateUser } from '../../src/data/user.data';

test.describe('Cupons @smoke', () => {
  test('should display subscription field on cart page', async ({ page }) => {
    await page.goto('/view_cart');
    const subscriptionSection = page.locator('#susbscribe_email');
    await expect(subscriptionSection).toBeVisible();
  });
});

test.describe('Cupons @regression', () => {
  test.setTimeout(60000);

  test('should subscribe with email from cart page', async ({ page }) => {
    await page.goto('/view_cart');

    const emailInput = page.locator('#susbscribe_email');
    await emailInput.fill('test@testmail.com');
    await page.locator('#subscribe').click();

    await expect(page.getByText('You have been successfully subscribed!')).toBeVisible();
  });

  test('should verify order total matches product prices', async ({
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

    // Go to cart
    await cartPage.navigate();
    const cartPrice = await cartPage.getProductPrice(0);

    // Proceed to checkout
    await cartPage.clickProceedToCheckout();
    const checkoutTotal = await checkoutPage.getTotalAmount();

    // Prices should match
    expect(checkoutTotal).toContain(cartPrice.replace('Rs. ', '').trim());

    // Cleanup
    await page.goto('/');
    await page.locator('a[href="/delete_account"]').click();
  });

  test('should place order and download invoice', async ({
    page,
    loginPage,
    signupPage,
    cartPage,
    checkoutPage,
    paymentPage,
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

    // Checkout
    await cartPage.navigate();
    await cartPage.clickProceedToCheckout();
    await checkoutPage.addComment('Test order with invoice');
    await checkoutPage.clickPlaceOrder();

    // Pay
    await paymentPage.completePayment();

    // Verify download invoice button is visible
    await expect(paymentPage.downloadInvoiceButton).toBeVisible();

    // Cleanup
    await paymentPage.clickContinue();
    await page.locator('a[href="/delete_account"]').click();
  });
});
