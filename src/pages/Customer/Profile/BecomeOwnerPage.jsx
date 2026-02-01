// ✅ Import
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import Stepper from "./BecomeOwnerSteps/Stepper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { ownerService } from "@/services/owner.service";
import { userService } from "@/services/user.service";

import Step1_PersonalInfo from "./BecomeOwnerSteps/Step1_PersonalInfo";
import Step2_BusinessInfo from "./BecomeOwnerSteps/Step2_BusinessInfo";
import Step3_Review from "./BecomeOwnerSteps/Step3_Review";
import Step4_Success from "./BecomeOwnerSteps/Step4_Success";

import Button from "@/components/common/Button/Button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

// Convert 'yyyy-mm-dd' → Date object
const parseApiDate = (isoDate) => {
  if (!isoDate || !isoDate.includes("-")) return null;
  try {
    const [y, m, d] = isoDate.split("-").map(Number);
    return new Date(y, m - 1, d);
  } catch {
    return null;
  }
};

// File validation common
const fileValidation = yup
    .mixed()
    .test("required", "Vui lòng tải lên file", (value) => value && value.length > 0)
    .test("fileType", "Chỉ chấp nhận JPG, PNG, WEBP", (value) => {
      if (!value || value.length === 0) return true;
      const file = value[0];
      return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    });

// =========================
//     SCHEMAS CHUẨN
// =========================
const schemas = [
  // STEP 1
  yup.object().shape({
    personalFullName: yup.string().required("Họ tên là bắt buộc"),
    personalEmail: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
    personalPhone: yup.string().required("Số điện thoại là bắt buộc"),
    personalIdCard: yup.string().required("Số CCCD/Passport là bắt buộc"),
    personalDob: yup.date().required("Ngày sinh là bắt buộc").typeError("Ngày sinh không hợp lệ"),
    personalHometown: yup.string().required("Quê quán là bắt buộc"),
    personalAddress: yup.string().required("Địa chỉ thường trú là bắt buộc"),

    // 🔥 FIELD FILE MỚI KHỚP BE
    cardFrontImage: fileValidation,
    cardBackImage: fileValidation,
  }),

  // STEP 2
  yup.object().shape({
    businessLicenseNumber: yup
        .string()
        .required("Mã số ĐKKD là bắt buộc")
        .min(5, "Mã số ĐKKD phải có ít nhất 5 ký tự"),

    // 🔥 FIELD FILE MỚI
    businessLicenseImage: fileValidation,
  }),

  // STEP 3: không validate
  yup.object().shape({}),
];

export default function BecomeOwnerPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const navigate = useNavigate();

  const currentSchema = schemas[currentStep];

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(currentSchema),
    mode: "onChange",
  });

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsDataLoading(true);
        const res = await userService.getUserDetail();
        const user = res.data || res;

        if (user.fullName) setValue("personalFullName", user.fullName);
        if (user.email) setValue("personalEmail", user.email);
        if (user.phoneNumber) setValue("personalPhone", user.phoneNumber);
        if (user.address) setValue("personalAddress", user.address);

        if (user.dateOfBirth) {
          setValue("personalDob", parseApiDate(user.dateOfBirth));
        }

        setProfileData(user);
      } catch (e) {
        console.error("Lỗi tải profile:", e);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadProfile();
  }, [setValue]);

  const steps = [
    { name: "Thông tin cá nhân" },
    { name: "Thông tin kinh doanh" },
    { name: "Kiểm tra" },
    { name: "Hoàn tất" },
  ];

  const handleNext = async () => {
    const ok = await trigger();
    if (ok && currentStep < 2) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) navigate("/");
    else setCurrentStep((s) => s - 1);
  };

  const handleRetry = () => {
    setError(null);
    setCurrentStep(2);
  };

  // =========================
  //   SUBMIT CHUẨN MULTIPART
  // =========================
  const onFinalSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // ✔ FILES (KHỚP BE)
      formData.append("cardFrontImage", data.cardFrontImage[0]);
      formData.append("cardBackImage", data.cardBackImage[0]);
      formData.append("businessLicenseImage", data.businessLicenseImage[0]);

      // ✔ TEXT FIELDS
      formData.append("personalFullName", data.personalFullName);
      formData.append("personalEmail", data.personalEmail);
      formData.append("personalPhone", data.personalPhone);
      formData.append("personalIdCard", data.personalIdCard);

      const dobIso = new Date(data.personalDob).toISOString().split("T")[0];
      formData.append("personalDob", dobIso);

      formData.append("permanentAddress", data.personalAddress);
      formData.append("hometownAddress", data.personalHometown);
      formData.append("businessLicenseNumber", data.businessLicenseNumber);

      // Gửi multipart
      await ownerService.submitApplication(formData);

    } catch (err) {
      console.error("❌ Lỗi gửi đơn:", err);
      setError(err.message ?? "Lỗi hệ thống. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
      setCurrentStep(3);
    }
  };

  const stepComponents = [
    <Step1_PersonalInfo
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        profileData={profileData}
        isDataLoading={isDataLoading}
    />,
    <Step2_BusinessInfo
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
    />,
    <Step3_Review watch={watch} />,
    <Step4_Success error={error} onRetry={handleRetry} />,
  ];

  return (
      <CustomerLayout>
        {(isLoading || isDataLoading) && (
            <LoadingOverlay
                message={isLoading ? "Đang gửi đơn..." : "Đang tải dữ liệu..."}
            />
        )}

        <div className="max-w-4xl mx-auto py-12 px-6">
          <Stepper steps={steps} currentStep={currentStep} />

          <div className="bg-white p-8 rounded-2xl shadow-lg mt-8 border border-gray-100">
            <form>
              {stepComponents[currentStep]}

              {currentStep < 3 && (
                  <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-100">

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        leftIcon={<ArrowLeft size={18} />}
                    >
                      {currentStep === 0 ? "Quay về trang chủ" : "Quay lại"}
                    </Button>

                    {currentStep < 2 ? (
                        <Button
                            type="button"
                            onClick={handleNext}
                            rightIcon={<ArrowRight size={18} />}
                            disabled={isDataLoading}
                        >
                          Tiếp theo
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            leftIcon={<Send size={18} />}
                            onClick={handleSubmit(onFinalSubmit)}
                        >
                          Gửi đơn đăng ký
                        </Button>
                    )}
                  </div>
              )}
            </form>
          </div>
        </div>
      </CustomerLayout>
  );
}
