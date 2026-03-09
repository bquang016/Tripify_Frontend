import React from 'react';
import { Check, User, Building2, CreditCard, FileCheck, Lock, ChevronRight } from 'lucide-react';
import { useOnboarding } from "@/context/OnboardingContext";

const OnboardingStepper = ({ currentStep, onStepClick }) => {
  const { formData } = useOnboarding(); 

  const steps = [
    { id: 1, name: 'Danh tính', icon: User },
    { id: 2, name: 'Chỗ nghỉ', icon: Building2 },
    { id: 3, name: 'Thanh toán', icon: CreditCard },
    { id: 4, name: 'Xác nhận', icon: FileCheck }
  ];

  // Logic nghiêm ngặt: Chỉ mở khóa bước tiếp theo nếu bước trước ĐÃ HOÀN THÀNH ĐẦY ĐỦ
  const getCompletedStep = () => {
    if (!formData) return 0;
    
    // Step 1: Xác minh danh tính - cần đủ các trường bắt buộc
    const step1Complete = Boolean(
      formData.fullName &&
      formData.phoneNumber &&
      formData.identityCardNumber &&
      formData.dateOfBirth &&
      formData.gender &&
      formData.cccdFront &&
      formData.cccdBack &&
      formData.streetAddress &&
      formData.provinceCode &&
      formData.districtCode &&
      formData.wardCode
    );
    if (!step1Complete) return 1;

    // Step 2: Thông tin chỗ nghỉ - cần có đủ thông tin property
    const propInfo = formData.propertyInfo;
    const step2Complete = Boolean(
      propInfo?.propertyType &&
      propInfo?.propertyName &&
      propInfo?.description &&
      propInfo?.provinceCode &&
      propInfo?.districtCode &&
      propInfo?.propertyWard &&
      propInfo?.propertyAddress &&
      propInfo?.latitude &&
      propInfo?.longitude &&
      propInfo?.propertyImages?.length >= 3 &&
      propInfo?.amenityIds?.length >= 3 &&
      propInfo?.businessLicenseNumber &&
      propInfo?.businessLicenseImage &&
      propInfo?.policies?.checkInTime &&
      propInfo?.policies?.checkOutTime
    );
    if (!step2Complete) return 2;

    // Step 3: Thông tin thanh toán
    const payInfo = formData.paymentInfo;
    const step3Complete = Boolean(
      payInfo?.paymentMethod &&
      (payInfo?.paymentMethod !== 'bank' || (
        payInfo?.bankName &&
        payInfo?.accountHolderName &&
        payInfo?.accountNumber
      ))
    );
    if (!step3Complete) return 3;

    // Tất cả đã hoàn thành
    return 4;
  };

  const completedStep = getCompletedStep();
  // Cho phép quay lại bước đã hoàn thành HOẶC bước ngay sau bước hoàn thành (tức là bước tiếp theo được mở)
  const highestAccessibleStep = Math.min(completedStep + 1, 4);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isAccessible = step.id <= highestAccessibleStep;
          const isLocked = !isAccessible;
          
          // Chỉ cho phép click nếu bước đó accessible VÀ không phải bước hiện tại
          const isClickable = onStepClick && isAccessible && !isCurrent;

          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <div 
                className={`relative flex flex-col items-center ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => isClickable && onStepClick(step.id)}
                title={isLocked ? 'Hoàn thành các bước trước để mở khóa' : step.name}
              >
                {/* Circle with Icon */}
                <div
                  className={`
                    relative w-10 h-10 rounded-xl flex items-center justify-center 
                    font-semibold text-sm transition-all duration-300 z-10
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-[#28A9E0] to-[#0077B6] text-white shadow-lg shadow-[#28A9E0]/30 hover:shadow-[#28A9E0]/50 hover:scale-105' 
                      : isCurrent 
                        ? 'bg-white border-2 border-[#28A9E0] text-[#28A9E0] shadow-lg shadow-[#28A9E0]/20 scale-105' 
                        : isAccessible
                          ? 'bg-white border-2 border-slate-200 text-slate-400 hover:border-[#28A9E0] hover:text-[#28A9E0] hover:scale-105'
                          : 'bg-slate-100 border-2 border-slate-200 text-slate-300'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={2.5} />
                  ) : isLocked ? (
                    <Lock size={14} strokeWidth={2} />
                  ) : (
                    <StepIcon size={16} strokeWidth={2} />
                  )}
                </div>
                
                {/* Step Name */}
                <span 
                  className={`
                    absolute -bottom-6 text-xs font-semibold text-center 
                    transition-colors duration-300 whitespace-nowrap
                    ${isCurrent 
                      ? 'text-[#28A9E0]' 
                      : isCompleted 
                        ? 'text-slate-600' 
                        : isAccessible 
                          ? 'text-slate-500' 
                          : 'text-slate-400'
                    }
                  `}
                >
                  {step.name}
                </span>

                {/* Current Step Indicator */}
                {isCurrent && (
                  <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#28A9E0] rounded-full animate-pulse" />
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 relative h-[3px] rounded-full overflow-hidden bg-slate-200">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#28A9E0] to-[#0077B6] transition-all duration-500 ease-out rounded-full"
                    style={{ 
                      width: isCompleted ? '100%' : '0%',
                    }}
                  />
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
