import React from 'react';
import { Check, Lock } from 'lucide-react';
import { useOnboarding } from "@/context/OnboardingContext";

const OnboardingStepper = ({ currentStep, onStepClick }) => {
  const { formData } = useOnboarding(); 

  const steps = [
    { id: 1, name: 'Xác minh danh tính' },
    { id: 2, name: 'Thông tin doanh nghiệp' },
    { id: 3, name: 'Thông tin thanh toán' },
    { id: 4, name: 'Hoàn tất' }
  ];

  // Logic kiểm tra ĐÃ HOÀN THIỆN toàn bộ trường bắt buộc của từng step
  const checkStep1Complete = () => {
    if (!formData) return false;
    return !!(
      formData.fullName && 
      formData.phoneNumber && 
      formData.identityCardNumber && 
      formData.dateOfBirth && 
      formData.streetAddress && 
      formData.cccdFront && 
      formData.cccdBack
    );
  };

  const checkStep2Complete = () => {
      // Nếu bước 1 chưa xong, chắc chắn bước 2 chưa xong
      if (!checkStep1Complete() || !formData?.propertyInfo) return false;
      
      const p = formData.propertyInfo;

      // 1. Kiểm tra các thông tin bắt buộc chung của Step 2
      const isBasicInfoComplete = !!(
        p.propertyType &&                     // Step 0: Loại hình
        p.propertyName && p.description &&    // Step 1: Thông tin chung
        p.provinceCode && p.propertyAddress && // Step 2: Vị trí
        p.propertyImages?.length >= 3 &&      // Step 3: Hình ảnh (tối thiểu 3)
        p.amenityIds?.length >= 3 &&          // Step 4: Tiện ích (tối thiểu 3)
        p.businessLicenseNumber &&            // Step 5: Giấy phép KD
        p.policies?.checkInTime && p.policies?.checkOutTime // Step 6: Chính sách
      );

      // 2. Kiểm tra thêm nếu là loại hình Nguyên căn (VILLA, HOMESTAY)
      const isWholeUnit = ["VILLA", "HOMESTAY"].includes(p.propertyType);
      if (isWholeUnit) {
        // Phải điền xong Step 7 (Thiết lập căn)
        return isBasicInfoComplete && !!(
          p.unitData?.name && 
          p.unitData?.price && 
          p.unitData?.images?.length >= 3
        );
      }

      // Nếu là Khách sạn/Resort thông thường thì chỉ cần pass thông tin cơ bản
      return isBasicInfoComplete;
    };

  const checkStep3Complete = () => {
    if (!checkStep2Complete() || !formData?.paymentInfo) return false;
    return !!(
      formData.paymentInfo.bankName && 
      formData.paymentInfo.accountNumber
    );
  };

  // Xác định bước cao nhất được phép truy cập
  let highestUnlockedStep = 1;
  if (checkStep1Complete()) highestUnlockedStep = 2;
  if (checkStep2Complete()) highestUnlockedStep = 3;
  if (checkStep3Complete()) highestUnlockedStep = 4;

  // Luôn đảm bảo currentStep được active (phòng trường hợp refresh trang)
  highestUnlockedStep = Math.max(highestUnlockedStep, currentStep);

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="flex items-center justify-between w-full relative">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep && step.id <= highestUnlockedStep;
          const isCurrent = step.id === currentStep;
          const isLocked = step.id > highestUnlockedStep;
          const isClickable = onStepClick && !isLocked;

          return (
            <React.Fragment key={step.id}>
              {/* Vòng tròn Bước (Node) */}
              <div 
                className={`relative flex flex-col items-center group z-10 ${
                  isLocked ? 'cursor-not-allowed opacity-60' : isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => isClickable && onStepClick(step.id)}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 border-[3px]
                    ${isCompleted 
                      ? 'bg-[#28A9E0] border-[#28A9E0] text-white shadow-md shadow-blue-200 group-hover:bg-[#2090C0]' 
                      : isCurrent 
                        ? 'bg-white border-[#28A9E0] text-[#28A9E0] shadow-lg shadow-blue-100 scale-110 ring-4 ring-[#28A9E0]/15' 
                        : isLocked
                          ? 'bg-slate-100 border-slate-200 text-slate-400'
                          : 'bg-white border-blue-200 text-blue-400 group-hover:border-[#28A9E0] group-hover:text-[#28A9E0] shadow-sm'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check size={20} strokeWidth={3} />
                  ) : isLocked ? (
                    <Lock size={16} strokeWidth={2.5} />
                  ) : (
                    step.id
                  )}
                </div>
                
                {/* Tên bước */}
                <div className="absolute top-14 sm:top-16 mt-1 flex flex-col items-center w-28 sm:w-36">
                  <span 
                    className={`text-[11px] sm:text-[13px] font-bold text-center transition-colors duration-300 leading-tight
                      ${isCurrent ? 'text-[#28A9E0]' : isCompleted ? 'text-slate-700' : 'text-slate-400'}
                    `}
                  >
                    {step.name}
                  </span>
                </div>
              </div>

              {/* Đường nối ngang (Connector) */}
              {index < steps.length - 1 && (
                <div className="flex-auto mx-2 sm:mx-4 mb-[2.5rem] sm:mb-[3rem] relative">
                  <div className="absolute w-full border-t-[3px] border-slate-200 top-1/2 -translate-y-1/2 rounded-full"></div>
                  <div 
                    className={`absolute border-t-[3px] border-[#28A9E0] top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out rounded-full`}
                    style={{ 
                        width: highestUnlockedStep > step.id || isCompleted ? '100%' : '0%',
                    }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingStepper;