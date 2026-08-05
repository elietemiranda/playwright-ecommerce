import { Page, Locator, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class PaymentPage {
  readonly page: Page;
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;
  readonly successMessage: Locator;
  readonly downloadInvoiceButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payButton = page.locator('[data-qa="pay-button"]');
    this.successMessage = page.locator('[data-qa="order-placed"]');
    this.downloadInvoiceButton = page.locator('.btn.btn-default.check_out');
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  async fillPaymentDetails(cardInfo?: {
    name?: string;
    number?: string;
    cvc?: string;
    month?: string;
    year?: string;
  }) {
    const info = {
      name: cardInfo?.name || faker.person.fullName(),
      number: cardInfo?.number || '4100000000000000',
      cvc: cardInfo?.cvc || faker.finance.creditCardCVV(),
      month: cardInfo?.month || faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0'),
      year: cardInfo?.year || faker.number.int({ min: 2025, max: 2030 }).toString(),
    };

    await this.nameOnCardInput.fill(info.name);
    await this.cardNumberInput.fill(info.number);
    await this.cvcInput.fill(info.cvc);
    await this.expiryMonthInput.fill(info.month);
    await this.expiryYearInput.fill(info.year);
  }

  async submitPayment() {
    await this.payButton.click();
  }

  async verifyOrderPlaced() {
    await expect(this.successMessage).toBeVisible();
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async completePayment(cardInfo?: {
    name?: string;
    number?: string;
    cvc?: string;
    month?: string;
    year?: string;
  }) {
    await this.fillPaymentDetails(cardInfo);
    await this.submitPayment();
    await this.verifyOrderPlaced();
  }
}
