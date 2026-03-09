import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Banknote, CreditCard, ArrowRight } from 'lucide-react';

import { useOnboarding } from '@/context/OnboardingContext';
import OnboardingHeader from './components/OnboardingHeader';
import Button from '@/components/common/Button/Button';
import PartnerInput from './components/PartnerInput';

const schema = yup.object().shape({
    paymentMethod: yup.string().required(),
    bankName: yup.string().when('paymentMethod', {
        is: 'bank',
        then: schema => schema.required('Vui lòng nhập tên ngân hàng'),
    }),
    accountHolderName: yup.string().when('paymentMethod', {
        is: 'bank',
        then: schema => schema.required('Vui lòng nhập tên chủ tài khoản'),
    }),
    accountNumber: yup.string().when('paymentMethod', {
        is: 'bank',
        then: schema => schema.required('Vui lòng nhập số tài khoản'),
    }),
});

const OwnerOnboardingStep3 = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useOnboarding();

    const { register, handleSubmit, watch, reset, getValues, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: formData.paymentInfo,
    });
    
    useEffect(() => {
        reset(formData.paymentInfo);
    }, [formData, reset]);

    const handleMajorStepClick = (stepId) => {
    // Lưu tạm dữ liệu người dùng đã nhập
    updateFormData({ paymentInfo: getValues() });
    
    // Điều hướng dựa trên step được click (Thực tế ở step 1 thì họ chỉ có thể click lại step 1, 
    // nhưng ta cứ viết đủ logic để tránh lỗi khi mở rộng)
    if (stepId === 1) navigate("/partner/onboarding/step-1");
    if (stepId === 2) navigate("/partner/onboarding/step-2");
    if (stepId === 3) navigate("/partner/onboarding/step-3");
    if (stepId === 4) navigate("/partner/onboarding/step-4");
  };

    const paymentMethod = watch('paymentMethod');

    const onNext = (data) => {
        updateFormData({ paymentInfo: data });
        navigate('/partner/onboarding/step-4');
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white font-sans pb-20">
            <OnboardingHeader 
                currentStep={3} 
                onStepClick={handleMajorStepClick}
                title="Thông tin thanh toán"
            />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Thông tin Thanh toán</h1>
                    <p className="text-slate-500 mt-2 text-lg">Cung cấp thông tin để chúng tôi có thể thanh toán cho bạn.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <form onSubmit={handleSubmit(onNext)}>
                        <div className="mb-6">
                             <div className="flex border-b border-gray-200">
                                <label className={`flex items-center gap-2 px-6 py-3 cursor-pointer border-b-2 transition-all -mb-px
                                    ${paymentMethod === 'bank' ? 'border-[rgb(40,169,224)] text-[rgb(40,169,224)]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                                >
                                    <input type="radio" value="bank" {...register('paymentMethod')} className="hidden" />
                                    <Banknote size={18} />
                                    <span className="font-bold">Tài khoản ngân hàng</span>
                                </label>
                                 <label className={`flex items-center gap-2 px-6 py-3 cursor-pointer border-b-2 transition-all -mb-px
                                    ${paymentMethod === 'card' ? 'border-[rgb(40,169,224)] text-[rgb(40,169,224)]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                                >
                                    <input type="radio" value="card" {...register('paymentMethod')} className="hidden" />
                                    <CreditCard size={18} />
                                    <span className="font-bold">Thẻ (Sắp ra mắt)</span>
                                </label>
                            </div>
                        </div>

                        {paymentMethod === 'bank' && (
                             <div className="space-y-4 animate-fadeIn">
                                <PartnerInput name="bankName" label="Tên ngân hàng (VD: Vietcombank)" register={register} errors={errors} />
                                <PartnerInput name="accountHolderName" label="Tên chủ tài khoản" register={register} errors={errors} />
                                <PartnerInput name="accountNumber" label="Số tài khoản" register={register} errors={errors} />
                             </div>
                        )}

                        {paymentMethod === 'card' && (
                             <div className="text-center p-8 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-600">Tính năng thanh toán qua thẻ sẽ được ra mắt trong thời gian tới.</p>
                             </div>
                        )}

                        <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-100">
                            <Button type="button" variant="ghost" onClick={() => navigate('/partner/onboarding/step-2')}>
                                Quay lại
                            </Button>
                            <Button type="submit" rightIcon={<ArrowRight size={18} />}>
                                Lưu & Tiếp tục
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default OwnerOnboardingStep3;
