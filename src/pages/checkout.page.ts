import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly deliveryAddressSection: Locator;
  readonly billingAddressSection: Locator;
  readonly orderComment: Locator;
  readonly placeOrderButton: Locator;
  readonly cartItems: Locator;
  readonly totalAmount: Locator;
  readonly deliveryFirstName: Locator;
  readonly deliveryLastName: Locator;
  readonly deliveryAddress: Locator;
  readonly deliveryCity: Locator;
  readonly deliveryCountry: Locator;
  readonly deliveryPhone: Locator;

  constructor(page: Page) {
    this.page = page;
    this.deliveryAddressSection = page.locator('#address_delivery');
    this.billingAddressSection = page.locator('#address_invoice');
    this.orderComment = page.locator('textarea.form-control');
    this.placeOrderButton = page.locator('a.btn.btn-default.check_out');
    this.cartItems = page.locator('#cart_info tbody tr');
    this.totalAmount = page.locator('.cart_total_price').last();
    this.deliveryFirstName = page.locator('#address_delivery .address_firstname');
    this.deliveryLastName = page.locator('#address_delivery .address_lastname');
    this.deliveryAddress = page.locator('#address_delivery .address_address1');
    this.deliveryCity = page.locator('#address_delivery .address_city');
    this.deliveryCountry = page.locator('#address_delivery .address_country_name');
    this.deliveryPhone = page.locator('#address_delivery .address_phone');
  }

  async verifyCheckoutPageVisible() {
    await expect(this.deliveryAddressSection).toBeVisible();
    await expect(this.billingAddressSection).toBeVisible();
  }

  async verifyDeliveryAddress(name: string) {
    const fullName = await this.deliveryFirstName.textContent();
    expect(fullName).toContain(name);
  }

  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getTotalAmount(): Promise<string> {
    return (await this.totalAmount.textContent()) || '';
  }

  async addComment(comment: string) {
    await this.orderComment.fill(comment);
  }

  async clickPlaceOrder() {
    await this.placeOrderButton.click();
  }

  async verifyProductInCheckout(productName: string) {
    const productLocator = this.page.locator(`#cart_info_table a:has-text("${productName}")`);
    await expect(productLocator).toBeVisible();
  }
}
