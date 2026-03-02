// src/components/HelpCenter/FAQAccordion.jsx
import React from 'react';
import FAQItem from './FAQItem';
import { useTranslation } from 'react-i18next';

const FAQAccordion = ({ faqs }) => {
    const { t } = useTranslation();

    if (faqs.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                {t('hotels.no_results', 'No results found matching your criteria.')}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {t('support.faq', 'Frequently Asked Questions')}
            </h2>
            {faqs.map((item) => (
                <FAQItem key={item.id} item={item} />
            ))}
        </div>
    );
};

export default FAQAccordion;
