// src/components/common/Select/CustomSelect.jsx
import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

/**
 * Custom Select Component
 * NOTE: Mặc định trả về option.value (code) trong onChange.
 */
const CustomSelect = ({
  label,
  value,
  onChange, // <-- Đây là hàm sẽ nhận option.value (code)
  options,
  placeholder = "Chọn...",
  icon,
  errors,
  disabled
}) => {

  const selectedOption = options.find(option => option.value === value);

  const paddingClasses = icon ? "pl-12 pr-10" : "pl-3 pr-10";

  const buttonClasses = [
    "relative w-full cursor-pointer rounded-lg bg-white py-2.5 text-left",
    "border border-gray-300 shadow-sm",
    "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
    "sm:text-sm font-normal",
    paddingClasses,
    disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "" // Thêm disabled style
  ].join(" ");

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">

          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-20 pointer-events-none">
              {React.cloneElement(icon, {
                className: "text-gray-400",
                size: 18,
              })}
            </div>
          )}

          {/* BUTTON */}
          <Listbox.Button className={buttonClasses}>
            <span className="block truncate font-normal">
              {selectedOption
                ? selectedOption.label
                : <span className="text-gray-400 font-normal">{placeholder}</span>
              }
            </span>

            {/* ICON DROPDOWN */}
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none z-20">
              <ChevronDown size={18} className="text-gray-400" />
            </span>
          </Listbox.Button>

          {/* OPTIONS */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 
                         text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              {options.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 
                    ${active ? "bg-blue-50 text-blue-900" : "text-gray-900"}`
                  }
                  value={option.value} // <-- Trả về Code
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                        {option.label}
                      </span>

                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <Check size={18} aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>

        </div>
      </Listbox>
    </div>
  );
};

export default CustomSelect;