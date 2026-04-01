import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HelpHeader = ({ searchTerm, setSearchTerm }) => {
    const { t, i18n } = useTranslation();
    
    return (
        <div className="relative bg-gradient-to-r from-teal-600 to-cyan-700 py-20 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                    {i18n.language === 'vi' ? 'Chào bạn, Tripify có thể giúp gì?' : 'Hi, how can Tripify help?'}
                </h1>
                <p className="text-teal-50 text-lg mb-8">
                    {t('support.subtitle')}
                </p>

                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 bg-white rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-teal-500/30 shadow-xl transition-all duration-300"
                        placeholder={i18n.language === 'vi' ? 'Ví dụ: Đổi lịch, hoàn tiền, đặt phòng...' : 'e.g. Change dates, refunds, bookings...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default HelpHeader;
