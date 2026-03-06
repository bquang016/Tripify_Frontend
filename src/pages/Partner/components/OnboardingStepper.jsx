import React from 'react';
import { Check } from 'lucide-react';
import { useOnboarding } from "@/context/OnboardingContext";

const OnboardingStepper = ({ currentStep, onStepClick }) => {
  const { formData } = useOnboarding(); 

  const steps = [
    { id: 1, name: 'Xác minh danh tính' },
    { id: 2, name: 'Thông tin doanh nghiệp' },
    { id: 3, name: 'Thông tin thanh toán' },
    { id: 4, name: 'Hoàn tất' }
  ];

  // Logic tự động mở khóa bước an toàn hơn
  let highestStep = currentStep;
  if (formData) {
      if (formData.fullName || formData.phoneNumber) highestStep = Math.max(highestStep, 2);
      if (formData.propertyInfo && Object.keys(formData.propertyInfo).length > 0) highestStep = Math.max(highestStep, 3);
      if (formData.paymentInfo && Object.keys(formData.paymentInfo).length > 0) highestStep = Math.max(highestStep, 4);
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-6">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          
          // Chìa khóa: Cho phép click nếu bước đó <= bước cao nhất đã từng đi qua
          const isClickable = onStepClick && (step.id <= highestStep);

          return (
            <React.Fragment key={step.id}>
              {/* Vòng tròn Bước (Node) */}
              <div 
                className={`relative flex flex-col items-center group ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => isClickable && onStepClick(step.id)}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 z-10 border-[3px]
                    ${isCompleted 
                      ? 'bg-[#28A9E0] border-[#28A9E0] text-white shadow-md shadow-blue-200 group-hover:scale-110 group-hover:bg-[#2090C0]' 
                      : isCurrent 
                        ? 'bg-white border-[#28A9E0] text-[#28A9E0] shadow-lg shadow-blue-100 scale-110 ring-4 ring-[#28A9E0]/15' 
                        : isClickable
                          ? 'bg-white border-blue-200 text-blue-400 group-hover:border-[#28A9E0] group-hover:text-[#28A9E0] group-hover:scale-110 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-300'
                    }
                  `}
                >
                  {isCompleted ? <Check size={22} strokeWidth={3} /> : step.id}
                </div>
                
                {/* Tên bước - dùng absolute để text không chèn ép layout đường nối */}
                <div className="absolute top-14 mt-2 flex flex-col items-center w-36">
                  <span 
                    className={`text-[13px] font-bold text-center transition-colors duration-300 whitespace-normal leading-tight
                      ${isCurrent ? 'text-[#28A9E0]' : isCompleted ? 'text-slate-700 group-hover:text-[#28A9E0]' : isClickable ? 'text-slate-500 group-hover:text-[#28A9E0]' : 'text-slate-400'}
                    `}
                  >
                    {step.name}
                  </span>
                </div>
              </div>

              {/* Đường nối ngang (Connector) */}
              {index < steps.length - 1 && (
                <div className="flex-auto mx-2 sm:mx-4 mb-8 relative">
                  {/* Đường nền màu xám nhạt */}
                  <div className="absolute w-full border-t-[3px] border-slate-200 top-1/2 -translate-y-1/2 rounded-full"></div>
                  {/* Đường màu xanh thể hiện tiến độ */}
                  <div 
                    className={`absolute border-t-[3px] border-[#28A9E0] top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out rounded-full`}
                    style={{ 
                        width: isCompleted ? '100%' : '0%',
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