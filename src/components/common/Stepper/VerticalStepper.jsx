// src/components/common/Stepper/VerticalStepper.jsx
import React from "react";
import { Check, Lock } from "lucide-react";

export default function VerticalStepper({ steps = [], currentStep = 0, onStepClick, highestStep = currentStep }) {
  return (
    <nav aria-label="Vertical Stepper" className="w-full">
      <ol className="relative flex flex-col gap-1">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          
          // Logic nghiêm ngặt: Chỉ cho phép click vào các bước <= highestStep (đã hoàn thành hoặc đang làm)
          const isAccessible = index <= highestStep;
          const isLocked = !isAccessible;
          const isClickable = onStepClick && isAccessible && !isCurrent;

          return (
            <li
              key={step.name}
              className={`relative ${index < steps.length - 1 ? "pb-6" : ""}`}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute left-[15px] top-8 w-0.5 h-[calc(100%-20px)] rounded-full transition-colors duration-300 ${
                    isCompleted ? "bg-gradient-to-b from-[#28A9E0] to-[#0077B6]" : "bg-slate-200"
                  }`} 
                  aria-hidden="true" 
                />
              )}

              <div 
                className={`relative flex items-start gap-3 p-2 -ml-2 rounded-xl transition-all duration-200 ${
                  isClickable 
                    ? 'cursor-pointer hover:bg-slate-50' 
                    : isCurrent 
                      ? 'bg-[#28A9E0]/5' 
                      : ''
                }`}
                onClick={() => isClickable && onStepClick(index)}
                title={isLocked ? 'Hoàn thành bước trước để mở khóa' : step.name}
              >
                {/* Step Circle */}
                <div className="flex items-center justify-center shrink-0">
                  <span
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-lg font-semibold text-sm transition-all duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-br from-[#28A9E0] to-[#0077B6] text-white shadow-md shadow-[#28A9E0]/25" 
                        : isCurrent
                          ? "bg-white border-2 border-[#28A9E0] text-[#28A9E0] shadow-md shadow-[#28A9E0]/15" 
                          : isAccessible
                            ? "bg-white border-2 border-slate-200 text-slate-500 hover:border-[#28A9E0] hover:text-[#28A9E0]"
                            : "bg-slate-100 border-2 border-slate-200 text-slate-300"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
                    ) : isLocked ? (
                      <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </span>
                </div>
                
                {/* Step Content */}
                <div className="flex flex-col min-w-0 pt-0.5">
                  <span
                    className={`text-sm font-semibold transition-colors leading-tight ${
                      isCurrent
                        ? "text-[#28A9E0]"
                        : isCompleted
                          ? "text-slate-700"
                          : isAccessible
                            ? "text-slate-600"
                            : "text-slate-400"
                    }`}
                  >
                    {step.name}
                  </span>
                  {step.description && (
                    <span className={`text-xs mt-0.5 ${isCurrent ? 'text-[#28A9E0]/70' : 'text-slate-400'}`}>
                      {step.description}
                    </span>
                  )}
                </div>

                {/* Current Indicator */}
                {isCurrent && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="w-1.5 h-1.5 bg-[#28A9E0] rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
