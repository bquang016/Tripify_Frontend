import { test, expect } from '@playwright/test';

test.describe('Luồng Đăng Nhập Tripify', () => {
  
  // beforeEach sẽ chạy trước mỗi test case, giúp giảm lặp code khởi tạo
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
  });

  test('Đăng nhập thành công với tài khoản hợp lệ', async ({ page }) => {
    // Playwright's fill() tự động xóa dữ liệu cũ và gõ mới, không cần click hay dblclick
    await page.locator('input[name="email"]').fill('customer@travelmate.vn');
    await page.locator('input[name="password"]').fill('Customer@123');
    await page.getByRole('button', { name: 'Đăng nhập ngay' }).click();

    // KIỂM TRA KẾT QUẢ (Assertion)
    // Bạn cần thay đổi phần này tùy theo UI của Tripify. 
    // Ví dụ: Kiểm tra xem form đăng nhập đã biến mất chưa
    await expect(page.locator('input[name="email"]')).toBeHidden();
    
    // Hoặc kiểm tra xem có thông báo chào mừng không (Nếu có toast message)
    // await expect(page.getByText('Đăng nhập thành công')).toBeVisible();
    
    // Hoặc kiểm tra xem nút "Đăng nhập" trên Header đã đổi thành Avatar user chưa
    // await expect(page.getByAltText('User Avatar')).toBeVisible();
  });

  test('Đăng nhập thất bại khi nhập sai mật khẩu', async ({ page }) => {
    await page.locator('input[name="email"]').fill('customer@travelmate.vn');
    await page.locator('input[name="password"]').fill('Customer@12'); // Mật khẩu sai
    await page.getByRole('button', { name: 'Đăng nhập ngay' }).click();

    // KIỂM TRA KẾT QUẢ (Assertion)
    // Đảm bảo rằng thông báo lỗi xuất hiện trên màn hình
    const errorMessage = page.getByRole('heading', { name: 'Thông tin không chính xác' });
    await expect(errorMessage).toBeVisible();
    
    // Đảm bảo user vẫn ở lại trang/modal đăng nhập (form vẫn còn đó)
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

});