import React, { useState } from 'react';
import { format, differenceInCalendarDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DateRange } from 'react-date-range';
import { Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';

// CSS cho lịch
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';

const BookingDateSelector = ({ dateRange, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const nights = differenceInCalendarDays(dateRange.endDate, dateRange.startDate);

    const handleSelect = (ranges) => {
        onChange({
            startDate: ranges.selection.startDate,
            endDate: ranges.selection.endDate
        });
    };

    return (
        <Card className="p-5 border border-slate-200 shadow-sm overflow-visible">
            <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-1">Thời gian lưu trú</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <span className="font-semibold text-lg">{format(dateRange.startDate, "dd/MM/yyyy")}</span>
                            <span className="text-slate-400">→</span>
                            <span className="font-semibold text-lg">{format(dateRange.endDate, "dd/MM/yyyy")}</span>
                            <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-blue-200">
                                {nights} đêm
                            </span>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:bg-slate-100 rounded-full w-10 h-10 p-0 flex items-center justify-center">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
            </div>

            {/* Calendar Dropdown */}
            {isOpen && (
                <div className="mt-5 pt-5 border-t border-slate-100 flex justify-center animate-in fade-in slide-in-from-top-2">
                    <DateRange
                        ranges={[{ ...dateRange, key: 'selection' }]}
                        onChange={handleSelect}
                        minDate={new Date()}
                        rangeColors={['#28A9E0']}
                        locale={vi}
                        dateDisplayFormat="dd/MM/yyyy"
                    />
                </div>
            )}
        </Card>
    );
};

export default BookingDateSelector;