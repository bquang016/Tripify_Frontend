import { test, expect } from '@playwright/test';

test.describe('Luồng Đăng Ký Tripify', () => {
  
  // Chạy trước mỗi test case: Vào trang chủ và mở form đăng ký
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'Đăng ký' }).click();
  });

  test('TC1: Đăng ký thành công - Hiện form nhập OTP', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Họ và tên đầy đủ' }).fill('Bùi Đăng Quang');
    await page.getByRole('textbox', { name: 'Email' }).fill('thienlong010605@gmail.com');
    await page.getByRole('textbox', { name: 'Mật khẩu', exact: true }).fill('Matkhau123@');
    await page.getByRole('textbox', { name: 'Nhập lại mật khẩu' }).fill('Matkhau123@');
    await page.getByRole('checkbox', { name: 'Tôi đồng ý với Điều khoản và' }).check();
    
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();

    // Xác nhận form OTP xuất hiện
    await expect(page.getByText(/Nhập mã OTP đã gửi/i)).toBeVisible();
  });

  test('TC2: Đăng ký thất bại - Mật khẩu xác nhận không khớp', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Họ và tên đầy đủ' }).fill('Bùi Đăng Quang');
    await page.getByRole('textbox', { name: 'Email' }).fill('thienlong010605@gmail.com');
    
    // Cố tình nhập mật khẩu xác nhận sai
    await page.getByRole('textbox', { name: 'Mật khẩu', exact: true }).fill('010605quanG@');
    await page.getByRole('textbox', { name: 'Nhập lại mật khẩu' }).fill('010605quanG@a'); 
    
    await page.getByRole('checkbox', { name: 'Tôi đồng ý với Điều khoản và' }).check();
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();

    // Xác nhận thông báo lỗi hiển thị
    await expect(page.getByText('Mật khẩu xác nhận không khớp.')).toBeVisible();
  });

  test('TC3: Đăng ký thất bại - Mật khẩu không đủ mạnh', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Họ và tên đầy đủ' }).fill('Bùi Đăng Quang');
    await page.getByRole('textbox', { name: 'Email' }).fill('thienlong010605@gmail.com');
    
    // Nhập mật khẩu thiếu ký tự đặc biệt
    await page.getByRole('textbox', { name: 'Mật khẩu', exact: true }).fill('010605quanG');
    
    // Tùy vào UI của bạn, thông báo này có thể hiện ra ngay lập tức khi đang gõ 
    // hoặc sau khi click ra ngoài (focus out). Ta giả lập click sang ô khác để kích hoạt validate.
    await page.getByRole('textbox', { name: 'Nhập lại mật khẩu' }).click();

    // Xác nhận các cảnh báo mật khẩu yếu hiển thị
    await expect(page.getByText(/Mật khẩu chưa đủ mạnh/i)).toBeVisible();
    await expect(page.getByText('số', { exact: true })).toBeVisible();
    await expect(page.getByText('chữ in hoa', { exact: true })).toBeVisible();
    await expect(page.getByText('ký tự đặc biệt', { exact: true })).toBeVisible();
  });

});