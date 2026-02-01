// src/data/helpData.js
import { BookOpen, CreditCard, User, ShieldCheck, Home } from 'lucide-react';

// 1. Danh sách Category
export const categories = [
    {
        id: 'booking',
        name: 'Đặt phòng',
        icon: BookOpen,
        desc: 'Hướng dẫn đặt phòng, hủy phòng & thay đổi lịch trình'
    },
    {
        id: 'payment',
        name: 'Thanh toán',
        icon: CreditCard,
        desc: 'Phương thức thanh toán, hoàn tiền & xuất hóa đơn'
    },
    {
        id: 'account',
        name: 'Tài khoản',
        icon: User,
        desc: 'Quản lý hồ sơ, bảo mật & khôi phục mật khẩu'
    },
    {
        id: 'partner',
        name: 'Đối tác (Chủ nhà)',
        icon: Home,
        desc: 'Đăng ký cho thuê, quản lý chỗ nghỉ & doanh thu'
    },
];

// 2. Danh sách câu hỏi chi tiết
export const faqs = [
    // --- BOOKING (ĐẶT PHÒNG) ---
    {
        id: 1,
        category: 'booking',
        question: 'Làm thế nào để tôi biết đặt phòng của mình đã thành công?',
        answer: 'Sau khi hoàn tất thanh toán, bạn sẽ nhận được một email xác nhận từ hệ thống gửi đến địa chỉ email đã đăng ký. Đồng thời, trạng thái đơn đặt phòng trong mục "Đặt chỗ của tôi" sẽ chuyển sang "Đã xác nhận". Nếu không nhận được email sau 15 phút, vui lòng kiểm tra hộp thư Spam hoặc liên hệ bộ phận hỗ trợ.'
    },
    {
        id: 2,
        category: 'booking',
        question: 'Chính sách hủy phòng và hoàn tiền được tính như thế nào?',
        answer: 'Chính sách hủy phòng phụ thuộc vào quy định riêng của từng khách sạn/chủ nhà. Thông thường sẽ có các mức: \n- Miễn phí hủy trước 24h/48h.\n- Hủy mất phí (50% hoặc 100% giá trị đêm đầu).\nBạn có thể xem chi tiết chính sách này tại trang chi tiết phòng trước khi đặt hoặc trong email xác nhận đặt phòng.'
    },
    {
        id: 3,
        category: 'booking',
        question: 'Tôi có thể thay đổi ngày nhận/trả phòng sau khi đã đặt không?',
        answer: 'Việc thay đổi ngày phụ thuộc vào tình trạng phòng trống của khách sạn. Bạn vui lòng vào mục "Đặt chỗ của tôi", chọn đơn hàng và nhấn "Gửi yêu cầu thay đổi". Chủ nhà sẽ xem xét và phản hồi. Lưu ý: Giá phòng có thể thay đổi tùy theo thời điểm mới.'
    },
    {
        id: 4,
        category: 'booking',
        question: 'Giờ nhận phòng (Check-in) và trả phòng (Check-out) là mấy giờ?',
        answer: 'Thông thường, giờ nhận phòng là 14:00 và trả phòng là 12:00 trưa hôm sau. Tuy nhiên, một số nơi có thể hỗ trợ nhận phòng sớm hoặc trả phòng muộn (có thể tính phí). Bạn nên nhắn tin trực tiếp cho chủ nhà qua tính năng Chat để thỏa thuận trước.'
    },

    // --- PAYMENT (THANH TOÁN) ---
    {
        id: 5,
        category: 'payment',
        question: 'Hệ thống hỗ trợ những phương thức thanh toán nào?',
        answer: 'Chúng tôi hỗ trợ đa dạng các phương thức thanh toán an toàn bao gồm:\n- Thẻ tín dụng/ghi nợ quốc tế (Visa, Mastercard, JCB).\n- Ví điện tử (VNPay, MoMo).\n- Chuyển khoản ngân hàng (QR Code).\n- Thanh toán khi nhận phòng (chỉ áp dụng với một số khách sạn cho phép).'
    },
    {
        id: 6,
        category: 'payment',
        question: 'Bao lâu thì tôi nhận được tiền hoàn sau khi hủy phòng?',
        answer: 'Sau khi yêu cầu hủy phòng được chấp nhận, hệ thống sẽ tiến hành hoàn tiền ngay lập tức. Tuy nhiên, thời gian tiền về tài khoản phụ thuộc vào ngân hàng của bạn:\n- Ví điện tử: 24h - 48h làm việc.\n- Thẻ quốc tế/Ngân hàng: 5 - 10 ngày làm việc (không tính T7, CN).'
    },
    {
        id: 7,
        category: 'payment',
        question: 'Tại sao thẻ của tôi bị từ chối khi thanh toán?',
        answer: 'Một số lý do phổ biến:\n1. Số dư không đủ.\n2. Thẻ chưa kích hoạt thanh toán online.\n3. Nhập sai thông tin thẻ (CVV, ngày hết hạn).\n4. Hệ thống ngân hàng đang bảo trì.\nVui lòng kiểm tra lại hoặc thử phương thức thanh toán khác.'
    },

    // --- ACCOUNT (TÀI KHOẢN) ---
    {
        id: 8,
        category: 'account',
        question: 'Làm thế nào để lấy lại mật khẩu nếu tôi bị quên?',
        answer: 'Tại màn hình Đăng nhập, bạn hãy nhấn vào liên kết "Quên mật khẩu". Nhập email đã đăng ký, hệ thống sẽ gửi một đường dẫn để bạn thiết lập lại mật khẩu mới. Đường dẫn này chỉ có hiệu lực trong vòng 15 phút để đảm bảo bảo mật.'
    },
    {
        id: 9,
        category: 'account',
        question: 'Tôi có thể thay đổi thông tin cá nhân (Email, SĐT) không?',
        answer: 'Bạn có thể thay đổi Số điện thoại, Họ tên, Ảnh đại diện trong mục "Hồ sơ cá nhân". Tuy nhiên, Email đăng nhập thường không thể thay đổi để đảm bảo tính xác thực của tài khoản. Nếu bắt buộc phải đổi email, vui lòng liên hệ Admin.'
    },
    {
        id: 10,
        category: 'account',
        question: 'Làm sao để xóa tài khoản vĩnh viễn?',
        answer: 'Việc xóa tài khoản sẽ làm mất toàn bộ lịch sử đặt phòng và điểm thưởng tích lũy. Nếu bạn chắc chắn, hãy gửi yêu cầu xóa tài khoản tại mục "Cài đặt" -> "Bảo mật". Yêu cầu sẽ được xử lý trong vòng 7 ngày.'
    },

    // --- PARTNER (ĐỐI TÁC - CHỦ NHÀ) ---
    {
        id: 11,
        category: 'partner',
        question: 'Làm thế nào để đăng ký làm đối tác cho thuê phòng?',
        answer: 'Bạn hãy truy cập vào trang "Kênh người bán" (hoặc "Trở thành chủ nhà"), điền thông tin về chỗ nghỉ, tải lên hình ảnh và giấy tờ kinh doanh. Đội ngũ Admin sẽ duyệt hồ sơ của bạn trong vòng 24-48h.'
    },
    {
        id: 12,
        category: 'partner',
        question: 'Phí hoa hồng tôi phải trả cho hệ thống là bao nhiêu?',
        answer: 'Chúng tôi thu mức phí hoa hồng tiêu chuẩn là 15% trên mỗi lượt đặt phòng thành công. Phí này bao gồm chi phí vận hành hệ thống, marketing và phí cổng thanh toán. Không có phí duy trì hàng tháng.'
    },
    {
        id: 13,
        category: 'partner',
        question: 'Tôi có thể tự quản lý giá phòng và lịch trống không?',
        answer: 'Hoàn toàn được. Sau khi trở thành đối tác, bạn sẽ được cung cấp trang "Dashboard quản lý". Tại đây, bạn có toàn quyền: Đóng/mở phòng, cập nhật giá theo ngày/tuần, và thiết lập các chương trình khuyến mãi riêng.'
    },
];