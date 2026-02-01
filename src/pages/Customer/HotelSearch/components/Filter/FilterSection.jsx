import React from "react";

const FilterSection = ({ title, children, icon: Icon }) => (
    <div className="py-5 border-b border-gray-100 last:border-b-0">
        <div className="flex items-center gap-2 mb-3">
            {Icon && <Icon size={16} className="text-[rgb(40,169,224)]" />}
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h3>
        </div>
        <div className="flex flex-col gap-2">{children}</div>
    </div>
);

export default FilterSection;