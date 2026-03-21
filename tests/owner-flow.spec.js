import { test, expect } from '@playwright/test';

test.describe('Luồng Chủ nhà (Owner) - Thêm Khách sạn mới qua Sidebar', () => {

  test.beforeEach(async ({ page }) => {
    // Cấu hình Viewport chuẩn Desktop
    await page.setViewportSize({ width: 1280, height: 720 });

    // Chặn các request từ Stripe để log sạch và test chạy nhanh hơn
    await page.route('**/*.stripe.com/**', route => route.abort());
    await page.route('**/*.stripe.network/**', route => route.abort());

    // 1. Đăng nhập
    await page.goto('http://localhost:5173/login');
    
    // Sử dụng fill() để tự động chờ và xóa text cũ
    await page.locator('input[name="email"]').fill('owner@travelmate.vn');
    await page.locator('input[name="password"]').fill('Owner@123');
    
    // Click đăng nhập và đợi URL thay đổi (xác nhận đã login thành công)
    await page.getByRole('button', { name: /Đăng nhập/i }).click();
    
    // Đợi cho đến khi vào được trang chủ/dashboard để đảm bảo Token đã lưu vào LocalStorage
    await page.waitForURL('http://localhost:5173/', { waitUntil: 'networkidle' });
  });

  test('Hoàn thành form đa bước thêm khách sạn bằng cách điều hướng sidebar', async ({ page }) => {
    // --- ĐIỀU HƯỚNG QUA SIDEBAR ---
    // Tìm và click vào menu "Quản lý chỗ nghỉ" (Dựa trên text trong OwnerSidebar.jsx)
    await page.getByText(/Quản lý chỗ nghỉ|My Properties/i).click();
    
    // Đợi trang danh sách hiện ra và click nút "Thêm chỗ nghỉ"
    await page.getByRole('button', { name: /Thêm chỗ nghỉ|Add/i }).click();

    // Xác nhận đã ở đúng trang Add Property
    await expect(page).toHaveURL(/.*owner\/properties\/add/);

    // --- STEP 0: CHỌN LOẠI HÌNH (Step0_PropertyType.jsx) ---
    // Vì label không gắn ID, click trực tiếp vào text của loại hình
    await page.getByText(/Khách sạn|Hotel/i).first().click();
    await page.getByRole('button', { name: /Tiếp tục|Next/i }).click();

    // --- STEP 1: VỊ TRÍ (Step1_Location.jsx - Mapbox) ---
    // Tìm ô search của Mapbox qua placeholder
    const mapSearch = page.locator('input[placeholder*="Tìm kiếm"]');
    await mapSearch.fill('Đà Nẵng');
    
    // Đợi dropdown gợi ý hiện ra và chọn mục đầu tiên
    await page.locator('li').filter({ hasText: 'Đà Nẵng' }).first().click();
    
    // Điền địa chỉ chi tiết (Yup yêu cầu address)
    await page.locator('input[name="address"]').fill('123 Đường Võ Nguyên Giáp, Sơn Trà, Đà Nẵng');
    await page.getByRole('button', { name: /Tiếp tục|Next/i }).click();

    // --- STEP 2: TIỆN ÍCH (Step2_Amenities.jsx) ---
    await page.getByText(/Wifi/i).first().click();
    await page.getByText(/Hồ bơi|Pool/i).first().click();
    await page.getByRole('button', { name: /Tiếp tục|Next/i }).click();

    // --- STEP 3: HÌNH ẢNH (Step3_Images.jsx) ---
    // Yup schema bắt buộc tối thiểu 3 ảnh
    // Đảm bảo bạn đã có các file này trong thư mục tests/fixtures/
    await page.locator('input[type="file"]').setInputFiles([
      'tests/fixtures/hotel1.jpg',
      'tests/fixtures/hotel2.jpg',
      'tests/fixtures/hotel3.jpg'
    ]);
    
    // Đợi một chút để ảnh upload/preview (nếu có logic xử lý ảnh)
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: /Tiếp tục|Next/i }).click();

    // --- STEP 4: CHI TIẾT (Step4_Details.jsx) ---
    await page.locator('input[name="propertyName"]').fill('Tripify Ocean View Hotel');
    await page.locator('input[name="area"]').fill('120');
    
    // Yup yêu cầu description tối thiểu 50 ký tự
    const description = "Khách sạn tiêu chuẩn 5 sao với tầm nhìn hướng biển tuyệt đẹp, tọa lạc tại vị trí đắc địa của thành phố Đà Nẵng. Đầy đủ tiện nghi hiện đại và dịch vụ chuyên nghiệp.";
    await page.locator('textarea[name="description"]').fill(description);
    
    await page.getByRole('button', { name: /Tiếp tục|Next/i }).click();

    // --- STEP 5: CHÍNH SÁCH (Step_Policies.jsx) ---
    // Sử dụng giá trị mặc định và nhấn Next
    await page.getByRole('button', { name: /Tiếp tục|Next/i }).click();

    // --- STEP 6: XÁC NHẬN & GỬI (Step5_Review.jsx) ---
    // Bắt buộc phải đồng ý điều khoản (terms: true)
    
    await page.locator('input[name="terms"]').check();
    
    // Nhấn nút Submit (nút cuối cùng có icon Send)
    await page.getByRole('button', { name: /Xác nhận & Gửi yêu cầu|Submit/i }).click();

    // --- KIỂM TRA KẾT QUẢ (Step6_Status.jsx) ---
    // Chờ màn hình báo thành công hiện ra (Tăng timeout lên 15s vì upload ảnh tốn thời gian)
    await expect(page.getByText(/Thành công|Success/i)).toBeVisible({ timeout: 15000 });
  });
});