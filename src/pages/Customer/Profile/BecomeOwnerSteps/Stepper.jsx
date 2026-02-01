import React from "react";
import { Check } from "lucide-react";

// 1. NHẬN 'steps' (danh sách bước) và 'currentStep' (vị trí 0, 1, 2, 3) từ props
//    Xóa mảng 'steps' hard-coded
export default function Stepper({ steps = [], currentStep = 0 }) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-center p-4 md:p-6">
        
        {/* 2. Map qua mảng 'steps' TỪ PROPS */}
        {steps.map((step, index) => {
          
          // 3. Logic so sánh dựa trên 0-based index
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;

          return (
            <li
              key={step.name}
              className={`relative ${
                index < steps.length - 1 ? "pr-32 sm:pr-64" : ""
              }`}
            >
              {/* Đường kẻ */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute inset-0 top-1/2 -translate-y-1/2 h-0.5 w-full ${
                    isCompleted ? "bg-[rgb(40,169,224)]" : "bg-gray-200"
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Vòng tròn số */}
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full font-medium">
                {isCompleted ? (
                  // Bước đã qua
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(40,169,224)]">
                    <Check className="h-5 w-5 text-white" />
                  </span>
                ) : isCurrent ? (
                  // 4. Bước hiện tại (Active): NỀN XANH, CHỮ TRẮNG (Theo yêu cầu)
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(40,169,224)] text-white">
                    {index + 1}
                  </span>
                ) : (
                  // Bước chưa tới
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Text */}
              <p
                className={`absolute -bottom-6 left-4 -translate-x-1/2 text-center text-xs font-medium ${
                  isCurrent ? "text-[rgb(40,169,224)]" : "text-gray-500"
                } whitespace-nowrap`}
              >
                {step.name}
              </p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}