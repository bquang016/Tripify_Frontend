// src/pages/Owner/Properties/AddPropertyPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

// Import Services & Components
import propertyService from "@/services/property.service";
import VerticalStepper from "@/components/common/Stepper/VerticalStepper";
import Button from "@/components/common/Button/Button";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

// Import Steps
import Step0_PropertyType from "./AddPropertySteps/Step0_PropertyType";
import Step1_Location from "./AddPropertySteps/Step1_Location";
import Step2_Amenities from "./AddPropertySteps/Step2_Amenities";
import Step3_Images from "./AddPropertySteps/Step3_Images";
import Step4_Details from "./AddPropertySteps/Step4_Details";
import Step5_Review from "./AddPropertySteps/Step5_Review";
import Step6_Status from "./AddPropertySteps/Step6_Status";
import Step_WholeUnitSetup from "./AddPropertySteps/Step_WholeUnitSetup";
import Step_Policies from "./AddPropertySteps/Step_Policies";

const fileListValidation = (min = 3) => yup
    .mixed()
    .test("required", `Cần ít nhất ${min} ảnh`, (val) => val && val.length >= min);

export default function AddPropertyPage() {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';
  
  const baseSchemas = {
    step0: yup.object({ propertyType: yup.string().required(isVi ? "Chọn loại hình" : "Select type") }),
    step1: yup.object({
      province: yup.string().required(isVi ? "Chọn tỉnh/thành" : "Select province"),
      city: yup.string().required(isVi ? "Chọn quận/huyện" : "Select district"),
      address: yup.string().required(isVi ? "Nhập địa chỉ" : "Enter address"),
    }),
    step2: yup.object({ amenities: yup.object().nullable() }),
    step3: yup.object({ propertyImages: fileListValidation(3) }),
    step4: yup.object({
      propertyName: yup.string().required(isVi ? "Vui lòng nhập tên chỗ nghỉ" : "Enter property name"),
      description: yup.string()
          .min(50, isVi ? "Mô tả quá ngắn, tối thiểu 50 ký tự" : "Description too short, min 50 chars")
          .required(isVi ? "Vui lòng nhập mô tả chi tiết" : "Enter description"),
      area: yup.number()
          .transform((value, originalValue) => (String(originalValue).trim() === "" ? null : value))
          .nullable()
          .typeError(isVi ? "Diện tích phải là số hợp lệ" : "Area must be a valid number")
          .positive(isVi ? "Diện tích phải lớn hơn 0" : "Area must be positive")
          .required(isVi ? "Vui lòng nhập diện tích" : "Enter area"),
    }),
    stepPolicies: yup.object({
      policies: yup.object().shape({
        checkInFrom: yup.string().required(isVi ? "Chọn giờ nhận phòng" : "Select check-in time"),
        checkInTo: yup.string().required(isVi ? "Chọn giờ nhận phòng" : "Select check-in time"),
        checkOutFrom: yup.string().required(isVi ? "Chọn giờ trả phòng" : "Select check-out time"),
        checkOutTo: yup.string().required(isVi ? "Chọn giờ trả phòng" : "Select check-out time"),
      })
    }),
    stepUnit: yup.object({
      unitData: yup.object().shape({
        price: yup.number().min(10000, isVi ? "Giá tối thiểu 10,000đ" : "Min price 10,000đ").required(isVi ? "Nhập giá ngày thường" : "Enter weekday price"),
        weekendPrice: yup.number()
            .transform((value, originalValue) => (String(originalValue).trim() === "" ? 0 : value))
            .min(0, isVi ? "Giá không hợp lệ" : "Invalid price"),
        capacity: yup.number().min(1, isVi ? "Sức chứa tối thiểu 1" : "Min capacity 1").required(isVi ? "Nhập sức chứa" : "Enter capacity"),
        description: yup.string().required(isVi ? "Vui lòng nhập mô tả chi tiết về căn" : "Enter unit description"),
      })
    }),
    stepReview: yup.object({
      terms: yup.boolean().oneOf([true], isVi ? "Bạn phải đồng ý điều khoản" : "You must agree to terms"),
    }),
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorState] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      propertyType: "HOTEL",
      country: "Việt Nam",
      amenities: {},
      province: "", city: "", address: "",
      propertyImages: null,
      propertyName: "", description: "", area: "",
      terms: false,
      unitData: {
        price: 0,
        weekendPrice: 0,
        capacity: 2,
        description: "",
        amenities: {},
        images: []
      },
      policies: {
        checkInFrom: "14:00",
        checkInTo: "23:00",
        checkOutFrom: "06:00",
        checkOutTo: "12:00",
        petsAllowed: false,
        smokingAllowed: false,
        childrenAllowed: true,
        allowFreeCancellation: true,
        freeCancellationDays: 3,
        requiresPrepayment: false,
        securityDepositRequired: false,
        minimumAge: 18,
      }
    }
  });

  const propertyType = watch("propertyType");
  const isWholeUnit = ["VILLA", "HOMESTAY"].includes(propertyType);

  const stepsConfig = useMemo(() => {
    const steps = [
      { id: 0, title: t('add_property_flow.step_type'), component: Step0_PropertyType, schema: baseSchemas.step0 },
      { id: 1, title: t('add_property_flow.step_location'), component: Step1_Location, schema: baseSchemas.step1 },
      { id: 2, title: t('add_property_flow.step_amenities'), component: Step2_Amenities, schema: baseSchemas.step2 },
      { id: 3, title: t('add_property_flow.step_images'), component: Step3_Images, schema: baseSchemas.step3 },
      { id: 4, title: t('add_property_flow.step_details'), component: Step4_Details, schema: baseSchemas.step4 },
      { id: 5, title: t('add_property_flow.step_policies'), component: Step_Policies, schema: baseSchemas.stepPolicies },
    ];

    if (isWholeUnit) {
      steps.push({
        id: 6,
        title: t('add_property_flow.step_unit'),
        component: Step_WholeUnitSetup,
        schema: baseSchemas.stepUnit
      });
    }

    steps.push({
      id: isWholeUnit ? 7 : 6,
      title: t('add_property_flow.step_review'),
      component: Step5_Review,
      schema: baseSchemas.stepReview
    });

    return steps;
  }, [isWholeUnit, i18n.language]);

  const CurrentStepConfig = stepsConfig[currentStep];
  const stepperItems = stepsConfig.slice(1).map(s => ({ name: s.title }));

  const handleNext = async () => {
    const currentSchema = CurrentStepConfig.schema;
    clearErrors();

    if (currentSchema) {
      try {
        await currentSchema.validate(getValues(), { abortEarly: false });
        setCurrentStep(prev => prev + 1);
      } catch (err) {
        if (err.inner) {
          err.inner.forEach(validationError => {
            setError(validationError.path, {
              type: "manual",
              message: validationError.message,
            });
          });
        }
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
    else navigate('/owner/properties');
  };

  const onFinalSubmit = async (data) => {
    setIsLoading(true);
    setErrorState(null);

    try {
      const propertyPayload = { ...data };
      if (isWholeUnit && data.unitData) {
        propertyPayload.price = data.unitData.price;
        propertyPayload.weekendPrice = data.unitData.weekendPrice;
        propertyPayload.capacity = data.unitData.capacity;
        propertyPayload.unitName = data.unitData.name;
      }

      delete propertyPayload.propertyImages;
      delete propertyPayload.unitData;
      delete propertyPayload.terms;
      delete propertyPayload.policies;

      const propertyFormData = new FormData();
      propertyFormData.append("propertyData", new Blob([JSON.stringify(propertyPayload)], { type: "application/json" }));

      if (data.propertyImages) {
        Array.from(data.propertyImages).forEach(file => propertyFormData.append("propertyImages", file));
      }

      const res = await propertyService.submitPropertyApplication(propertyFormData);
      const newPropertyId = res.data?.propertyId || res.data?.id;
      if (!newPropertyId) throw new Error("Failed to get property ID.");

      if (data.policies) {
        await propertyService.addPropertyPolicies(newPropertyId, data.policies);
      }

      setCurrentStep(stepsConfig.length);
    } catch (err) {
      console.error(err);
      const serverMessage = err.response?.data?.message || err.message;
      setErrorState(`Error: ${serverMessage}`);
      setCurrentStep(stepsConfig.length);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === stepsConfig.length) {
    return <Step6_Status error={error} onRetry={() => { setErrorState(null); setCurrentStep(stepsConfig.length - 2); }} />;
  }

  const StepComponent = CurrentStepConfig?.component;

  return (
      <>
        {isLoading && <LoadingOverlay message={t('add_property_flow.processing')} />}

        {currentStep < stepsConfig.length && (
            <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft size={18} />} className="mb-4">
              {t('add_property_flow.back')}
            </Button>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          {currentStep === 0 ? (
              <form>
                <StepComponent watch={watch} setValue={setValue} />
                <div className="flex justify-end mt-8">
                  <Button type="button" onClick={handleNext} rightIcon={<ArrowRight size={18} />} disabled={!propertyType}>
                    {t('add_property_flow.next')}
                  </Button>
                </div>
              </form>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="md:col-span-1">
                  <VerticalStepper steps={stepperItems} currentStep={currentStep - 1} />
                </div>

                <div className="md:col-span-3">
                  <form onSubmit={handleSubmit(() => {})}>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                      {CurrentStepConfig.title}
                    </h2>

                    {StepComponent && (
                        <StepComponent
                            register={register}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                            control={control}
                            trigger={trigger}
                            setError={setError}
                            clearErrors={clearErrors}
                        />
                    )}

                    <div className="flex justify-end pt-8 mt-8 border-t border-gray-100">
                      {currentStep === stepsConfig.length - 1 ? (
                          <Button
                              type="button"
                              onClick={handleSubmit(onFinalSubmit)}
                              leftIcon={<Send size={18} />}
                              disabled={!watch("terms")}
                          >
                            {t('add_property_flow.submit')}
                          </Button>
                      ) : (
                          <Button type="button" onClick={handleNext} rightIcon={<ArrowRight size={18} />}>
                            {t('add_property_flow.next')}
                          </Button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
          )}
        </div>
      </>
  );
}
