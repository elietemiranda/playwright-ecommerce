import { Page, Locator, expect } from '@playwright/test';
import { UserData } from '../data/user.data';

export class SignupPage {
  readonly page: Page;
  readonly titleMr: Locator;
  readonly titleMrs: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly birthDaySelect: Locator;
  readonly birthMonthSelect: Locator;
  readonly birthYearSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly offersCheckbox: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly addressInput: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedMessage: Locator;
  readonly continueButton: Locator;
  readonly accountInfoHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleMr = page.locator('#id_gender1');
    this.titleMrs = page.locator('#id_gender2');
    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.birthDaySelect = page.locator('#days');
    this.birthMonthSelect = page.locator('#months');
    this.birthYearSelect = page.locator('#years');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.offersCheckbox = page.locator('#optin');
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.companyInput = page.locator('#company');
    this.addressInput = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.locator('#mobile_number');
    this.createAccountButton = page.locator('[data-qa="create-account"]');
    this.accountCreatedMessage = page.locator('[data-qa="account-created"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
    this.accountInfoHeader = page.getByText('Enter Account Information');
  }

  async fillAccountInfo(user: UserData) {
    // Title
    if (user.title === 'Mr') {
      await this.titleMr.check();
    } else {
      await this.titleMrs.check();
    }

    await this.passwordInput.fill(user.password);
    await this.birthDaySelect.selectOption(user.birthDay);
    await this.birthMonthSelect.selectOption(user.birthMonth);
    await this.birthYearSelect.selectOption(user.birthYear);
  }

  async checkNewsletterAndOffers() {
    await this.newsletterCheckbox.check();
    await this.offersCheckbox.check();
  }

  async fillAddressInfo(user: UserData) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.companyInput.fill(user.company);
    await this.addressInput.fill(user.address);
    await this.address2Input.fill(user.address2);
    await this.countrySelect.selectOption(user.country);
    await this.stateInput.fill(user.state);
    await this.cityInput.fill(user.city);
    await this.zipcodeInput.fill(user.zipcode);
    await this.mobileNumberInput.fill(user.mobileNumber);
  }

  async submitSignup() {
    await this.createAccountButton.click();
  }

  async completeSignup(user: UserData) {
    await this.fillAccountInfo(user);
    await this.checkNewsletterAndOffers();
    await this.fillAddressInfo(user);
    await this.submitSignup();
  }

  async verifyAccountCreated() {
    await expect(this.accountCreatedMessage).toBeVisible();
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async verifySignupFormVisible() {
    await expect(this.accountInfoHeader).toBeVisible();
  }
}
