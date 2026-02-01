// src/components/HelpCenter/FAQAccordion.jsx
import React from 'react';
import FAQItem from './FAQItem';

const FAQAccordion = ({ faqs }) => {
    if (faqs.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                Không tìm thấy câu hỏi nào phù hợp với từ khóa của bạn.
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Câu hỏi thường gặp</h2>
            {faqs.map((item) => (
                <FAQItem key={item.id} item={item} />
            ))}
        </div>
    );
};

export default FAQAccordion;