import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, X } from 'lucide-react';
import logo from "@/assets/logo/logo_tripify_xoafont.png";
import OnboardingStepper from './OnboardingStepper';

const OnboardingHeader = ({ 
  currentStep, 
  onStepClick,
  showBackButton = false,
  onBack,
  title = "Partner Center"
}) => {
  const navigate = useNavigate();

  const handleExit = () => {
    if (window.confirm('Bạn có chắc muốn thoát? Dữ liệu đã nhập sẽ được lưu tạm.')) {
      navigate('/');
    }
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      {/* Progress bar */}
      <div className="h-1 bg-slate-100">
        <div 
          className="h-full bg-gradient-to-r from-[#28A9E0] to-[#0077B6] transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Main Header Row */}
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            {showBackButton && onBack ? (
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                aria-label="Quay lại"
              >
                <ArrowLeft size={20} />
              </button>
            ) : null}
            
            <a href="/" className="flex items-center gap-2 shrink-0">
              <img src={logo} alt="Tripify" className="h-8 w-auto" />
            </a>
            
            <div className="hidden sm:flex items-center">
              <div className="h-5 w-px bg-slate-200 mx-3" />
              <span className="text-sm font-semibold text-slate-600 tracking-tight">
                {title}
              </span>
            </div>
          </div>

          {/* Center: Stepper - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 justify-center max-w-md">
            <OnboardingStepper currentStep={currentStep} onStepClick={onStepClick} />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Step Indicator */}
            <div className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
              <span className="text-xs font-bold text-[#28A9E0]">
                {currentStep}
              </span>
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xs font-medium text-slate-500">4</span>
            </div>

            <button
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              title="Trợ giúp"
            >
              <HelpCircle size={20} />
            </button>

            <button
              onClick={handleExit}
              className="p-2 rounded-lg hover:bg-red-50 transition-colors text-slate-400 hover:text-red-500"
              title="Thoát"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Stepper Row */}
        <div className="lg:hidden px-4 pb-4">
          <OnboardingStepper currentStep={currentStep} onStepClick={onStepClick} />
        </div>
      </div>
    </header>
  );
};

export default OnboardingHeader;
