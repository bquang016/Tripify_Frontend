import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import './BookingForm.css';
import { Contact, Users, CheckSquare, FileText, Ban } from 'lucide-react';

// Component nhập số điện thoại (Nội bộ)
const PhoneInput = ({ value, onChange }) => (
    <div className="phone-input-wrapper">
        <select className="country-code" defaultValue="+84">
            <option value="+84">🇻🇳 +84</option>
            <option value="+1">🇺🇸 +1</option>
        </select>
        <input
            type="tel"
            className="form-input"
            placeholder=""
            value={value}
            onChange={onChange}
            name="phone"
            required
        />
    </div>
);

const BookingForm = ({ onChange, initialData, initialContact }) => {
    const { user } = useAuth();

    // State Contact
    const [contact, setContact] = useState(initialData?.contact || initialContact || {
        fullName: '',
        phone: '',
        email: '',
    });

    const [errors, setErrors] = useState({
        fullName: '',
        phone: '',
        email: '',
    });

    // State GuestName
    const [guestName, setGuestName] = useState(initialData?.guestName || '');

    // Checkbox "Đặt cho mình"
    const [isBookingForSelf, setIsBookingForSelf] = useState(() => {
        if (initialData?.contact?.fullName && initialData?.guestName) {
            return initialData.contact.fullName === initialData.guestName;
        }
        return false;
    });

    // State SpecialRequests
    const [specialRequests, setSpecialRequests] = useState(initialData?.specialRequests || {
        nonSmoking: false,
        connectingRoom: false,
        highFloor: false,
    });

    // Cập nhật dữ liệu lên cha mỗi khi form thay đổi
    useEffect(() => {
        if (onChange) {
            onChange({
                contact,
                guestName,
                specialRequests,
            });
        }
    }, [contact, guestName, specialRequests, onChange]);

    // Auto-fill tên khách khi chọn "Đặt cho mình"
    useEffect(() => {
        if (isBookingForSelf) {
            setGuestName(contact.fullName);
        }
    }, [isBookingForSelf, contact.fullName]);

    // --- VALIDATION ---
    const validateFullName = (name) => {
        if (!name.trim()) return "Họ tên không được để trống.";
        const regex = /^[A-Za-zÀ-ỹ\s]+$/;
        if (!regex.test(name)) return "Họ tên chỉ được chứa chữ cái và khoảng trắng.";
        return '';
    };

    const validatePhone = (phone) => {
        const regex = /^0[0-9]{9}$/;
        if (!regex.test(phone)) return "Số điện thoại phải đúng 10 số và bắt đầu bằng 0.";
        return '';
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Email không hợp lệ.";
        return '';
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContact({ ...contact, [name]: value });

        if (name === 'fullName') setErrors({ ...errors, fullName: validateFullName(value) });
        if (name === 'phone') setErrors({ ...errors, phone: validatePhone(value) });
        if (name === 'email') setErrors({ ...errors, email: validateEmail(value) });
    };

    const handleRequestChange = (e) => {
        setSpecialRequests({
            ...specialRequests,
            [e.target.name]: e.target.checked,
        });
    };

    return (
        <div className="booking-form-container">
            {/* PHẦN 1: LIÊN HỆ */}
            <div className="form-section">
                <div className="form-header">
                    <Contact size={20} className="form-header-icon" />
                    <h2>Liên hệ đặt chỗ</h2>
                </div>
                <p className="form-description">Thêm liên hệ để nhận xác nhận đặt chỗ.</p>

                <div className="form-group">
                    <label htmlFor="fullName">Họ và Tên <span>*</span></label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="form-input"
                        value={contact.fullName}
                        onChange={handleContactChange}
                        required
                    />
                    {errors.fullName && <small style={{ color: "red" }}>{errors.fullName}</small>}
                    <small>Như trên CMND/Hộ chiếu (không dấu)</small>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="phone">Số điện thoại <span>*</span></label>
                        <PhoneInput
                            value={contact.phone}
                            onChange={handleContactChange}
                        />
                        {errors.phone && <small style={{ color: "red" }}>{errors.phone}</small>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email <span>*</span></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            value={contact.email}
                            onChange={handleContactChange}
                            required
                        />
                        {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
                    </div>
                </div>

                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="forSelf"
                        checked={isBookingForSelf}
                        onChange={(e) => setIsBookingForSelf(e.target.checked)}
                    />
                    <label htmlFor="forSelf">Tôi đặt cho chính mình</label>
                </div>
            </div>

            {/* PHẦN 2: KHÁCH HÀNG */}
            <div className="form-section">
                <div className="form-header">
                    <Users size={20} className="form-header-icon" />
                    <h2>Thông tin khách hàng</h2>
                </div>

                <div className="form-group">
                    <label htmlFor="guestName">Họ và Tên <span>*</span></label>
                    <input
                        type="text"
                        id="guestName"
                        name="guestName"
                        className="form-input"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        readOnly={isBookingForSelf}
                        required
                    />
                </div>
            </div>

            {/* PHẦN 3: YÊU CẦU ĐẶC BIỆT */}
            <div className="form-section">
                <div className="form-header">
                    <CheckSquare size={20} className="form-header-icon" />
                    <h2>Yêu cầu đặc biệt</h2>
                </div>
                <div className="special-requests-grid">
                    <div className="checkbox-group-vertical">
                        <input type="checkbox" id="nonSmoking" name="nonSmoking" checked={specialRequests.nonSmoking} onChange={handleRequestChange} />
                        <label htmlFor="nonSmoking">Phòng không hút thuốc</label>
                    </div>
                    <div className="checkbox-group-vertical">
                        <input type="checkbox" id="connectingRoom" name="connectingRoom" checked={specialRequests.connectingRoom} onChange={handleRequestChange} />
                        <label htmlFor="connectingRoom">Phòng liên thông</label>
                    </div>
                    <div className="checkbox-group-vertical">
                        <input type="checkbox" id="highFloor" name="highFloor" checked={specialRequests.highFloor} onChange={handleRequestChange} />
                        <label htmlFor="highFloor">Tầng lầu</label>
                    </div>
                </div>
            </div>

            {/* PHẦN 4: CHÍNH SÁCH */}
            <div className="form-section">
                <div className="form-header">
                    <FileText size={20} className="form-header-icon" />
                    <h2>Chính sách Chỗ ở</h2>
                </div>
                <div className="policy-item">
                    <Ban size={18} className="policy-icon no-smoking" />
                    <div className="policy-content">
                        <strong>Hút Thuốc</strong>
                        <p>Cơ sở lưu trú cấm hút thuốc.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;