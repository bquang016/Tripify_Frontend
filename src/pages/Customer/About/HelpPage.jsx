// src/pages/Customer/About/HelpPage.jsx
import React, { useState, useMemo, useEffect } from 'react';

// COMPONENTS
import HelpHeader from '@/components/HelpCenter/HelpHeader';
import HelpCategories from '@/components/HelpCenter/HelpCategories';
import FAQAccordion from '@/components/HelpCenter/FAQAccordion';
import ContactSupport from '@/components/HelpCenter/ContactSupport';

// DATA
import { faqs } from '@/data/helpData';

const HelpPage = () => {
    // 1. State quản lý
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [visibleCount, setVisibleCount] = useState(5); // Mặc định chỉ hiện 5 câu

    // 2. Setup Title & Scroll
    useEffect(() => {
        document.title = "Trung tâm trợ giúp | TravelMate";
        window.scrollTo(0, 0);
    }, []);

    // 3. Logic lọc câu hỏi (Search + Category)
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
    }, [searchTerm, activeCategory]);

    // 4. Logic hiển thị giới hạn
    const displayedFAQs = filteredFAQs.slice(0, visibleCount);

    // 5. Tự động reset về 5 câu khi người dùng đổi danh mục hoặc tìm kiếm
    useEffect(() => {
        setVisibleCount(5);
    }, [activeCategory, searchTerm]);

    // Hàm xử lý nút xem thêm
    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 5);
    };

    return (
        // UPDATE: Đổi bg-gray-50 -> bg-slate-50 cho màu nền sáng đẹp hơn
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            {/* --- Phần 1: Header --- */}
            <HelpHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {/* --- Phần 2: Danh mục --- */}
            <div className="mb-12">
                <HelpCategories
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />
            </div>

            {/* --- Phần 3: Nội dung chính --- */}
            <div className="container mx-auto px-4 pb-20 flex-grow max-w-4xl">
                {/* Tiêu đề & Đếm số lượng */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {activeCategory === 'all' ? 'Câu hỏi thường gặp' : 'Danh sách câu hỏi'}
                    </h2>
                    <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                        Hiển thị {displayedFAQs.length} / {filteredFAQs.length} kết quả
                    </span>
                </div>

                {/* Danh sách câu hỏi */}
                <FAQAccordion faqs={displayedFAQs} />

                {/* --- Nút Xem Thêm (Chỉ hiện khi còn câu hỏi ẩn) --- */}
                {visibleCount < filteredFAQs.length && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleShowMore}
                            // UPDATE: Đổi hover màu Blue -> Teal
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-full shadow-sm hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Xem thêm câu hỏi cũ hơn
                        </button>
                    </div>
                )}

                {/* Thông báo nếu không tìm thấy gì */}
                {filteredFAQs.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">Không tìm thấy kết quả nào phù hợp.</p>
                        <button
                            onClick={() => {setSearchTerm(''); setActiveCategory('all');}}
                            // UPDATE: Đổi màu Blue -> Teal
                            className="mt-2 text-teal-600 font-medium hover:underline"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </div>

            {/* --- Phần 4: Footer liên hệ --- */}
            <ContactSupport />
        </div>
    );
};

export default HelpPage;