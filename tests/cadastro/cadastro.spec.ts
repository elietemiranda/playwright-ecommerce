import { test, expect } from '../../src/fixtures/base.fixture';
import { generateUser } from '../../src/data/user.data';

test.describe('Cadastro @smoke', () => {
  test('should register a new user successfully', async ({ loginPage, signupPage, page }) => {
    const user = generateUser();

    await loginPage.startSignup(user.name, user.email);
    await signupPage.verifySignupFormVisible();
    await signupPage.completeSignup(user);
    await signupPage.verifyAccountCreated();
    await signupPage.clickContinue();

    // Verify user is logged in
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();

    // Cleanup: delete account
    await page.locator('a[href="/delete_account"]').click();
    await expect(page.getByText('Account Deleted!')).toBeVisible();
  });
});

test.describe('Cadastro @regression', () => {
  test('should show signup form fields correctly', async ({ loginPage, signupPage }) => {
    const user = generateUser();

    await loginPage.startSignup(user.name, user.email);
    await signupPage.verifySignupFormVisible();

    // Verify pre-filled fields
    await expect(signupPage.nameInput).toHaveValue(user.name);
    await expect(signupPage.emailInput).toHaveValue(user.email);
  });

  test('should show error for already registered email', async ({ loginPage, page }) => {
    const user = generateUser();

    // Register user via API first
    await page.request.post('https://automationexercise.com/api/createAccount', {
      form: {
        name: user.name,
        email: user.email,
        password: user.password,
        title: user.title,
        birth_date: user.birthDay,
        birth_month: user.birthMonth,
        birth_year: user.birthYear,
        firstname: user.firstName,
        lastname: user.lastName,
        company: user.company,
        address1: user.address,
        address2: user.address2,
        country: user.country,
        zipcode: user.zipcode,
        state: user.state,
        city: user.city,
        mobile_number: user.mobileNumber,
      },
    });

    // Try to signup with same email via UI
    await loginPage.startSignup(user.name, user.email);

    const errorMessage = await loginPage.getSignupErrorMessage();
    expect(errorMessage).toContain('Email Address already exist!');

    // Cleanup via API
    await page.request.delete('https://automationexercise.com/api/deleteAccount', {
      form: { email: user.email, password: user.password },
    });
  });

  test('should register with newsletter and offers checked', async ({
    loginPage,
    signupPage,
    page,
  }) => {
    const user = generateUser();

    await loginPage.startSignup(user.name, user.email);
    await signupPage.fillAccountInfo(user);
    await signupPage.checkNewsletterAndOffers();
    await signupPage.fillAddressInfo(user);
    await signupPage.submitSignup();
    await signupPage.verifyAccountCreated();
    await signupPage.clickContinue();

    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();

    // Cleanup
    await page.locator('a[href="/delete_account"]').click();
  });
});
