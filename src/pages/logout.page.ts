import { Page, Locator, expect } from '@playwright/test';

export class LogoutPage {
  readonly page: Page;
  readonly logoutLink: Locator;
  readonly loggedInAsText: Locator;
  readonly loginHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutLink = page.locator('a[href="/logout"]');
    this.loggedInAsText = page.locator('a:has-text("Logged in as")');
    this.loginHeader = page.getByText('Login to your account');
  }

  async logout() {
    await this.logoutLink.click();
  }

  async verifyLoggedIn() {
    await expect(this.loggedInAsText).toBeVisible();
  }

  async verifyLoggedOut() {
    await expect(this.loginHeader).toBeVisible();
    await expect(this.page).toHaveURL(/login/);
  }
}
