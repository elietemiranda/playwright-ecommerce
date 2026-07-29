import { test, expect } from '../../src/fixtures/base.fixture';

test.describe('Home Page @smoke', () => {
  test('should load the home page successfully', async ({ homePage }) => {
    const title = await homePage.getTitle();
    expect(title).toContain('Automation Exercise');
  });

  test('should display the logo', async ({ homePage }) => {
    expect(await homePage.isLogoVisible()).toBeTruthy();
  });

  test('should display the navigation bar', async ({ homePage }) => {
    expect(await homePage.isNavbarVisible()).toBeTruthy();
  });

  test('should display products on the home page', async ({ homePage }) => {
    const productsCount = await homePage.getProductsCount();
    expect(productsCount).toBeGreaterThan(0);
  });
});
