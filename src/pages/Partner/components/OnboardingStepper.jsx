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
    <div className="w-full py-2">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-5 w-full h-1 bg-slate-100 -z-10 rounded-full"></div>
        <div 
            className="absolute left-0 top-5 h-1 bg-[#28A9E0] -z-10 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          
          // Chìa khóa: Cho phép click nếu bước đó <= bước cao nhất đã từng đi qua
          const isClickable = onStepClick && (step.id <= highestStep);

          return (
            <div 
              key={step.id} 
              className={`flex flex-col items-center group ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-[3px] z-10
                  ${isCompleted 
                    ? 'bg-[#28A9E0] border-[#28A9E0] text-white shadow-md shadow-blue-200 group-hover:scale-110 group-hover:bg-[#2090C0]' 
                    : isCurrent 
                      ? 'bg-white border-[#28A9E0] text-[#28A9E0] shadow-lg shadow-blue-100 scale-110' 
                      : isClickable
                        ? 'bg-white border-blue-200 text-blue-400 group-hover:border-[#28A9E0] group-hover:text-[#28A9E0] group-hover:scale-110 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-300'
                  }
                `}
              >
                {isCompleted ? <Check size={20} strokeWidth={3} /> : step.id}
              </div>
              <span 
                className={`mt-2 text-xs font-semibold transition-colors duration-300
                  ${isCurrent ? 'text-[#28A9E0]' : isCompleted ? 'text-slate-600 group-hover:text-[#28A9E0]' : isClickable ? 'text-slate-500 group-hover:text-[#28A9E0]' : 'text-slate-400'}
                `}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingStepper;