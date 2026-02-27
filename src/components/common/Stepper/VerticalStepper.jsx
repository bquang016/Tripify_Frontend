// src/components/common/Stepper/VerticalStepper.jsx
import React from "react";
import { Check } from "lucide-react";

export default function VerticalStepper({ steps = [], currentStep = 0, onStepClick, highestStep = currentStep }) {
  return (
    <nav aria-label="Vertical Stepper">
      <ol className="relative flex flex-col">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          
          // Chìa khóa: Cho phép click nếu index <= highestStep
          const isClickable = onStepClick && (index <= highestStep);

          return (
            <li
              key={step.name}
              className={`relative flex-1 ${index < steps.length - 1 ? "pb-10" : ""} ${isClickable ? 'cursor-pointer group' : ''}`}
              onClick={() => isClickable && onStepClick(index)}
            >
              {index < steps.length - 1 && (
                <div className={`absolute left-4 top-5 -ml-px h-full w-0.5 ${isCompleted ? "bg-[rgb(40,169,224)]" : "bg-gray-200"}`} aria-hidden="true" />
              )}

              <div className="relative flex items-start">
                <span className="h-9 flex items-center">
                  <span
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full font-medium transition-all duration-300 ${
                      isCompleted
                        ? "bg-[rgb(40,169,224)] text-white group-hover:shadow-md group-hover:scale-110 group-hover:bg-[#2090C0]" 
                        : isCurrent
                        ? "border-2 border-[rgb(40,169,224)] bg-white text-[rgb(40,169,224)] scale-110 shadow-sm" 
                        : isClickable
                        ? "border-2 border-blue-200 bg-white text-blue-400 group-hover:border-[rgb(40,169,224)] group-hover:text-[rgb(40,169,224)] group-hover:scale-110 shadow-sm"
                        : "border-2 border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5 text-white" /> : <span>{index + 1}</span>}
                  </span>
                </span>
                
                <span className="ml-4 flex min-w-0 flex-col pt-1.5 transition-transform duration-300 group-hover:translate-x-1">
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isCurrent
                        ? "text-[rgb(40,169,224)]"
                        : isCompleted
                        ? "text-gray-800 group-hover:text-[rgb(40,169,224)]"
                        : isClickable
                        ? "text-gray-600 group-hover:text-[rgb(40,169,224)]"
                        : "text-gray-400"
                    }`}
                  >
                    {step.name}
                  </span>
                  <span className="text-sm text-gray-500">{step.description}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}