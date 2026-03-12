// src/pages/Customer/Profile/LanguageSettings.jsx (ĐÃ FIX LỖI IMPORT)

import React from 'react';
// ✅ SỬ DỤNG ALIAS CHO CÁC COMPONENTS CHUNG
import Card from "@/components/common/Card/Card";
import Select from "@/components/common/Select/Select";
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const LANGUAGE_OPTIONS = [
    { label: "Tiếng Việt (Vietnamese)", value: "vi" },
    { label: "Tiếng Anh (English)", value: "en" },
];

export default function LanguageSettings() {
    const { language, changeLanguage } = useLanguage();

    return (
        <Card>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Globe size={20} className="text-[rgb(40,169,224)]" />
                    <h3 className="font-semibold text-lg">Ngôn ngữ giao diện</h3>
                </div>

                <div className="w-60">
                    <Select
                        value={language}
                        onChange={changeLanguage}
                        options={LANGUAGE_OPTIONS}
                    />
                </div>
            </div>
        </Card>
    );
}