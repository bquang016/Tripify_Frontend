Dưới đây là bản mô tả (prompt) đã được cập nhật và tổng hợp, bao gồm dữ liệu từ cả 3 bước trong quy trình đăng ký. Bạn có thể sử dụng nó để làm việc với đội ngũ backend.

### **Chủ đề: Yêu cầu API DUY NHẤT cho Toàn bộ quy trình Đăng ký của Đối tác**

Chào đội ngũ backend,

Toàn bộ luồng đăng ký đối tác ở frontend đã được hợp nhất. Toàn bộ dữ liệu từ Bước 1, 2, và 3 sẽ được thu thập và gửi đi **một lần duy nhất** ở Bước 4 (trang Tổng quan & Xác nhận). Dưới đây là đặc tả cho API endpoint cuối cùng đó.

**1. Thông tin chung về Endpoint**

*   **Phương thức (Method):** `POST`
*   **URL:** `/api/v1/owner/onboarding/register-full`
*   **Yêu cầu xác thực:** Cần có token JWT của người dùng (vai trò OWNER) trong header `Authorization`.
*   **Content-Type:** `multipart/form-data`

**2. Cấu trúc Request Body (`FormData`)**

Dữ liệu được gửi lên dưới dạng `multipart/form-data` và bao gồm các `part` sau:

---

#### **Part 1: `data` (application/json)**

Một chuỗi JSON chứa toàn bộ dữ liệu văn bản. Backend cần parse chuỗi này.

```json
{
  // --- Dữ liệu từ Bước 1: Thông tin cá nhân ---
  "fullName": "NGUYEN VAN A",
  "phoneNumber": "0912345678",
  "identityCardNumber": "012345678912",
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "address": "Số 1, Đường ABC, Quận XYZ",
  "city": "Hà Nội",

  // --- Dữ liệu từ Bước 2: Thông tin cơ sở kinh doanh ---
  "propertyType": "VILLA",
  "propertyName": "The Anam Mũi Né",
  "description": "Một resort sang trọng...",
  "propertyAddress": "123 Nguyễn Đình Chiểu, P. Hàm Tiến, TP. Phan Thiết, Bình Thuận",
  "propertyCity": "Thành phố Phan Thiết",
  "propertyDistrict": "Thành phố Phan Thiết",
  "propertyWard": "Phường Hàm Tiến",
  "latitude": 10.9333,
  "longitude": 108.2333,
  "amenityIds": ["wifi", "pool", "restaurant"],
  "businessLicenseNumber": "123456789",

  // --- (Có điều kiện) Dữ liệu cho Villa/Homestay ---
  "price": 3500000,
  "weekendPrice": 4200000,
  "capacity": 8,
  "area": 250,
  "unitData": {
    "name": "Biệt thự hướng biển 3 phòng ngủ",
    "description": "Mô tả chi tiết về căn...",
    "amenities": { "tv": true, "wifi": true }
  },

  // --- Dữ liệu Chính sách ---
  "policies": {
    "checkInTime": "14:00",
    "checkOutTime": "12:00",
    "minimumAge": 18,
    "allowFreeCancellation": true,
    "freeCancellationDays": 3
  },

  // --- Dữ liệu từ Bước 3: Thông tin thanh toán ---
  "paymentInfo": {
    "paymentMethod": "bank",
    "bankName": "Vietcombank",
    "accountHolderName": "NGUYEN VAN A",
    "accountNumber": "0123456789"
  }
}
```

---

#### **Part 2: `avatar` (image/*)**
*   Key: `avatar`
*   Mô tả: **Một file** ảnh đại diện của người dùng (từ Bước 1).

#### **Part 3: `cccdFront` (image/*)**
*   Key: `cccdFront`
*   Mô tả: **Một file** ảnh mặt trước CCCD (từ Bước 1).

#### **Part 4: `cccdBack` (image/*)**
*   Key: `cccdBack`
*   Mô tả: **Một file** ảnh mặt sau CCCD (từ Bước 1).

#### **Part 5: `propertyImages` (image/*)**
*   Key: `propertyImages`
*   Mô tả: **Một danh sách các file** ảnh của cơ sở kinh doanh (từ Bước 2).

#### **Part 6: `businessLicenseImage` (image/*)**
*   Key: `businessLicenseImage`
*   Mô tả: **Một file** ảnh giấy phép kinh doanh (từ Bước 2).

#### **Part 7: `unitImages` (image/*) - CÓ ĐIỀU KIỆN**
*   Key: `unitImages`
*   Mô tả: **Một danh sách các file** ảnh chi tiết của căn Villa/Homestay (từ Bước 2).
*   **Điều kiện:** Chỉ tồn tại nếu `propertyType` là `VILLA` hoặc `HOMESTAY`.

---

Vui lòng xem xét và xây dựng API theo đặc tả này. Cảm ơn.
