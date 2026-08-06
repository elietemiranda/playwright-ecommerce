import { test, expect } from '../../src/fixtures/base.fixture';
import { generateUser } from '../../src/data/user.data';

// All logout tests involve registration flow — increase timeout
test.setTimeout(60000);
// Run sequentially to avoid overloading the external site
test.describe.configure({ mode: 'serial' });

test.describe('Logout @smoke', () => {
  test('should logout successfully after login', async ({ page, loginPage, signupPage }) => {
    const user = generateUser();

    // Register user
    await loginPage.startSignup(user.name, user.email);
    await signupPage.completeSignup(user);
    await signupPage.verifyAccountCreated();
    await signupPage.clickContinue();

    // Verify logged in
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();

    // Logout
    await page.locator('a[href="/logout"]').click();

    // Verify redirected to login page
    await expect(page).toHaveURL(/login/);
    await expect(page.getByText('Login to your account')).toBeVisible();
  });
});

test.describe('Logout @regression', () => {
  test('should not show logged-in links after logout', async ({
    page,
    loginPage,
    signupPage,
  }) => {
    const user = generateUser();

    // Register and logout
    await loginPage.startSignup(user.name, user.email);
    await signupPage.completeSignup(user);
    await signupPage.verifyAccountCreated();
    await signupPage.clickContinue();
    await page.locator('a[href="/logout"]').click();
    await expect(page).toHaveURL(/login/);

    // Logged-in nav items should be gone
    await expect(page.locator('a[href="/logout"]')).not.toBeVisible();
    await expect(page.locator('a[href="/delete_account"]')).not.toBeVisible();
  });

  test('should show login/signup links after logout', async ({
    page,
    loginPage,
    signupPage,
  }) => {
    const user = generateUser();

    // Register and logout
    await loginPage.startSignup(user.name, user.email);
    await signupPage.completeSignup(user);
    await signupPage.verifyAccountCreated();
    await signupPage.clickContinue();
    await page.locator('a[href="/logout"]').click();

    // Navigate to home and verify navbar shows login link
    await page.goto('/');
    await expect(page.locator('a[href="/login"]')).toBeVisible();
    await expect(page.locator('a[href="/logout"]')).not.toBeVisible();
  });

  test('should be able to login again after logout', async ({
    page,
    loginPage,
    signupPage,
  }) => {
    const user = generateUser();

    // Register
    await loginPage.startSignup(user.name, user.email);
    await signupPage.completeSignup(user);
    await signupPage.verifyAccountCreated();
    await signupPage.clickContinue();

    // Logout
    await page.locator('a[href="/logout"]').click();
    await expect(page).toHaveURL(/login/);

    // Login again with same credentials
    await loginPage.login(user.email, user.password);
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();

    // Cleanup
    await page.locator('a[href="/delete_account"]').click();
  });
});
