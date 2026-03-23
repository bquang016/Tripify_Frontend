import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// Tái tạo lại __dirname trong môi trường ES Module của Vite
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Luồng Quản lý Phòng (Owner)', () => {

  // Chạy trước mỗi test: Đăng nhập và vào đúng giao diện Quản lý phòng
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Đăng nhập tài khoản Owner
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.locator('input[name="email"]').fill('owner@travelmate.vn');
    await page.locator('input[name="password"]').fill('Owner@123');
    await page.getByRole('button', { name: 'Đăng nhập ngay' }).click();
    
    // Điều hướng vào trang Quản lý phòng
    await page.getByRole('button', { name: 'Trang quản lý' }).click();
    await page.getByRole('link', { name: 'Quản lý phòng' }).click();
    
    // Chọn khách sạn đầu tiên để quản lý
    await page.getByRole('button', { name: 'Quản lý phòng' }).first().click();
  });

  test('TC1: Thêm phòng mới thành công', async ({ page }) => {
    const img1 = path.join(__dirname, 'fixtures', 'sample1.jpg');
    const img2 = path.join(__dirname, 'fixtures', 'sample2.jpg');
    const img3 = path.join(__dirname, 'fixtures', 'sample3.jpg');
    const img4 = path.join(__dirname, 'fixtures', 'sample4.jpg');

    await page.getByRole('button', { name: 'Thêm phòng mới' }).click();

    // 1. ĐIỀN THÔNG TIN CƠ BẢN
    await page.getByRole('textbox', { name: /Tên phòng/i }).fill('Phòng 100');
    await page.getByRole('spinbutton', { name: /Sức chứa/i }).fill('2');
    await page.getByRole('textbox', { name: /Giá một đêm/i }).fill('1000000');
    await page.getByRole('textbox', { name: 'Mô tả phòng' }).fill('Phòng Suite cao cấp, view hướng biển tuyệt đẹp, đầy đủ tiện nghi tiêu chuẩn 5 sao.');

    // 2. CHỌN TIỆN ÍCH
    await page.locator('label').filter({ hasText: 'TV' }).click();
    await page.locator('label').filter({ hasText: 'Minibar' }).click();
    await page.locator('label').filter({ hasText: 'Điều hòa' }).click();

    // 3. UPLOAD ẢNH & LƯU
    await page.locator('input[type="file"]').setInputFiles([img1, img2, img3, img4]);
    await page.getByRole('button', { name: 'Tạo phòng ngay' }).click();

    // 4. KIỂM TRA THÀNH CÔNG
    await expect(page.getByText('Tạo thành công!')).toBeVisible({ timeout: 10000 });
  });

  test('TC2: Thất bại - Thêm phòng trùng tên đã có', async ({ page }) => {
    // Lưu ý: TC này dùng chung data với TC1, đảm bảo TC1 chạy trước hoặc Phòng 102 đã có trong DB
    await page.getByRole('button', { name: 'Thêm phòng mới' }).click();

    // Cố tình điền lại tên Phòng 102
    const roomNameInput = page.getByRole('textbox', { name: /Tên phòng/i });
    await roomNameInput.fill('Phòng 102');
    
    // Bấm ra ngoài (blur) để kích hoạt validate của Form (Tuỳ thuộc logic code frontend của bạn)
    await roomNameInput.blur();
    
    // Nếu UI của bạn chỉ hiển thị lỗi khi bấm "Tạo phòng ngay", hãy mở comment dòng dưới:
    // await page.getByRole('button', { name: 'Tạo phòng ngay' }).click();

    // KIỂM TRA LỖI (Dùng Regex để bắt một phần chuỗi cho an toàn)
    await expect(page.getByText(/Tên phòng đã tồn tại/i)).toBeVisible();
    
    // (Tuỳ chọn) Bấm nút tắt/huỷ modal đi cho sạch sẽ
    // await page.getByRole('button').filter({ hasText: /^$/ }).nth(5).click(); // Thay bằng nút Hủy/Close nếu có name rõ ràng
  });

});