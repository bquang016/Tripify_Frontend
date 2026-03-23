import { test, expect } from '@playwright/test';

test.describe('Luồng Quản lý Đơn đặt phòng (Owner)', () => {

  // Chạy trước mỗi test: Đăng nhập tài khoản Owner và vào trang Quản lý đơn
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.locator('input[name="email"]').fill('owner@travelmate.vn');
    await page.locator('input[name="password"]').fill('Owner@123');
    await page.getByRole('button', { name: 'Đăng nhập ngay' }).click();
    
    // Điều hướng vào Dashboard Owner
    await page.getByRole('button', { name: 'Trang quản lý' }).click();
    
    // Vào trang Quản lý đơn đặt phòng
    await page.getByRole('link', { name: 'Quản lý đơn đặt' }).click();
  });

  test('TC1: Thực hiện trọn vẹn quy trình Check-in và Check-out', async ({ page }) => {
    test.setTimeout(45000); // Tăng timeout đề phòng API load chậm

    // ==========================================
    // PHASE 1: CHECK-IN
    // ==========================================
    
    // Đợi danh sách đơn (nút Check-in đầu tiên) load xong rồi mới click
    const firstCheckInBtn = page.getByRole('button', { name: 'Check-in' }).first();
    await firstCheckInBtn.waitFor({ state: 'visible' });
    await firstCheckInBtn.click();
    
    // Xác nhận trên Modal
    await page.getByRole('button', { name: 'Xác nhận Check-in' }).click();
    
    // Kiểm tra thông báo thành công
    await expect(page.getByRole('heading', { name: 'Check-in Thành công!' })).toBeVisible();
    await expect(page.getByText(/Trạng thái đơn hàng đã được c/i)).toBeVisible();
    
    // Đóng Modal
    await page.getByRole('button', { name: 'Hoàn tất' }).click();

    // ==========================================
    // PHASE 2: CHECK-OUT
    // ==========================================
    
    // Chuyển sang Tab "Đang ở" (In-house)
    await page.getByRole('button', { name: 'Đang ở' }).click();
    
    // Đợi danh sách làm mới và xuất hiện nút Check-out
    const firstCheckOutBtn = page.getByRole('button', { name: 'Check-out' }).first();
    await firstCheckOutBtn.waitFor({ state: 'visible' });
    await firstCheckOutBtn.click();
    
    // Kiểm tra nội dung Modal cảnh báo Check-out
    await expect(page.getByRole('heading', { name: 'Xác nhận trả phòng?' })).toBeVisible();
    await expect(page.getByText(/Hành động này sẽ kết thúc kỳ/i)).toBeVisible();
    
    // Xác nhận Check-out
    await page.getByRole('button', { name: 'Đồng ý trả phòng' }).click();
    
    // Kiểm tra thông báo thành công cuối cùng
    await expect(page.getByRole('heading', { name: 'Trả phòng thành công!' })).toBeVisible();
    await expect(page.getByText(/Giao dịch đã được hoàn tất/i)).toBeVisible();
    
    // Đóng Modal
    await page.getByRole('button', { name: 'Đóng cửa sổ' }).click();
  });

});