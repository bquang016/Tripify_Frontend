// src/pages/Customer/About/HelpPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// COMPONENTS
import HelpHeader from '@/components/HelpCenter/HelpHeader';
import HelpCategories from '@/components/HelpCenter/HelpCategories';
import FAQAccordion from '@/components/HelpCenter/FAQAccordion';
import ContactSupport from '@/components/HelpCenter/ContactSupport';

// DATA
import { getHelpData } from '@/data/helpData';

const HelpPage = () => {
    const { t, i18n } = useTranslation();
    const { faqs } = useMemo(() => getHelpData(t), [t, i18n.language]);

    // 1. State quản lý
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [visibleCount, setVisibleCount] = useState(5);

    // 2. Setup Title & Scroll
    useEffect(() => {
        document.title = i18n.language === 'vi' ? "Trung tâm trợ giúp | Tripify" : "Help Center | Tripify";
        window.scrollTo(0, 0);
    }, [i18n.language]);

    // 3. Logic lọc câu hỏi
    const filteredFAQs = useMemo(() => {
        return faqs.filter((item) => {
            const term = searchTerm.toLowerCase().trim();
            if (!term && activeCategory === 'all') return true;

            const matchesSearch =
                item.question.toLowerCase().includes(term) ||
                item.answer.toLowerCase().includes(term);

            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeCategory, faqs]);

    const displayedFAQs = filteredFAQs.slice(0, visibleCount);

    useEffect(() => {
        setVisibleCount(5);
    }, [activeCategory, searchTerm]);

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 5);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <HelpHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="mb-12">
                <HelpCategories
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />
            </div>

            <div className="container mx-auto px-4 pb-20 flex-grow max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {activeCategory === 'all' 
                            ? (i18n.language === 'vi' ? 'Câu hỏi thường gặp' : 'Frequently Asked Questions') 
                            : (i18n.language === 'vi' ? 'Danh sách câu hỏi' : 'Question List')}
                    </h2>
                    <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                        {i18n.language === 'vi' ? `Hiển thị ${displayedFAQs.length} / ${filteredFAQs.length} kết quả` : `Showing ${displayedFAQs.length} / ${filteredFAQs.length} results`}
                    </span>
                </div>

                <FAQAccordion faqs={displayedFAQs} />

                {visibleCount < filteredFAQs.length && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleShowMore}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-full shadow-sm hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {i18n.language === 'vi' ? 'Xem thêm câu hỏi cũ hơn' : 'Show more older questions'}
                        </button>
                    </div>
                )}

                {filteredFAQs.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">{t('hotels.no_results')}</p>
                        <button
                            onClick={() => {setSearchTerm(''); setActiveCategory('all');}}
                            className="mt-2 text-teal-600 font-medium hover:underline"
                        >
                            {i18n.language === 'vi' ? 'Xóa bộ lọc' : 'Clear filters'}
                        </button>
                    </div>
                )}
            </div>

            <ContactSupport />
        </div>
    );
};

export default HelpPage;
