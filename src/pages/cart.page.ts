import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly quantityInputs: Locator;
  readonly cartInfoTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('#cart_info_table tbody tr');
    this.emptyCartMessage = page.getByText('Cart is empty!');
    this.proceedToCheckoutButton = page.locator('.btn.btn-default.check_out');
    this.quantityInputs = page.locator('.cart_quantity button');
    this.cartInfoTable = page.locator('#cart_info_table');
  }

  async navigate() {
    await this.page.goto('/view_cart');
  }

  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getProductName(index: number): Promise<string> {
    return (
      (await this.cartItems.nth(index).locator('.cart_description h4 a').textContent()) || ''
    );
  }

  async getProductPrice(index: number): Promise<string> {
    return (
      (await this.cartItems.nth(index).locator('.cart_price p').textContent()) || ''
    );
  }

  async getProductQuantity(index: number): Promise<string> {
    return (
      (await this.cartItems.nth(index).locator('.cart_quantity button').textContent()) || ''
    );
  }

  async getProductTotal(index: number): Promise<string> {
    return (
      (await this.cartItems.nth(index).locator('.cart_total_price').textContent()) || ''
    );
  }

  async removeProduct(index: number) {
    await this.cartItems.nth(index).locator('.cart_quantity_delete .cart_quantity_delete').click();
  }

  async removeProductById(productId: string) {
    await this.page.locator(`a.cart_quantity_delete[data-id="${productId}"]`).click();
  }

  async verifyCartIsEmpty() {
    // When cart is empty, the cart info table is not rendered or has no items
    const itemsCount = await this.cartItems.count();
    expect(itemsCount).toBe(0);
  }

  async verifyCartHasItems() {
    const count = await this.getCartItemsCount();
    expect(count).toBeGreaterThan(0);
  }

  async clickProceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

  // Add product to cart from products page
  async addProductToCartFromList(page: Page, productIndex: number) {
    await page.goto('/products');
    const productCard = page.locator('.features_items .col-sm-4').nth(productIndex);
    await productCard.locator('.product-overlay .add-to-cart').click({ force: true });
    await page.locator('.modal-footer .btn-success').click(); // Continue Shopping
  }

  async addProductAndViewCart(page: Page, productIndex: number) {
    await page.goto('/products');
    const productCard = page.locator('.features_items .col-sm-4').nth(productIndex);
    await productCard.hover();
    await productCard.locator('.product-overlay .add-to-cart').click();
    await page.locator('a[href="/view_cart"]').last().click(); // View Cart from modal
  }
}
