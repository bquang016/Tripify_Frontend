import React from 'react';
import { Check } from 'lucide-react';

const OnboardingStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Xác minh danh tính' },
    { id: 2, name: 'Thông tin doanh nghiệp' },
    { id: 3, name: 'Thông tin thanh toán' },
    { id: 4, name: 'Hoàn tất' }
  ];

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between relative">
        {/* Line Background */}
        <div className="absolute left-0 top-5 w-full h-1 bg-slate-100 -z-10 rounded-full"></div>
        
        {/* Dynamic Progress Line */}
        <div 
            className="absolute left-0 top-5 h-1 bg-[#28A9E0] -z-10 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center group cursor-default">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-[3px] z-10
                  ${isCompleted 
                    ? 'bg-[#28A9E0] border-[#28A9E0] text-white shadow-md shadow-blue-200' 
                    : isCurrent 
                      ? 'bg-white border-[#28A9E0] text-[#28A9E0] shadow-lg shadow-blue-100 scale-110' 
                      : 'bg-white border-slate-200 text-slate-300'
                  }
                `}
              >
                {isCompleted ? <Check size={20} strokeWidth={3} /> : step.id}
              </div>
              <span 
                className={`mt-2 text-xs font-semibold transition-colors duration-300
                  ${isCurrent ? 'text-[#28A9E0]' : isCompleted ? 'text-slate-600' : 'text-slate-400'}
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