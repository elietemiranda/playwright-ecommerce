import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly logo: Locator;
  readonly navbar: Locator;
  readonly productsSection: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly categorySection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('img[alt="Website for automation practice"]');
    this.navbar = page.locator('.navbar-nav');
    this.productsSection = page.locator('.features_items');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.categorySection = page.locator('.left-sidebar');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async isLogoVisible(): Promise<boolean> {
    return await this.logo.isVisible();
  }

  async isNavbarVisible(): Promise<boolean> {
    return await this.navbar.isVisible();
  }

  async clickNavItem(itemName: string) {
    await this.navbar.locator(`a:has-text("${itemName}")`).click();
  }

  async getProductsCount(): Promise<number> {
    return await this.productsSection.locator('.col-sm-4').count();
  }
}
