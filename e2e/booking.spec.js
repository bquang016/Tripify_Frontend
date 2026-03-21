import { test, expect } from '@playwright/test';

test.describe('Luồng Đặt Phòng & Thanh Toán Tripify', () => {

  // Tách bước đăng nhập ra beforeEach để code gọn gàng, tái sử dụng được nếu sau này thêm Test case
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Đăng nhập tài khoản khách hàng
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.locator('input[name="email"]').fill('customer@travelmate.vn');
    await page.locator('input[name="password"]').fill('Customer@123');
    await page.getByRole('button', { name: 'Đăng nhập ngay' }).click();
    
    // Đợi một chút để đảm bảo đăng nhập xong và quay về trang chủ
    await page.waitForURL('http://localhost:5173/');
  });

  test('TC1: Đặt phòng và thanh toán thành công với thẻ đã lưu', async ({ page }) => {
    test.setTimeout(60000); // Tăng timeout cho test này lên 60s vì luồng thanh toán có thể tốn thời gian load

    // 1. TÌM KIẾM KHÁCH SẠN
    await page.getByRole('textbox', { name: 'Bạn muốn đi đâu?' }).click();
    await page.getByRole('button', { name: 'Hà Nội' }).click();
    await page.getByRole('button', { name: 'Tìm kiếm' }).click();

    // 2. CHỌN KHÁCH SẠN VÀ PHÒNG ĐẦU TIÊN
    // Dùng .first() vì kết quả tìm kiếm sẽ trả ra nhiều nút "Xem phòng"
    await page.getByRole('button', { name: 'Xem phòng' }).first().click();
    
    // Cuộn xuống khu vực #rooms và chọn phòng đầu tiên
    await page.locator('#rooms').getByRole('button', { name: 'Đặt phòng ngay' }).first().click();
    
    // Xác nhận trên modal/popup (nếu có)
    await page.getByRole('button', { name: 'Xác nhận đặt phòng' }).click();

    // 3. ĐIỀN THÔNG TIN LIÊN HỆ
    await page.getByRole('textbox', { name: 'VD: Nguyen Van A' }).fill('Nguyen Van A');
    await page.getByRole('textbox', { name: 'VD: 0912345678' }).fill('0987654321');
    await page.getByRole('textbox', { name: 'VD: email@example.com' }).fill('abc@gmail.com');
    
    // Click nút tiếp tục để sang phần thanh toán
    await page.getByRole('button', { name: 'Thanh toán ngay' }).click();

    // 4. CHỌN PHƯƠNG THỨC THANH TOÁN (THẺ ĐÃ LƯU)
    
    // Dừng luồng 3 giây để chờ API trả về danh sách thẻ (Cách của bạn)
    await page.waitForTimeout(3000); 
    
    // "Hãy chờ đến khi nào nhìn thấy dòng chữ có số thẻ 4242 rồi mới đi tiếp"
    await page.getByText(/4242/).first().waitFor({ state: 'visible' });

    // Chọn radio button đầu tiên (lúc này chắc chắn là thẻ Stripe đã load xong)
    await page.getByRole('radio').first().check();
    
    // Bấm thanh toán lần cuối
    await page.getByRole('button', { name: 'Thanh toán ngay' }).click();

    // 5. KIỂM TRA KẾT QUẢ ĐẶT PHÒNG THÀNH CÔNG
    // Dùng regex để tránh lỗi do sai lệch chữ hoa/chữ thường hoặc dấu cách
    await expect(page.getByRole('heading', { name: /Đã hoàn tất/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Đơn đặt phòng của bạn đã được/i)).toBeVisible();
  });

});