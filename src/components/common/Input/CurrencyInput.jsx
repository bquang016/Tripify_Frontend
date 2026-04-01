
import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

const formatNumber = (num) => {
    if (num === null || num === undefined) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const unformatNumber = (str) => {
    if (!str) return null;
    const num = parseInt(str.replace(/\./g, ''), 10);
    return isNaN(num) ? null : num;
};

const CurrencyInput = React.forwardRef(
    ({ value, onChange, onBlur, name, label, placeholder, error, icon, ...rest }, ref) => {
        const [displayValue, setDisplayValue] = useState(formatNumber(value));

        useEffect(() => {
            setDisplayValue(formatNumber(value));
        }, [value]);

        const handleChange = (e) => {
            const rawValue = e.target.value;
            const numericValue = unformatNumber(rawValue);
            
            setDisplayValue(formatNumber(numericValue));
            
            if (onChange) {
                onChange(numericValue);
            }
        };

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        id={name}
                        name={name}
                        ref={ref}
                        type="text" // Use text type to allow for formatting characters
                        inputMode="decimal" // Hint for mobile keyboards
                        value={displayValue}
                        onChange={handleChange}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        className={`w-full p-3 pl-4 pr-10 border rounded-xl bg-white shadow-sm transition-all 
                            ${error 
                                ? 'border-red-500 ring-red-500' 
                                : 'border-gray-300 focus:border-[rgb(40,169,224)] focus:ring-2 focus:ring-[rgb(40,169,224)]/50'
                            }
                        `}
                        {...rest}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
                {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
            </div>
        );
    }
);

CurrencyInput.displayName = 'CurrencyInput';
export default CurrencyInput;
