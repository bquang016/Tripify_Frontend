import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CheckCircle2, AlertTriangle, Send, RotateCw, Loader2 } from 'lucide-react';

import { useOnboarding } from '@/context/OnboardingContext';
import OnboardingStepper from './components/OnboardingStepper';
import logo from "@/assets/logo/logo_tripify_xoafont.png";
import Button from '@/components/common/Button/Button';
import { ownerService } from '@/services/owner.service';
import Step6_Review from './OnboardingSteps/Step6_Review';

const OwnerOnboardingStep4 = () => {
    const navigate = useNavigate();
    const { formData } = useOnboarding(); 
    
    // 1. CHUYỂN TẤT CẢ HOOKS LÊN TRÊN CÙNG (Quy tắc bắt buộc của React)
    const [isLoading, setIsLoading] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // 2. THÊM HÀM XỬ LÝ CLICK STEPPER NGANG
    const handleMajorStepClick = (stepId) => {
        // Ở bước Review này không có form để lưu (không dùng getValues), 
        // nên chúng ta chỉ cần chuyển trang trực tiếp
        if (stepId === 1) navigate("/partner/onboarding/step-1");
        if (stepId === 2) navigate("/partner/onboarding/step-2");
        if (stepId === 3) navigate("/partner/onboarding/step-3");
        if (stepId === 4) navigate("/partner/onboarding/step-4");
    };
    
    // 3. EARLY RETURN ĐẶT SAU HOOKS
    // Safety check for context data
    if (!formData || !formData.temporaryToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Phiên làm việc không hợp lệ</h2>
                    <p className="text-gray-600 mb-6">Không tìm thấy mã xác thực tạm thời. Vui lòng bắt đầu lại quy trình đăng ký.</p>
                    <Button onClick={() => navigate('/partner/register')}>Bắt đầu lại</Button>
                </div>
            </div>
        );
    }

    const onFinalSubmit = async () => {
        // 1. Validation cơ bản
        if (!formData.cccdFront || !formData.cccdBack) {
            toast.error("Thiếu ảnh CCCD/CMND. Vui lòng quay lại Bước 1 để tải lên.");
            return;
        }

        if (!formData.propertyInfo?.businessLicenseImage) {
            toast.error("Thiếu ảnh Giấy phép kinh doanh. Vui lòng quay lại Bước 2 để tải lên.");
            return;
        }

        setIsLoading(true);
        setSubmissionStatus(null);
        
        try {
            const { propertyInfo, paymentInfo, temporaryToken, ...personalInfo } = formData;
            const isWholeUnit = ["VILLA", "HOMESTAY", "APARTMENT"].includes(propertyInfo.propertyType);
            
            // Tách các file ảnh ra khỏi object propertyInfo để không gửi nhầm vào JSON
            const { 
                propertyImages, 
                businessLicenseImage, 
                unitData, 
                ...restPropertyInfo 
            } = propertyInfo;
            
            // --- XỬ LÝ ĐỊA CHỈ AN TOÀN (FIX LỖI UNDEFINED) ---
            const street = personalInfo.streetAddress || "";
            const ward = personalInfo.wardName || personalInfo.ward || "";
            const district = personalInfo.districtName || personalInfo.district || "";
            const province = personalInfo.provinceName || personalInfo.city || personalInfo.province || "";

            // Tạo chuỗi địa chỉ sạch: Lọc bỏ các giá trị rỗng/undefined
            const fullAddress = [street, ward, district, province]
                .filter(part => part && part.trim() !== "") // Chỉ giữ lại phần có dữ liệu
                .join(", ");
            // --------------------------------------------------
            // Thêm hàm helper làm sạch chuỗi tiền tệ thành số nguyên
            const parseNumber = (value) => {
                if (!value) return 0;
                if (typeof value === 'number') return value;
                const cleanValue = String(value).replace(/[^0-9]/g, ''); // Xóa mọi ký tự không phải số
                return Number(cleanValue) || 0;
            };
            const unitAmenitiesObj = unitData?.amenities || {};
            const mappedUnitAmenityIds = Object.keys(unitAmenitiesObj).filter(key => unitAmenitiesObj[key] === true);

            // 2. Chuẩn bị JSON Payload (Clean Data)
            const submitPayload = {
                // --- Đưa các trường personalInfo ra ngoài root ---
                fullName: personalInfo.fullName,
                email: personalInfo.email,
                phoneNumber: personalInfo.phoneNumber,
                dateOfBirth: personalInfo.dateOfBirth,
                identityCardNumber: personalInfo.identityCardNumber,
                gender: personalInfo.gender ? personalInfo.gender.toUpperCase() : 'OTHER',
                
                // --- Mapping Address & City đã xử lý ---
                address: fullAddress, 
                city: province,       

                permanentAddress: {
                    streetAddress: street,
                    wardCode: personalInfo.wardCode || "",
                    wardName: ward,
                    districtCode: personalInfo.districtCode || "",
                    districtName: district,
                    provinceCode: personalInfo.provinceCode || "",
                    provinceName: province,
                },
                
                // Giữ nguyên các phần khác
                propertyInfo: {
                    ...restPropertyInfo,
                    // DÙNG HÀM parseNumber ĐỂ ÉP KIỂU GIÁ TRỊ TỪ STRING SANG SỐ
                    price: parseNumber(restPropertyInfo.price),
                    weekendPrice: parseNumber(restPropertyInfo.weekendPrice),
                    capacity: parseNumber(restPropertyInfo.capacity),
                    area: parseNumber(restPropertyInfo.area),
                    amenityIds: restPropertyInfo.amenityIds || [],
                    
                    ...(isWholeUnit && unitData ? {
                        unitData: {
                            name: unitData.name,
                            description: unitData.description,
                            
                            // FIX: Map object tiện nghi thành mảng
                            amenityIds: mappedUnitAmenityIds.length > 0 ? mappedUnitAmenityIds : (unitData.amenityIds || []),
                            
                            // FIX: Ép kiểu số & BỔ SUNG weekendPrice BỊ THIẾU
                            price: parseNumber(unitData.price) || parseNumber(restPropertyInfo.price),
                            weekendPrice: parseNumber(unitData.weekendPrice) || parseNumber(restPropertyInfo.weekendPrice), // Đã thêm dòng này
                            capacity: parseNumber(unitData.capacity) || parseNumber(restPropertyInfo.capacity),
                            area: parseNumber(unitData.area) || parseNumber(restPropertyInfo.area),
                        }
                    } : {})
                },
                paymentInfo: {
                    bankName: paymentInfo?.bankName,
                    accountNumber: paymentInfo?.accountNumber,
                    accountHolderName: paymentInfo?.accountHolderName,
                    paymentMethod: paymentInfo?.paymentMethod === 'bank' ? 'BANK_TRANSFER' : 'CARD'
                }
            };

            // 3. Đóng gói FormData
            const finalFormData = new FormData();
            
            // Append JSON với Content-Type application/json
            finalFormData.append("request", new Blob([JSON.stringify(submitPayload)], { type: 'application/json' }));

            // Append Single Files
            if (formData.avatar) finalFormData.append("avatar", formData.avatar);
            if (formData.cccdFront) finalFormData.append("cccdFront", formData.cccdFront);
            if (formData.cccdBack) finalFormData.append("cccdBack", formData.cccdBack);
            
            // Append Property Images (List)
            if (propertyImages && propertyImages.length > 0) {
                Array.from(propertyImages).forEach(file => {
                    if (file instanceof File) finalFormData.append("propertyImages", file);
                });
            }
            
            // Append Business License (Single)
            if (businessLicenseImage) {
                const file = businessLicenseImage instanceof FileList ? businessLicenseImage[0] : businessLicenseImage;
                if (file instanceof File) finalFormData.append("businessLicenseImage", file);
            }
            
            // Append Unit Images (List - Optional)
            if (isWholeUnit && unitData?.images && unitData.images.length > 0) {
                Array.from(unitData.images).forEach(file => {
                     if (file instanceof File) finalFormData.append("unitImages", file);
                });
            }

            console.log("Submitting payload:", submitPayload); // Debug

            // 4. Gọi Service
            await ownerService.submitRegistration(finalFormData, temporaryToken);
            
            toast.success('Đơn đăng ký của bạn đã được gửi thành công!');
            setSubmissionStatus('success');
            
        } catch (error) {
            console.error("Submission Error:", error);
            const message = error.response?.data?.message || 'Gửi đơn thất bại. Vui lòng kiểm tra lại thông tin.';
            toast.error(message);
            setSubmissionStatus('error');
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderSubmissionState = () => {
        if (isLoading) return <div className="text-center p-12"><Loader2 className="w-12 h-12 text-[rgb(40,169,224)] animate-spin mx-auto mb-4" /><p className="text-slate-500 font-medium">Đang gửi hồ sơ đăng ký...</p></div>;
        if (submissionStatus === 'success') return (
            <div className="text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-xl">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Đăng ký hoàn tất!</h2>
                <p className="mt-3 text-slate-500 max-w-md mx-auto">Chúng tôi đã tiếp nhận hồ sơ của bạn. Tripify sẽ xem xét và phản hồi qua email trong vòng 24-48 giờ làm việc.</p>
                <div className="mt-8">
                     <Button onClick={() => navigate('/')}>Về trang chủ</Button>
                </div>
            </div>
        );
        if (submissionStatus === 'error') return (
            <div className="text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-xl">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Gửi đơn thất bại</h2>
                <p className="mt-3 text-slate-500 mb-6">{errorMessage}</p>
                <Button onClick={onFinalSubmit} leftIcon={<RotateCw size={18} />}>Thử lại ngay</Button>
            </div>
        );
        return null;
    }

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] font-sans pb-20">
            {/* --- HEADER MỚI (CHỈ CHỨA LOGO VÀ ACTION) --- */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={logo} alt="Tripify" className="h-8 sm:h-9 w-auto" />
                <div className="h-5 sm:h-6 w-px bg-slate-300 mx-1 sm:mx-2"></div>
                <span className="font-bold text-slate-700 tracking-tight text-sm sm:text-base">Đăng ký Đối tác</span>
            </div>
            
            {/* Nút Hỗ trợ UX: Lưu tiến độ */}
            <button 
                type="button"
                onClick={() => {
                  /* Gọi hàm lưu tiến độ API nếu có, sau đó redirect */
                  navigate('/partner'); 
                }}
                className="text-sm font-semibold text-slate-500 hover:text-[#28A9E0] transition-colors flex items-center gap-2"
            >
                <span className="hidden sm:inline">Lưu & Thoát</span>
                <span className="sm:hidden">Thoát</span>
            </button>
        </div>
      </header>

      {/* --- SECTION STEPPER (TÁCH BIỆT KHỎI HEADER ĐỂ UI THOÁNG HƠN) --- */}
      <div className="w-full bg-white border-b border-slate-100 pt-6 pb-12 sm:pt-8 sm:pb-14">
        <OnboardingStepper currentStep={4} onStepClick={handleMajorStepClick} />
      </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Tổng quan hồ sơ đăng ký</h1>
                    <p className="text-slate-500 mt-2 text-lg">Vui lòng kiểm tra kỹ các thông tin dưới đây trước khi gửi cho chúng tôi.</p>
                </div>
                
                {submissionStatus || isLoading ? renderSubmissionState() : (
                    <div className="space-y-8">
                        <Step6_Review data={formData} />
                        
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                             <div className="p-2 bg-white rounded-full text-blue-500 shadow-sm">
                                <Send size={20} />
                             </div>
                             <div>
                                <p className="text-sm text-slate-700 font-medium">Bằng việc nhấn "Xác nhận & Gửi đơn", bạn cam kết các thông tin cung cấp là hoàn toàn sự thật và đồng ý với các chính sách vận hành của Tripify.</p>
                             </div>
                        </div>

                        <div className="flex justify-between items-center pt-6">
                             <Button variant="ghost" onClick={() => navigate('/partner/onboarding/step-3')}>
                                Quay lại
                             </Button>
                             <Button size="lg" onClick={onFinalSubmit} leftIcon={<Send size={18} />}>
                                Xác nhận & Gửi đơn
                             </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default OwnerOnboardingStep4;