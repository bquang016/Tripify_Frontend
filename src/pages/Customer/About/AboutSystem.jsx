import React from "react";
import { useTranslation } from "react-i18next";

const AboutSystem = () => {
    const { t, i18n } = useTranslation();
    
    return (
        <section className="py-16 px-6 bg-white text-center">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-blue-700">
                    {i18n.language === 'vi' ? 'Giới thiệu hệ thống' : 'System Introduction'}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                    {t('about.description')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="p-6 shadow-md rounded-2xl hover:shadow-xl transition">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/825/825529.png"
                            alt="Smart booking"
                            className="w-16 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-medium mb-2">{t('about.smart_booking')}</h3>
                        <p className="text-gray-600">
                            {t('about.smart_booking_desc')}
                        </p>
                    </div>

                    <div className="p-6 shadow-md rounded-2xl hover:shadow-xl transition">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/2950/2950653.png"
                            alt="Secure payment"
                            className="w-16 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-medium mb-2">{t('about.secure_payment')}</h3>
                        <p className="text-gray-600">
                            {t('about.secure_payment_desc')}
                        </p>
                    </div>

                    <div className="p-6 shadow-md rounded-2xl hover:shadow-xl transition">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
                            alt="24/7 support"
                            className="w-16 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-medium mb-2">{t('about.support_247_title')}</h3>
                        <p className="text-gray-600">
                            {t('about.support_247_desc')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSystem;
