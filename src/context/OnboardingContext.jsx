import React, { createContext, useState, useContext, useEffect } from 'react';

const OnboardingContext = createContext(null);

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};

const initialFormData = {
    temporaryToken: null,
    email: '',

    // From Step 1
    fullName: '',
    phoneNumber: '',
    identityCardNumber: '',
    dateOfBirth: null,
    gender: '',
    address: '',
    city: '',
    avatar: null,
    cccdFront: null,
    cccdBack: null,

    // From Step 2 - now nested
    propertyInfo: {
        propertyType: '',
        propertyName: '',
        description: '',
        propertyAddress: '',
        propertyCity: '',
        propertyDistrict: '',
        propertyWard: '',
        latitude: 21.028511, 
        longitude: 105.804817,
        amenityIds: [],
        propertyImages: null,
        businessLicenseNumber: '',
        businessLicenseImage: null,
        terms: false,
        unitData: {
            name: '',
            price: '',
            weekendPrice: '',
            capacity: '',
            area: '',
            description: "",
            amenities: {},
            images: []
        },
        policies: {
            checkInTime: "14:00",
            checkOutTime: "12:00",
            smokingAllowed: false,
            petsAllowed: false,
            childrenAllowed: true,
            minimumAge: 18,
            allowFreeCancellation: true,
            freeCancellationDays: 3,
            securityDepositRequired: false,
            securityDepositAmount: 0
        },
    },
    
    // From Step 3
    paymentInfo: {
        paymentMethod: 'bank',
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
    }
};

export const OnboardingProvider = ({ children }) => {
    // 1. Khởi tạo state từ localStorage để dữ liệu sống sót qua việc tắt Tab
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('partnerOnboardingData');
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                console.error("Lỗi đọc dữ liệu Onboarding:", e);
            }
        }
        return initialFormData;
    });

    // 2. Tự động lưu vào localStorage mỗi khi formData thay đổi
    useEffect(() => {
        localStorage.setItem('partnerOnboardingData', JSON.stringify(formData));
    }, [formData]);

    const updateFormData = (newData) => {
        setFormData(prevData => ({ ...prevData, ...newData }));
    };

    // 3. Hàm này cực kỳ quan trọng: GỌI HÀM NÀY SAU KHI NỘP ĐƠN THÀNH CÔNG (Ở BƯỚC CUỐI)
    // Để dọn dẹp rác trong bộ nhớ trình duyệt
    const clearFormData = () => {
        setFormData(initialFormData);
        localStorage.removeItem('partnerOnboardingData');
    };

    const value = {
        formData,
        updateFormData,
        setFormData,
        clearFormData 
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
};
