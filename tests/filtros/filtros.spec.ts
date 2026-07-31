import { test, expect } from '../../src/fixtures/base.fixture';

test.describe('Filtros - Categorias @smoke', () => {
  test('should display category sidebar', async ({ productsPage }) => {
    await expect(productsPage.categorySection).toBeVisible();
  });

  test('should filter products by Women > Dress category', async ({ productsPage, page }) => {
    await productsPage.clickSubCategory('Women', 'Dress');

    await expect(page).toHaveURL(/category_products/);
    const title = await productsPage.getCategoryTitle();
    expect(title).toContain('Women - Dress Products');

    const count = await productsPage.getProductsCount();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Filtros - Categorias @regression', () => {
  test('should filter products by Men > Tshirts category', async ({ productsPage, page }) => {
    await productsPage.clickSubCategory('Men', 'Tshirts');

    await expect(page).toHaveURL(/category_products/);
    const title = await productsPage.getCategoryTitle();
    expect(title).toContain('Men - Tshirts Products');

    const count = await productsPage.getProductsCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter products by Kids > Dress category', async ({ productsPage, page }) => {
    await productsPage.clickSubCategory('Kids', 'Dress');

    await expect(page).toHaveURL(/category_products/);
    const title = await productsPage.getCategoryTitle();
    expect(title).toContain('Kids - Dress Products');

    const count = await productsPage.getProductsCount();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Filtros - Marcas @smoke', () => {
  test('should display brands sidebar', async ({ productsPage }) => {
    await expect(productsPage.brandsSection).toBeVisible();
  });

  test('should filter products by brand', async ({ productsPage, page }) => {
    await productsPage.clickBrand('Polo');

    await expect(page).toHaveURL(/brand_products\/Polo/);
    const title = await productsPage.getBrandTitle();
    expect(title).toContain('Polo');

    const count = await productsPage.getProductsCount();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Filtros - Marcas @regression', () => {
  test('should filter by H&M brand', async ({ productsPage, page }) => {
    await productsPage.clickBrand('H&M');

    await expect(page).toHaveURL(/brand_products/);
    const title = await productsPage.getBrandTitle();
    expect(title).toContain('H&M');

    const count = await productsPage.getProductsCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter by Madame brand', async ({ productsPage, page }) => {
    await productsPage.clickBrand('Madame');

    await expect(page).toHaveURL(/brand_products\/Madame/);
    const title = await productsPage.getBrandTitle();
    expect(title).toContain('Madame');

    const count = await productsPage.getProductsCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should switch between brands', async ({ productsPage, page }) => {
    await productsPage.clickBrand('Polo');
    await expect(page).toHaveURL(/brand_products\/Polo/);

    const poloCount = await productsPage.getProductsCount();
    expect(poloCount).toBeGreaterThan(0);

    await productsPage.clickBrand('Madame');
    await expect(page).toHaveURL(/brand_products\/Madame/);

    const madameCount = await productsPage.getProductsCount();
    expect(madameCount).toBeGreaterThan(0);
  });
});
