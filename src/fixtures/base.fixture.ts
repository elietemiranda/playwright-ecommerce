import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { SignupPage } from '../pages/signup.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';

type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await use(homePage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
  },

  signupPage: async ({ page }, use) => {
    const signupPage = new SignupPage(page);
    await use(signupPage);
  },

  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await productsPage.navigate();
    await use(productsPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
});

export { expect } from '@playwright/test';
