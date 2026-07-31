import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productsList: Locator;
  readonly productCards: Locator;
  readonly searchedProductsTitle: Locator;
  readonly allProductsTitle: Locator;
  readonly categorySection: Locator;
  readonly brandsSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.productsList = page.locator('.features_items');
    this.productCards = page.locator('.features_items .col-sm-4');
    this.searchedProductsTitle = page.getByText('Searched Products');
    this.allProductsTitle = page.getByText('All Products');
    this.categorySection = page.locator('.left-sidebar .panel-group#accordian');
    this.brandsSection = page.locator('.left-sidebar .brands_products');
  }

  async navigate() {
    await this.page.goto('/products');
  }

  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async getProductsCount(): Promise<number> {
    return await this.productCards.count();
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.productsList.locator('.productinfo p').allTextContents();
    return names;
  }

  async verifyAllProductsVisible() {
    await expect(this.allProductsTitle).toBeVisible();
    const count = await this.getProductsCount();
    expect(count).toBeGreaterThan(0);
  }

  async verifySearchedProductsVisible() {
    await expect(this.searchedProductsTitle).toBeVisible();
  }

  // Category methods
  async clickCategory(categoryName: string) {
    await this.categorySection
      .locator(`a:has-text("${categoryName}")`)
      .first()
      .click();
  }

  async clickSubCategory(parentCategory: string, subCategory: string) {
    // Expand parent category using href attribute for exact match
    await this.categorySection
      .locator(`.panel-heading a[href="#${parentCategory}"]`)
      .click();

    // Wait for panel to expand then click subcategory
    await this.categorySection
      .locator(`#${parentCategory}`)
      .locator(`a:has-text("${subCategory}")`)
      .click();
  }

  async getCategoryTitle(): Promise<string> {
    const text = (await this.page.locator('.title.text-center').textContent()) || '';
    return text.replace(/\s+/g, ' ').trim();
  }

  // Brand methods
  async clickBrand(brandName: string) {
    await this.brandsSection.locator(`a:has-text("${brandName}")`).click();
  }

  async getBrandTitle(): Promise<string> {
    return (await this.page.locator('.title.text-center').textContent()) || '';
  }

  // Product detail
  async viewProductDetails(index: number) {
    await this.productsList
      .locator(`a:has-text("View Product")`)
      .nth(index)
      .click();
  }

  async getProductPrice(index: number): Promise<string> {
    return (
      (await this.productCards.nth(index).locator('.productinfo h2').textContent()) || ''
    );
  }
}
