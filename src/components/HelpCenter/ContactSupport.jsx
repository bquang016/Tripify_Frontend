// src/components/HelpCenter/ContactSupport.jsx
import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContactSupport = () => {
    const { i18n } = useTranslation();
    return (
        <div className="bg-slate-50 py-16 px-4 border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {i18n.language === 'vi' ? 'Vẫn cần trợ giúp?' : 'Still need help?'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {i18n.language === 'vi' ? 'Đội ngũ Tripify luôn sẵn sàng hỗ trợ bạn' : 'Tripify team is always ready to support you'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-all group">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-600 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Mail className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">
                            {i18n.language === 'vi' ? 'Gửi Email' : 'Send Email'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                            {i18n.language === 'vi' ? 'Phản hồi trong vòng 24h' : 'Reply within 24h'}
                        </p>
                        <a href="mailto:support@tripify.com" className="text-blue-600 font-medium hover:underline text-lg">
                            support@tripify.com
                        </a>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-all group">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 text-orange-600 rounded-full mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <Phone className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">
                            {i18n.language === 'vi' ? 'Hotline 24/7' : 'Hotline 24/7'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                            {i18n.language === 'vi' ? 'Hỗ trợ khẩn cấp' : 'Emergency support'}
                        </p>
                        <a href="tel:19001234" className="text-orange-600 font-bold text-2xl hover:underline">
                            1900 1234
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSupport;
