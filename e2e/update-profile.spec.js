import { test, expect } from '@playwright/test';

test.describe('Luồng Cập nhật thông tin cá nhân', () => {

  // Chạy trước mỗi test: Đăng nhập và vào trang Hồ sơ
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Đăng nhập (Đã dọn sạch các thao tác gõ nhầm/thừa)
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.locator('input[name="email"]').fill('customer@travelmate.vn');
    await page.locator('input[name="password"]').fill('Customer@123');
    await page.getByRole('button', { name: 'Đăng nhập ngay' }).click();
    
    // Điều hướng vào Hồ sơ cá nhân
    await page.getByRole('button', { name: 'C FullName' }).click();
    await page.getByRole('link', { name: 'Hồ sơ cá nhân' }).click();
  });

  test('TC1: Cập nhật thông tin thành công', async ({ page }) => {
    // 1. ĐIỀN THÔNG TIN (Dùng .fill để dán text nhanh thay vì gõ từng chữ)
    await page.getByRole('textbox', { name: 'Số điện thoại *' }).fill('0987654321');
    
    // 1. Mở lịch (Đã sửa ở bước trước)
    await page.locator('div').filter({ hasText: 'Ngày sinh' }).getByRole('button').first().click();
    
    // 2. CHỌN NĂM: Tìm thẻ select chứa lựa chọn 1978 thay vì dùng .nth(1)
    const yearSelect = page.locator('select').filter({ hasText: '1978' });
    await yearSelect.selectOption('1978');
    
    // (Tuỳ chọn: Nếu UI của bạn có cả chọn Tháng bằng select, bạn cũng áp dụng cách tương tự)
    // const monthSelect = page.locator('select').filter({ hasText: 'Tháng 6' });
    // await monthSelect.selectOption('Tháng 6');
    
    // 3. CHỌN NGÀY
    await page.getByRole('button', { name: '16', exact: true }).click();
    
    // Chọn Giới tính (Custom Select/Dropdown)
    await page.getByRole('button', { name: 'Chọn giới tính...' }).click();
    await page.getByRole('option', { name: 'Nam' }).click();
    
    // Điền Địa chỉ
    await page.getByRole('textbox', { name: 'Thành phố / Tỉnh' }).fill('Hà Nội');
    await page.getByRole('textbox', { name: 'Quốc gia' }).fill('Việt Nam');
    await page.getByRole('textbox', { name: 'Địa chỉ chi tiết' }).fill('Số 123');

    // 2. LẮNG NGHE API UPDATE VÀ BẤM LƯU
    // Vì UI không có Toast, ta sẽ chực chờ API update trả về kết quả
    // Lưu ý: Đổi chữ '/profile' bên dưới thành đúng endpoint của bạn (VD: '/api/v1/users/update', '/customers/profile',...)
    const responsePromise = page.waitForResponse(response => 
      // Bắt request nào có chứa '/profile' và phương thức là PUT, POST hoặc PATCH
      response.url().includes('/profile') && 
      ['PUT', 'POST', 'PATCH'].includes(response.request().method())
    );

    // Bấm nút Lưu
    await page.getByRole('button', { name: 'Lưu thông tin' }).click();

    // 3. XÁC NHẬN KẾT QUẢ (ASSERTIONS)
    
    // Chờ API hoàn tất và kiểm tra status code có phải 200 (Thành công) không
    const response = await responsePromise;
    expect(response.status()).toBe(200);

    // Kiểm tra phụ trên UI: Đảm bảo không có dòng chữ báo "Lỗi" nào hiện ra
    await expect(page.getByText(/Lỗi/i)).toBeHidden();
    
    // Kiểm tra xem dữ liệu vừa nhập có được giữ nguyên trên form không
    await expect(page.getByRole('textbox', { name: 'Thành phố / Tỉnh' })).toHaveValue('Hà Nội');
  });

});