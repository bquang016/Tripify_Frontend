import React, { createContext, useState, useContext } from 'react';

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
    const [formData, setFormData] = useState(initialFormData);

    const updateFormData = (newData) => {
        setFormData(prevData => ({ ...prevData, ...newData }));
    };

    const value = {
        formData,
        updateFormData,
        setFormData, // Allow full replacement if needed
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
};
