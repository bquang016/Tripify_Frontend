import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`border rounded-xl bg-white overflow-hidden transition-all duration-300 ${isOpen ? 'border-teal-500 shadow-md' : 'border-gray-200 hover:shadow-sm'}`}>
            <button
                className="w-full flex justify-between items-center p-5 text-left bg-white focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
        <span className={`font-semibold text-lg ${isOpen ? 'text-teal-700' : 'text-gray-800'}`}>
          {item.question}
        </span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-teal-600" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
            </button>

            <div
                className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/50">
                    {item.answer}
                </div>
            </div>
        </div>
    );
};

export default FAQItem;