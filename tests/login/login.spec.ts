import { test, expect } from '../../src/fixtures/base.fixture';
import { generateLoginCredentials } from '../../src/data/user.data';

test.describe('Login @smoke', () => {
  test('should display login page correctly', async ({ loginPage }) => {
    await loginPage.verifyLoginPageVisible();
  });

  test('should show error with invalid credentials', async ({ loginPage }) => {
    const credentials = generateLoginCredentials();
    await loginPage.login(credentials.email, credentials.password);

    const errorMessage = await loginPage.getLoginErrorMessage();
    expect(errorMessage).toContain('Your email or password is incorrect!');
  });
});

test.describe('Login @regression', () => {
  test('should show error with empty email', async ({ loginPage }) => {
    await loginPage.login('', 'password123');

    // Browser validation prevents submission with empty fields
    const emailInput = loginPage.loginEmailInput;
    await expect(emailInput).toBeVisible();
  });

  test('should show error with empty password', async ({ loginPage }) => {
    await loginPage.login('test@test.com', '');

    const passwordInput = loginPage.loginPasswordInput;
    await expect(passwordInput).toBeVisible();
  });

  test('should navigate to login page from navbar', async ({ homePage, page }) => {
    await homePage.clickNavItem('Signup / Login');
    await expect(page).toHaveURL(/login/);
  });
});
