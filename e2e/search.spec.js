import { test, expect } from '@playwright/test';

test.describe('Luồng Tìm Kiếm Chỗ Nghỉ Tripify', () => {

  // Chạy trước mỗi test: Mở trang chủ
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  test('TC1: Tìm kiếm thành công địa điểm có khách sạn (Hà Nội)', async ({ page }) => {
    // Nhập từ khóa tìm kiếm (đã dọn dẹp các thao tác gõ phím thừa)
    await page.getByRole('textbox', { name: 'Bạn muốn đi đâu?' }).fill('Hà Nội');
    
    // Bấm nút tìm kiếm
    await page.getByRole('button', { name: 'Tìm kiếm' }).click();

    // SỬ DỤNG REGEX ĐỂ BẮT SỐ ĐỘNG:
    // /Tìm thấy \d+ chỗ nghỉ/i 
    // \d+ nghĩa là 1 hoặc nhiều con số (VD: 1, 10, 99)
    // chữ 'i' ở cuối nghĩa là không phân biệt hoa thường
    const resultHeading = page.getByRole('heading', { name: /Tìm thấy \d+ chỗ nghỉ/i });
    
    // Nếu trong UI của bạn dòng chữ đó không phải là thẻ Heading (h1, h2...), 
    // thì bạn dùng dòng code dưới đây thay thế:
    // const resultText = page.getByText(/Tìm thấy \d+ chỗ nghỉ/i);

    // Xác nhận kết quả hiển thị trên màn hình
    await expect(resultHeading).toBeVisible();
  });

  test('TC2: Tìm kiếm thất bại khi nhập địa điểm không tồn tại', async ({ page }) => {
    // Nhập một địa điểm không có trong database
    await page.getByRole('textbox', { name: 'Bạn muốn đi đâu?' }).fill('Sao Hỏa');
    
    await page.getByRole('button', { name: 'Tìm kiếm' }).click();

    // Xác nhận kết quả trả về 0 chỗ nghỉ hoặc hiện thông báo lỗi
    // Bạn cần điều chỉnh text bên dưới cho đúng với giao diện thực tế của Tripify nhé
    const noResultText = page.getByText(/Tìm thấy 0 chỗ nghỉ/i);
    // Hoặc nếu UI hiện dòng chữ khác:
    // const noResultText = page.getByText('Không tìm thấy chỗ nghỉ nào phù hợp');

    await expect(noResultText).toBeVisible();
  });

});