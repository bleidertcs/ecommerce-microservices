import { test, expect } from '@playwright/test';

// Mock data
const mockProducts = [
  {
    id: 'prod-1',
    name: 'Mock Test Laptop',
    description: 'A powerful laptop for testing',
    price: 999.99,
    stock: 50,
    category: 'Electronics',
    images: [] 
  },
  {
    id: 'prod-2',
    name: 'Mock Test Phone',
    description: 'A smart phone for testing',
    price: 499.99,
    stock: 100,
    category: 'Electronics',
    images: []
  }
];

const mockOrderResponse = {
  id: 'order-test-123',
  userId: 'test-user',
  total: 999.99,
  status: 'PENDING',
  paymentStatus: 'UNPAID',
  items: [
    { productId: 'prod-1', quantity: 1, price: 999.99 }
  ],
  createdAt: new Date().toISOString()
};

test.describe('E-Commerce Core Flows with Mock Data', () => {

  test.beforeEach(async ({ page }) => {
    // Mock the products API
    await page.route('**/api/v1/products*', async route => {
      await route.fulfill({ json: mockProducts });
    });

    // Mock the orders API - GET and POST
    await page.route('**/api/v1/orders', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ json: { data: [mockOrderResponse] } });
      } else if (route.request().method() === 'POST') {
        await route.fulfill({ json: mockOrderResponse });
      } else {
        await route.continue();
      }
    });

    // Accept all dialogs (alerts)
    page.on('dialog', dialog => dialog.accept());
  });

  test('should display mock products on the products page', async ({ page }) => {
    await page.goto('/products');
    
    // The page should show our defined mock products
    await expect(page.locator('.card').filter({ hasText: 'Mock Test Laptop' }).locator('h3')).toBeVisible();
    await expect(page.locator('text=$999.99')).toBeVisible();
  });

  test('should allow adding product to cart and initiating checkout', async ({ page }) => {
    await page.goto('/products');
    
    // Set a mock authentication token so Buy Now works without redirecting to login
    await page.evaluate(() => {
      localStorage.setItem('lumina_token', 'mock-valid-json-web-token');
      localStorage.setItem('casdoor_user', JSON.stringify({ name: 'Test User', id: '123' }));
    });
    
    // Reload to apply mock token context
    await page.reload();

    // Now click Buy Now!
    const buyNowBtn = page.locator('.card').filter({ hasText: 'Mock Test Laptop' }).locator('button', { hasText: 'Buy Now' });
    
    // Notice that clicking Buy Now will trigger an alert via handleBuyNow() and then push to /orders
    await buyNowBtn.click();

    // Verify it navigates to the Orders page
    await page.waitForURL('**/orders');
    
    // Check that our simulated order list displays our order ID (it is sliced to 8 chars in UI: 'order-te')
    await expect(page.locator('text=order-te')).toBeVisible();
    await expect(page.locator('text=PENDING')).toBeVisible();
  });
});
