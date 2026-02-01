// src/components/common/Stepper/VerticalStepper.jsx
import React from "react";
import { Check } from "lucide-react";

/**
 * Component Stepper Dọc
 * @param {Array} steps - Mảng các bước,
 * ví dụ: [{ name: "Vị trí", description: "Cơ sở của bạn ở đâu?" }]
 * @param {number} currentStep - Index (0-based) của bước hiện tại
 */
export default function VerticalStepper({ steps = [], currentStep = 0 }) {
  return (
    <nav aria-label="Vertical Stepper">
      <ol className="relative flex flex-col">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;

          return (
            <li
              key={step.name}
              // Thêm padding-bottom cho tất cả trừ mục cuối
              className={`relative flex-1 ${
                index < steps.length - 1 ? "pb-10" : ""
              }`}
            >
              {/* Đường kẻ dọc (nếu không phải mục cuối) */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-4 top-5 -ml-px h-full w-0.5 ${
                    isCompleted ? "bg-[rgb(40,169,224)]" : "bg-gray-200"
                  }`}
                  aria-hidden="true"
                />
              )}

              <div className="relative flex items-start group">
                {/* Vòng tròn số */}
                <span className="h-9 flex items-center">
                  <span
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full font-medium transition-all ${
                      isCompleted
                        ? "bg-[rgb(40,169,224)]" // Đã hoàn thành
                        : isCurrent
                        ? "border-2 border-[rgb(40,169,224)] bg-white text-[rgb(40,169,224)]" // Bước hiện tại
                        : "border-2 border-gray-300 bg-white text-gray-400" // Chưa tới
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </span>
                </span>
                
                {/* Text (Tên & Mô tả) */}
                <span className="ml-4 flex min-w-0 flex-col pt-1.5">
                  <span
                    className={`text-sm font-medium ${
                      isCurrent
                        ? "text-[rgb(40,169,224)]"
                        : "text-gray-700"
                    }`}
                  >
                    {step.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {step.description}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}