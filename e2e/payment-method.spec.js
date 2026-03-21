import { test, expect } from '@playwright/test';

test.describe('Luồng Thêm Thẻ Thanh Toán', () => {
  
  // Chạy trước mỗi test: Đăng nhập và điều hướng đến trang Phương thức thanh toán
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Đăng nhập
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.locator('input[name="email"]').fill('customer@travelmate.vn');
    await page.locator('input[name="password"]').fill('Customer@123');
    await page.getByRole('button', { name: 'Đăng nhập ngay' }).click();
    
    // Điều hướng vào Hồ sơ cá nhân
    await page.getByRole('button', { name: 'C FullName' }).click();
    await page.getByRole('link', { name: 'Hồ sơ cá nhân' }).click();
    await page.getByRole('button', { name: 'Phương thức thanh toán' }).click();
  });

  test('TC1: Thêm thẻ thành công', async ({ page }) => {
    await page.getByRole('button', { name: 'Thêm thẻ thanh toán mới' }).click();
    
    // Nhập tên chủ thẻ
    await page.getByRole('textbox', { name: 'NGUYEN VAN A' }).fill('BUI DANG QUANG');
    
    // Bắt Iframe của Stripe bằng title
    const stripeFrame = page.frameLocator('iframe[title*="Secure card payment"]');
    
    // ĐỢI Iframe render xong: Chờ ô input có name="cardnumber" xuất hiện
    await stripeFrame.locator('input[name="cardnumber"]').waitFor({ state: 'visible' });
    
    // Nhập thông tin bằng thuộc tính "name" cố định, không phụ thuộc ngôn ngữ
    await stripeFrame.locator('input[name="cardnumber"]').fill('4242 4242 4242 4242');
    await stripeFrame.locator('input[name="exp-date"]').fill('01 / 30');
    await stripeFrame.locator('input[name="cvc"]').fill('123');
    
    await page.getByRole('button', { name: 'Lưu thẻ an toàn' }).click();

    // KIỂM TRA: Không có thông báo lỗi
    await expect(page.getByText(/Lỗi:/i)).toBeHidden();
  });

  test('TC2: Thất bại - Năm hết hạn trong quá khứ', async ({ page }) => {
    await page.getByRole('button', { name: 'Thêm thẻ thanh toán mới' }).click();
    await page.getByRole('textbox', { name: 'NGUYEN VAN A' }).fill('BUI DANG QUANG');
    
    const stripeFrame = page.frameLocator('iframe[title*="Secure card payment"]');
    await stripeFrame.locator('input[name="cardnumber"]').waitFor({ state: 'visible' });
    
    await stripeFrame.locator('input[name="cardnumber"]').fill('4242 4242 4242 4242');
    // Cố tình nhập năm hết hạn trong quá khứ (2006)
    await stripeFrame.locator('input[name="exp-date"]').fill('01 / 06');
    await stripeFrame.locator('input[name="cvc"]').fill('123');
    
    await page.getByRole('button', { name: 'Lưu thẻ an toàn' }).click();

    // KIỂM TRA LỖI: Chấp nhận cả "Năm hết hạn" (VI) hoặc "expiration year" (EN)
    await expect(page.getByText(/Năm hết hạn|expiration year/i)).toBeVisible();
  });

  test('TC3: Thất bại - Số thẻ không hợp lệ', async ({ page }) => {
    await page.getByRole('button', { name: 'Thêm thẻ thanh toán mới' }).click();
    await page.getByRole('textbox', { name: 'NGUYEN VAN A' }).fill('BUI DANG QUANG');
    
    const stripeFrame = page.frameLocator('iframe[title*="Secure card payment"]');
    await stripeFrame.locator('input[name="cardnumber"]').waitFor({ state: 'visible' });
    
    // Cố tình nhập sai mã thẻ (có số 1)
    await stripeFrame.locator('input[name="cardnumber"]').fill('4242 4242 4142 4242');
    await stripeFrame.locator('input[name="exp-date"]').fill('01 / 30');
    await stripeFrame.locator('input[name="cvc"]').fill('123');
    
    await page.getByRole('button', { name: 'Lưu thẻ an toàn' }).click();

    // KIỂM TRA LỖI: Chấp nhận cả "không hợp lệ" (VI) hoặc "invalid" (EN)
    await expect(page.getByText(/không hợp lệ|invalid/i)).toBeVisible();
  });

});