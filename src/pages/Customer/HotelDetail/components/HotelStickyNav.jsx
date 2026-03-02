import React from 'react';
import { useTranslation } from 'react-i18next';

const HotelStickyNav = ({ activeSection, onSectionChange }) => {
    const { t } = useTranslation();
    
    const sections = [
        { id: 'overview', label: t('hotel_detail.overview') },
        { id: 'rooms', label: t('hotel_detail.rooms') },
        { id: 'policies', label: t('hotel_detail.policies') },
        { id: 'reviews', label: t('hotel_detail.reviews') },
    ];

    return (
        <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <nav className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => onSectionChange(section.id)}
                            className={`py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap
                                ${activeSection === section.id 
                                    ? 'border-blue-600 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {section.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default HotelStickyNav;
