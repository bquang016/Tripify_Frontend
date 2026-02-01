import React from 'react';
import { categories } from '@/data/helpData'; // Đảm bảo đúng đường dẫn data

const HelpCategories = ({ activeCategory, setActiveCategory }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-10 px-4 max-w-7xl mx-auto relative z-20">
            {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;

                return (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(isActive ? 'all' : cat.id)}
                        className={`flex flex-col items-center p-6 rounded-2xl shadow-lg transition-all duration-300 border 
              ${isActive
                            ? 'bg-teal-600 text-white border-teal-600 transform -translate-y-2' // Màu nền khi Active
                            : 'bg-white text-gray-700 border-gray-100 hover:shadow-xl hover:-translate-y-1'
                        }`}
                    >
                        {/* Đổi màu nền icon */}
                        <div className={`p-3 rounded-full mb-4 ${isActive ? 'bg-white/20' : 'bg-teal-50'}`}>
                            <Icon className={`h-8 w-8 ${isActive ? 'text-white' : 'text-teal-600'}`} />
                        </div>
                        <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                        <p className={`text-sm text-center ${isActive ? 'text-teal-100' : 'text-gray-500'}`}>
                            {cat.desc}
                        </p>
                    </button>
                );
            })}
        </div>
    );
};

export default HelpCategories;