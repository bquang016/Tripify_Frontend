// src/pages/Customer/Profile/NotificationSettings.jsx (ĐÃ FIX LỖI IMPORT)

import React from 'react';
// ✅ SỬ DỤNG ALIAS CHO CÁC COMPONENTS CHUNG
import Card from "@/components/common/Card/Card";
import { Bell } from 'lucide-react';

export default function NotificationSettings({ value, onChange }) {
    return (
        <Card>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Bell size={20} className="text-[rgb(40,169,224)]" />
                    <div>
                        <h3 className="font-semibold text-lg">Thông báo qua Email</h3>
                        <p className="text-gray-600 text-sm">
                            Bật hoặc tắt việc nhận thông báo giao dịch và ưu đãi qua email.
                        </p>
                    </div>
                </div>
                {/* Switch Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only"
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${value ? "bg-[rgb(40,169,224)]" : "bg-gray-200"}`}></div>
                    <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transform transition-transform ${value ? "translate-x-5" : "translate-x-0"}`}></div>
                </label>
            </div>
        </Card>
    );
}