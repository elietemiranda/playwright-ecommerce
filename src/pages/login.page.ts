import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly loginErrorMessage: Locator;
  readonly signupErrorMessage: Locator;
  readonly loginHeader: Locator;
  readonly signupHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    this.loginErrorMessage = page.locator('form[action="/login"] p');
    this.signupErrorMessage = page.getByText('Email Address already exist!');
    this.loginHeader = page.getByText('Login to your account');
    this.signupHeader = page.getByText('New User Signup!');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async startSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async verifyLoginPageVisible() {
    await expect(this.loginHeader).toBeVisible();
    await expect(this.signupHeader).toBeVisible();
  }

  async getLoginErrorMessage(): Promise<string> {
    return (await this.loginErrorMessage.textContent()) || '';
  }

  async getSignupErrorMessage(): Promise<string> {
    await this.signupErrorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return (await this.signupErrorMessage.textContent()) || '';
  }
}
