import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { useOnboarding } from '@/context/OnboardingContext';
import VerticalStepper from "@/components/common/Stepper/VerticalStepper";
import Button from "@/components/common/Button/Button";
import OnboardingStepper from './components/OnboardingStepper';
import logo from "@/assets/logo/logo_tripify_xoafont.png"; 

// (Import all step components as before)
import Step0_PropertyType from './OnboardingSteps/Step0_PropertyType';
import Step1_GeneralInfo from './OnboardingSteps/Step1_GeneralInfo';
import Step2_Location from './OnboardingSteps/Step2_Location';
import Step3_PropertyImages from './OnboardingSteps/Step3_PropertyImages';
import Step4_Amenities from './OnboardingSteps/Step4_Amenities';
import Step5_BusinessInfo from './OnboardingSteps/Step5_BusinessInfo';
import Step_Policies from './OnboardingSteps/Step_Policies';
import Step_WholeUnitSetup from './OnboardingSteps/Step_WholeUnitSetup';

const fileListValidation = (min = 1, message) => 
    yup.mixed().test("required", message || `Cần ít nhất ${min} ảnh`, (val) => val && val.length >= min);

// UPDATED validation schemas to target `propertyInfo`
const validationSchemas = {
  step0: yup.object({ propertyInfo: yup.object({ propertyType: yup.string().required("Vui lòng chọn loại hình") }) }),
  step1: yup.object({ 
    propertyInfo: yup.object({ 
        propertyName: yup.string().required("Vui lòng nhập tên chỗ nghỉ"),
        description: yup.string().required("Vui lòng nhập mô tả").min(50, "Mô tả cần ít nhất 50 ký tự")
    }) 
  }),
  step2: yup.object({ 
    propertyInfo: yup.object({ 
        provinceCode: yup.string().required("Vui lòng chọn Tỉnh/Thành phố"),
        districtCode: yup.string().required("Vui lòng chọn Quận/Huyện"),
        propertyWard: yup.string().required("Vui lòng chọn Phường/Xã"),
        propertyAddress: yup.string().required("Vui lòng nhập địa chỉ chi tiết"),
        latitude: yup.number().required("Vui lòng chọn vị trí trên bản đồ"),
        longitude: yup.number().required("Vui lòng chọn vị trí trên bản đồ")
    }) 
  }),
  stepImages: yup.object({ 
    propertyInfo: yup.object({ 
        propertyImages: fileListValidation(3, "Vui lòng tải lên ít nhất 3 ảnh chỗ nghỉ")
    }) 
  }),
  stepAmenities: yup.object({ 
    propertyInfo: yup.object({ 
        amenityIds: yup.array().min(3, "Vui lòng chọn ít nhất 3 tiện ích")
    }) 
  }),
  stepBusiness: yup.object({ 
    propertyInfo: yup.object({ 
        businessLicenseNumber: yup.string().required("Vui lòng nhập số giấy phép kinh doanh"),
        businessLicenseImage: fileListValidation(1, "Vui lòng tải lên ảnh giấy phép kinh doanh")
    }) 
  }),
  stepPolicies: yup.object({ 
    propertyInfo: yup.object({ 
        policies: yup.object().shape({ 
            checkInTime: yup.string().required("Vui lòng chọn giờ nhận phòng"),
            checkOutTime: yup.string().required("Vui lòng chọn giờ trả phòng"),
            minimumAge: yup.number().typeError("Độ tuổi phải là số").min(0, "Tuổi không hợp lệ").required("Nhập độ tuổi tối thiểu"),
            freeCancellationDays: yup.number().when('allowFreeCancellation', {
                is: true,
                then: schema => schema.typeError("Số ngày phải là số").min(1, "Ít nhất 1 ngày").required("Nhập số ngày hủy miễn phí"),
                otherwise: schema => schema.nullable()
            })
        }) 
    }) 
  }),
  stepUnit: yup.object({ 
    propertyInfo: yup.object({ 
        unitData: yup.object().shape({ 
            name: yup.string().trim().required("Vui lòng nhập tên căn"),
            description: yup.string().trim().required("Vui lòng nhập mô tả căn").min(20, "Mô tả căn cần ít nhất 20 ký tự"),
            price: yup.number().typeError("Giá thuê phải là số").min(10000, "Giá tối thiểu 10,000 VNĐ").required("Vui lòng nhập giá"),
            capacity: yup.number().typeError("Sức chứa phải là số").min(1, "Sức chứa tối thiểu 1 người").required("Vui lòng nhập sức chứa"),
            area: yup.number().typeError("Diện tích phải là số").min(1, "Diện tích tối thiểu 1 m²").required("Vui lòng nhập diện tích"),
            images: fileListValidation(3, "Vui lòng tải lên ít nhất 3 ảnh chi tiết của căn")
        }) 
    }) 
  }),
};

const OwnerOnboardingStep2 = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useOnboarding();
    const [currentStep, setCurrentStep] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        getValues,
        setError,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: formData // Use full object
    });

    useEffect(() => {
        reset(formData);
    }, [formData, reset]);

    const propertyType = watch("propertyInfo.propertyType");
    const isWholeUnit = ["VILLA", "HOMESTAY"].includes(propertyType);

    const highestMinorStep = useMemo(() => {
        const p = formData?.propertyInfo || {};
        let step = 0;

        // Check Step 0: Loại hình
        const isStep0Done = !!p.propertyType;
        if (!isStep0Done) return Math.max(0, currentStep);
        step = 1;

        // Check Step 1: Thông tin chung
        const isStep1Done = !!(p.propertyName && p.description && p.description.length >= 50);
        if (!isStep1Done) return Math.max(step, currentStep);
        step = 2;

        // Check Step 2: Vị trí
        const isStep2Done = !!(
            p.provinceCode && p.districtCode && p.propertyWard && 
            p.propertyAddress && p.latitude && p.longitude
        );
        if (!isStep2Done) return Math.max(step, currentStep);
        step = 3;

        // Check Step 3: Hình ảnh
        const isStep3Done = !!(p.propertyImages && p.propertyImages.length >= 3);
        if (!isStep3Done) return Math.max(step, currentStep);
        step = 4;

        // Check Step 4: Tiện ích
        const isStep4Done = !!(p.amenityIds && p.amenityIds.length >= 3);
        if (!isStep4Done) return Math.max(step, currentStep);
        step = 5;

        // Check Step 5: Giấy phép kinh doanh
        const isStep5Done = !!(
            p.businessLicenseNumber && 
            p.businessLicenseImage && p.businessLicenseImage.length >= 1
        );
        if (!isStep5Done) return Math.max(step, currentStep);
        step = 6;

        // Check Step 6: Chính sách (Các trường cơ bản bắt buộc)
        const isStep6Done = !!(
            p.policies?.checkInTime && 
            p.policies?.checkOutTime && 
            p.policies?.minimumAge !== undefined && 
            p.policies?.minimumAge !== ''
        );
        if (!isStep6Done) return Math.max(step, currentStep);
        step = 7;

        return Math.max(step, currentStep); // Mở khóa toàn bộ nếu đã đến đây
    }, [formData, currentStep]);

    const stepsConfig = useMemo(() => {
        const baseSteps = [
            { id: 0, title: "Loại hình", component: Step0_PropertyType, schema: validationSchemas.step0 },
            { id: 1, title: "Thông tin chung", component: Step1_GeneralInfo, schema: validationSchemas.step1 },
            { id: 2, title: "Địa chỉ & Vị trí", component: Step2_Location, schema: validationSchemas.step2 },
            { id: 3, title: "Hình ảnh", component: Step3_PropertyImages, schema: validationSchemas.stepImages },
            { id: 4, title: "Tiện ích", component: Step4_Amenities, schema: validationSchemas.stepAmenities },
            { id: 5, title: "Giấy phép KD", component: Step5_BusinessInfo, schema: validationSchemas.stepBusiness },
            { id: 6, title: "Chính sách", component: Step_Policies, schema: validationSchemas.stepPolicies },
        ];
        if (isWholeUnit) {
            baseSteps.push({ id: 7, title: "Thiết lập Căn", component: Step_WholeUnitSetup, schema: validationSchemas.stepUnit });
        }
        return baseSteps;
    }, [isWholeUnit]);

    const CurrentStepConfig = stepsConfig[currentStep];
    const stepperItems = stepsConfig.slice(1).map(s => ({ name: s.title }));

    const handleNext = async () => {
        const currentSchema = CurrentStepConfig.schema;
        clearErrors();

        try {
            const values = getValues();
            await currentSchema.validate(values, { abortEarly: false });
            updateFormData(values);

            if (currentStep === stepsConfig.length - 1) {
                navigate('/partner/onboarding/step-3');
            } else {
                setCurrentStep(prev => prev + 1);
            }
        } catch (err) {
            if (err.inner) {
                err.inner.forEach(validationError => {
                    setError(validationError.path, { type: "manual", message: validationError.message });
                });
            }
        }
    };
    
    const handleBack = () => {
        // Save current progress before going back
        updateFormData(getValues());
        
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigate('/partner/onboarding/step-1');
        }
    };
    
const handleMajorStepClick = (stepId) => {
        updateFormData(getValues());
        
        // Bắt buộc phải có đủ 4 dòng này thì click từ Step 2 mới nhảy qua bước khác được
        if (stepId === 1) navigate('/partner/onboarding/step-1');
        if (stepId === 2) navigate('/partner/onboarding/step-2');
        if (stepId === 3) navigate('/partner/onboarding/step-3');
        if (stepId === 4) navigate('/partner/onboarding/step-4');
    };
    const handleSubStepClick = (targetIndex) => {
        const targetStateStep = targetIndex + 1;

        // Cho phép click (kể cả lùi về hay tiến lên) miễn là <= highestMinorStep
        if (targetStateStep <= highestMinorStep) {
            updateFormData(getValues());
            setCurrentStep(targetStateStep);
            clearErrors();
        }
    };
  
    const renderContent = () => {
        const StepComponent = CurrentStepConfig.component;
        
        if (currentStep === 0) {
            return (
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <StepComponent watch={watch} setValue={setValue} />
                    <div className="flex justify-end mt-10">
                        <Button type="button" onClick={handleNext} rightIcon={<ArrowRight size={18} />} disabled={!propertyType}>
                            Tiếp theo
                        </Button>
                    </div>
                </div>
            );
        }
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft size={18} />} className="mb-6">
                    Quay lại
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-1">
                        {/* ĐÃ THÊM onStepClick VÀO ĐÂY */}
                        <VerticalStepper 
                            steps={stepperItems} 
                            currentStep={currentStep - 1} 
                            highestStep={highestMinorStep - 1}
                            onStepClick={handleSubStepClick} 
                        />
                    </div>
                    <div className="md:col-span-3">
                         <StepComponent
                            register={register} // Keep original register for simplicity in child
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                            control={control}
                        />
                        <div className="flex justify-end pt-8 mt-8 border-t border-gray-100">
                            <Button type="button" onClick={handleNext} rightIcon={<ArrowRight size={18} />}>
                                {currentStep === stepsConfig.length - 1 ? 'Lưu & Tiếp tục' : 'Tiếp theo'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] font-sans pb-20">
            {/* --- HEADER MỚI (CHỈ CHỨA LOGO VÀ ACTION) --- */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={logo} alt="Tripify" className="h-8 sm:h-9 w-auto" />
                <div className="h-5 sm:h-6 w-px bg-slate-300 mx-1 sm:mx-2"></div>
                <span className="font-bold text-slate-700 tracking-tight text-sm sm:text-base">Đăng ký Đối tác</span>
            </div>
            
            {/* Nút Hỗ trợ UX: Lưu tiến độ */}
            <button 
                type="button"
                onClick={() => {
                  /* Gọi hàm lưu tiến độ API nếu có, sau đó redirect */
                  navigate('/partner'); 
                }}
                className="text-sm font-semibold text-slate-500 hover:text-[#28A9E0] transition-colors flex items-center gap-2"
            >
                <span className="hidden sm:inline">Lưu & Thoát</span>
                <span className="sm:hidden">Thoát</span>
            </button>
        </div>
      </header>

      {/* --- SECTION STEPPER (TÁCH BIỆT KHỎI HEADER ĐỂ UI THOÁNG HƠN) --- */}
      <div className="w-full bg-white border-b border-slate-100 pt-6 pb-12 sm:pt-8 sm:pb-14">
        <OnboardingStepper currentStep={2} onStepClick={handleMajorStepClick} />
      </div>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {renderContent()}
            </main>
        </div>
    );
};

export default OwnerOnboardingStep2;