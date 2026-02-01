import React from "react";

const CheckboxOption = ({ label, count, checked, onChange }) => (
    <label className="flex items-center justify-between py-1 text-sm text-gray-600 hover:text-gray-900 cursor-pointer group select-none transition-all">
        <span className="flex items-center">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 rounded border-gray-300 text-[rgb(40,169,224)] focus:ring-[rgb(40,169,224)] cursor-pointer transition-transform group-hover:scale-105"
            />
            <span className={`ml-2.5 transition-colors ${checked ? 'font-medium text-[rgb(40,169,224)]' : 'group-hover:text-[rgb(40,169,224)]'}`}>
                {label}
            </span>
        </span>
        {count !== undefined && (
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{count}</span>
        )}
    </label>
);

export default CheckboxOption;