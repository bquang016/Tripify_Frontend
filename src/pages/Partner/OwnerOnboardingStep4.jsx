import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CheckCircle2, AlertTriangle, Send, RotateCw, Loader2 } from 'lucide-react';

import { useOnboarding } from '@/context/OnboardingContext';
import OnboardingStepper from './components/OnboardingStepper';
import logo from "../../assets/logo/logo_travelmate_xoafont.png";
import Button from '@/components/common/Button/Button';
import propertyService from '@/services/property.service';
import Step6_Review from './OnboardingSteps/Step6_Review';

const OwnerOnboardingStep4 = () => {
    const navigate = useNavigate();
    const onboarding = useOnboarding(); 
    
    // Safety check
    if (!onboarding) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Phiên làm việc hết hạn</h2>
                    <p className="text-gray-600 mb-6">Vui lòng bắt đầu lại quy trình đăng ký để đảm bảo dữ liệu chính xác.</p>
                    <Button onClick={() => navigate('/partner/onboarding/step-1')}>Bắt đầu lại</Button>
                </div>
            </div>
        );
    }

    const { formData } = onboarding;

    const [isLoading, setIsLoading] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const onFinalSubmit = async () => {
        // --- 1. Validation thủ công trước khi submit ---
        // Lý do: Nếu người dùng refresh trang ở Step 4, Context bị reset về null/initial. 
        // Dù giao diện có thể hiển thị data cũ (nếu cache), nhưng File Object trong JS Memory sẽ mất.
        // Bắt buộc kiểm tra kỹ để tránh gửi request thiếu file lên server (gây lỗi 500).
        
        if (!formData.cccdFront || !formData.cccdBack) {
            toast.error("Thiếu ảnh CCCD/CMND. Vui lòng tải lại.");
            navigate('/partner/onboarding/step-1');
            return;
        }

        if (!formData.propertyInfo?.businessLicenseImage) {
            toast.error("Thiếu ảnh Giấy phép kinh doanh. Vui lòng tải lại.");
            navigate('/partner/onboarding/step-2'); // Quay về step 2, đoạn upload GPKD
            return;
        }

        setIsLoading(true);
        setSubmissionStatus(null);
        
        try {
            const { propertyInfo, paymentInfo } = formData;
            const isWholeUnit = ["VILLA", "HOMESTAY"].includes(propertyInfo.propertyType);
            
            // 2. Chuẩn bị dữ liệu JSON (data part)
            // Tách các trường file ra khỏi object JSON để tránh gửi thừa
            const { propertyImages, businessLicenseImage, unitData, ...restPropertyInfo } = propertyInfo;
            
            const submitPayload = {
                // Thông tin cá nhân (Step 1)
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                identityCardNumber: formData.identityCardNumber,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address,
                city: formData.city,
                
                // Thông tin cơ sở kinh doanh (Step 2)
                propertyInfo: {
                    ...restPropertyInfo,
                    // Nếu là nguyên căn, đẩy các thông tin giá/diện tích lên root propertyInfo
                    ...(isWholeUnit && unitData ? {
                        price: unitData.price,
                        weekendPrice: unitData.weekendPrice,
                        capacity: unitData.capacity,
                        area: unitData.area,
                        unitData: {
                            name: unitData.name,
                            description: unitData.description,
                            amenities: unitData.amenities
                        }
                    } : {})
                },
                
                // Thông tin thanh toán (Step 3)
                paymentInfo: paymentInfo
            };

            // 3. Tạo FormData
            const finalFormData = new FormData();
            
            // Thêm phần data JSON (Spring Boot yêu cầu part 'data' là application/json)
            finalFormData.append("data", new Blob([JSON.stringify(submitPayload)], { type: 'application/json' }));

            // 4. Thêm các file ảnh (Parts)
            // Step 1 files
            if (formData.avatar) finalFormData.append("avatar", formData.avatar);
            finalFormData.append("cccdFront", formData.cccdFront);
            finalFormData.append("cccdBack", formData.cccdBack);
            
            // Step 2 files
            if (propertyImages && propertyImages.length > 0) {
                Array.from(propertyImages).forEach(file => finalFormData.append("propertyImages", file));
            }
            
            if (businessLicenseImage) {
                const file = businessLicenseImage instanceof FileList ? businessLicenseImage[0] : businessLicenseImage;
                finalFormData.append("businessLicenseImage", file);
            }
            
            if (isWholeUnit && unitData?.images && unitData.images.length > 0) {
                Array.from(unitData.images).forEach(file => finalFormData.append("unitImages", file));
            }

            // Gọi API
            await propertyService.registerFullOnboarding(finalFormData);
            
            toast.success('Đơn đăng ký của bạn đã được gửi thành công!');
            setSubmissionStatus('success');
            
        } catch (error) {
            console.error("Submission Error:", error);
            const message = error.response?.data?.message || error.message || 'Gửi đơn thất bại. Vui lòng thử lại.';
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
                <p className="mt-3 text-slate-500 max-w-md mx-auto">Chúng tôi đã tiếp nhận hồ sơ của bạn. TravelMate sẽ xem xét và phản hồi qua email trong vòng 24-48 giờ làm việc.</p>
                <div className="mt-8 flex justify-center gap-4">
                     <Button variant="outline" onClick={() => navigate('/partner/dashboard')}>Về trang chủ</Button>
                     <Button onClick={() => navigate('/owner/properties')}>Quản lý chỗ nghỉ</Button>
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
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Tripify" className="h-9 w-auto" />
                        <div className="h-6 w-px bg-slate-300 mx-1"></div>
                        <span className="font-bold text-slate-700 tracking-tight">Xác nhận</span>
                    </div>
                    <div className="hidden md:block w-[500px]">
                        <OnboardingStepper currentStep={4} />
                    </div>
                     <Button variant="ghost" onClick={() => navigate('/partner/dashboard')}>Thoát</Button>
                </div>
            </header>

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
