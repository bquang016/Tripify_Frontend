import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
    X, Tag, Percent, Banknote,
    Layers, Hash, CheckCircle2, AlertCircle, Clock, Calendar, Upload, Image as ImageIcon,
    Crown
} from "lucide-react";
import { format } from "date-fns";
import promotionService from "../../../../services/promotion.service";
import toast from "react-hot-toast";
import Toast from "@/components/common/Notification/Toast";
import CustomSelect from "@/components/common/Select/CustomSelect";
import DatePickerInput from "@/components/common/Input/DatePickerInput";

const BE_BASE_URL = "http://127.0.0.1:8386";
const UPLOAD_DIR = "/uploads/";
const MIN_VND = 1000;

const showToast = (type, message) => {
    toast.custom((t) => (
        <Toast type={type} message={message} onClose={() => toast.dismiss(t.id)} />
    ), { duration: 3000, position: 'bottom-center' });
};

const formatCurrency = (value) => {
    if (!value) return "";
    const number = value.toString().replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseCurrency = (value) => {
    return value.replace(/\./g, "").replace(/\D/g, "");
};

// [NEW] Helper xử lý ngày giờ địa phương
const parseDateLocal = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d);
};

const CustomInput = ({ label, name, value, onChange, type = "text", placeholder, icon: Icon, error, disabled, className, ...props }) => {
    const inputRef = useRef(null);
    const isDateInput = type === 'date';

    const handleIconClick = () => {
        if (isDateInput && inputRef.current) {
            if (inputRef.current.showPicker) inputRef.current.showPicker();
            else inputRef.current.focus();
        }
    };

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && <label className="text-sm font-semibold text-gray-700 ml-1">{label} {error && <span className="text-red-500">*</span>}</label>}
            <div className="relative group">
                {Icon && (
                    <div onClick={handleIconClick} className={`absolute left-2 top-1/2 -translate-y-1/2 transition-all duration-200 z-10 pl-2 rounded-lg p-1.5 ${isDateInput ? 'cursor-pointer pointer-events-auto text-[rgb(40,169,224)] hover:bg-blue-50' : 'pointer-events-none text-gray-400 group-focus-within:text-blue-500'}`}>
                        <Icon size={18} strokeWidth={isDateInput ? 2.5 : 2} />
                    </div>
                )}
                <input ref={inputRef} type={type} name={name} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} {...props}
                       className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 h-[42px] bg-gray-50 border rounded-xl outline-none transition-all duration-200 ${error ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50' : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white'} ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''} placeholder-gray-400 selection:bg-blue-100 [&::-webkit-calendar-picker-indicator]:hidden`} />
            </div>
            {error && typeof error === 'string' && <p className="text-xs text-red-500 flex items-center gap-1 ml-1"><AlertCircle size={12}/> {error}</p>}
        </div>
    );
};

const TimePicker = ({ value, onChange, error }) => {
    const [hour, setHour] = useState("00");
    const [minute, setMinute] = useState("00");
    useEffect(() => {
        if (value && value.includes(':')) {
            const [h, m] = value.split(':');
            setHour(h); setMinute(m);
        }
    }, [value]);
    const handleChangeInput = (e, type) => {
        const val = e.target.value;
        if (!/^\d{0,2}$/.test(val)) return;
        if (type === 'hour') setHour(val); else setMinute(val);
    };
    const handleBlur = (type) => {
        let val = type === 'hour' ? hour : minute;
        if (!val) val = "00"; if (val.length === 1) val = "0" + val;
        const num = parseInt(val, 10);
        if (type === 'hour') { if (num > 23) val = "23"; } else { if (num > 59) val = "59"; }
        if (type === 'hour') { setHour(val); onChange(`${val}:${minute}`); } else { setMinute(val); onChange(`${hour}:${val}`); }
    };
    return (
        <div className={`flex items-center border rounded-xl bg-gray-50 px-3 py-2.5 transition-all duration-200 h-[42px] ${error ? 'border-red-300 ring-4 ring-red-100 bg-red-50' : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:bg-white'}`}>
            <div className="text-gray-400 mr-2"><Clock size={18} strokeWidth={2} /></div>
            <input type="text" value={hour} onChange={(e) => handleChangeInput(e, 'hour')} onBlur={() => handleBlur('hour')} onFocus={(e)=>e.target.select()} placeholder="HH" className="bg-transparent outline-none text-gray-700 font-semibold w-8 text-center placeholder-gray-300 focus:text-blue-600 selection:bg-blue-200" />
            <span className="text-gray-400 font-bold mx-1">:</span>
            <input type="text" value={minute} onChange={(e) => handleChangeInput(e, 'minute')} onBlur={() => handleBlur('minute')} onFocus={(e)=>e.target.select()} placeholder="MM" className="bg-transparent outline-none text-gray-700 font-semibold w-8 text-center placeholder-gray-300 focus:text-blue-600 selection:bg-blue-200" />
        </div>
    );
};


const PromotionFormModal = ({ open, onClose, onSuccess, initialData }) => {
    const [promotionTypeOption, setPromotionTypeOption] = useState("FIXED_AMOUNT");
    const [formData, setFormData] = useState({
        code: "", name: "", value: "", quantity: "", minOrder: "", maxDiscount: "",
        startDate: "", endDate: "", isActive: true, minMembershipRank: "BRONZE"
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [bannerFile, setBannerFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const getFullImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${BE_BASE_URL}${UPLOAD_DIR}${cleanPath}`;
    };

    const normalizeDateTime = (dateInput) => {
        if (!dateInput) return "";
        if (Array.isArray(dateInput)) {
            const [y, m, d, h=0, min=0] = dateInput;
            return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        }
        if (typeof dateInput === 'string' && dateInput.includes('T')) return dateInput.substring(0, 16);
        return "";
    };

    useEffect(() => {
        if (open) {
            setErrors({});
            setBannerFile(null);
            if (initialData) {
                const { target, ...rest } = initialData;
                let uiType = "FIXED_AMOUNT";
                if (rest.type === "PERCENTAGE" || rest.type === "PERCENT") {
                    if (rest.maxDiscount && rest.maxDiscount > 0) {
                        uiType = "PERCENTAGE_CAPPED";
                    } else {
                        uiType = "PERCENTAGE_UNLIMITED";
                    }
                }
                setPromotionTypeOption(uiType);
                setFormData({
                    ...rest,
                    value: rest.value,
                    maxDiscount: (uiType === "PERCENTAGE_CAPPED") ? rest.maxDiscount : "",
                    startDate: normalizeDateTime(rest.startDate),
                    endDate: normalizeDateTime(rest.endDate),
                    isActive: rest.isActive !== undefined ? rest.isActive : true,
                    minMembershipRank: rest.minMembershipRank || "BRONZE"
                });
                setPreviewUrl(getFullImageUrl(rest.bannerUrl));
            } else {
                setPromotionTypeOption("FIXED_AMOUNT");
                setFormData({
                    code: "", name: "", value: "", quantity: 100, minOrder: 0, maxDiscount: "",
                    startDate: "", endDate: "", isActive: true,
                    minMembershipRank: "BRONZE"
                });
                setPreviewUrl(null);
            }
        }
    }, [open, initialData]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { showToast("error", "Ảnh quá lớn (Max 5MB)"); return; }
            setBannerFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    const handleImageError = () => { if (previewUrl) { setPreviewUrl(null); } };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleCurrencyChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: parseCurrency(value) }));
        if (name === "maxDiscount" && errors.maxDiscount) {
            setErrors(prev => ({ ...prev, maxDiscount: null }));
        }
    };

    const handleTypeChange = (newValue) => {
        setPromotionTypeOption(newValue);
        if (newValue !== "PERCENTAGE_CAPPED") {
            setFormData(prev => ({ ...prev, maxDiscount: "" }));
            if (errors.maxDiscount) setErrors(prev => ({ ...prev, maxDiscount: null }));
        }
        if (errors.value) setErrors(prev => ({ ...prev, value: null }));
    };

    const handleSplitDateTimeChange = (field, type, value) => {
        setFormData(prev => {
            const currentFull = prev[field] || "";
            const [currentDate, currentTime] = currentFull.includes('T') ? currentFull.split('T') : ["", "00:00"];
            let newDate = currentDate, newTime = currentTime || "00:00";
            if (type === 'date') newDate = value; else newTime = value;
            if (newDate) return { ...prev, [field]: `${newDate}T${newTime}` };
            return prev;
        });
    };

    const getSplitValue = (str, type) => {
        if (!str) return "";
        const parts = str.split('T');
        return type === 'date' ? parts[0] : (parts[1] || "00:00");
    };

    const validateYear = (dateTimeStr) => {
        if (!dateTimeStr) return false;
        const datePart = dateTimeStr.split('T')[0];
        if (!datePart) return false;
        const yearStr = datePart.split('-')[0];
        const year = parseInt(yearStr);
        return yearStr.length === 4 && year >= 1900 && year <= 9999;
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.code.trim()) newErrors.code = "Mã không được để trống";
        if (!formData.name.trim()) newErrors.name = "Tên chương trình là bắt buộc";

        if (!formData.value) newErrors.value = "Nhập mức giảm";
        else {
            const val = Number(formData.value);
            if (promotionTypeOption === "FIXED_AMOUNT") {
                if (val < MIN_VND) newErrors.value = `Giảm tối thiểu ${formatCurrency(MIN_VND)}đ`;
            } else {
                if (val <= 0) newErrors.value = "Phần trăm phải > 0";
                if (val > 100) newErrors.value = "Không được quá 100%";
            }
        }

        if (formData.minOrder === "" || formData.minOrder === null) newErrors.minOrder = "Nhập giá trị đơn tối thiểu";
        else {
            const minOrd = Number(formData.minOrder);
            if (minOrd < 0) newErrors.minOrder = "Không được âm";
            else if (minOrd > 0 && minOrd < MIN_VND) newErrors.minOrder = `Phải từ ${formatCurrency(MIN_VND)}đ trở lên`;
        }

        if (promotionTypeOption === 'PERCENTAGE_CAPPED') {
            if (!formData.maxDiscount || Number(formData.maxDiscount) <= 0) {
                newErrors.maxDiscount = "Bắt buộc nhập mức giảm tối đa";
            } else {
                const maxDisc = Number(formData.maxDiscount);
                if (maxDisc < MIN_VND) newErrors.maxDiscount = `Phải từ ${formatCurrency(MIN_VND)}đ trở lên`;
            }
        }

        if (formData.quantity && Number(formData.quantity) <= 0) newErrors.quantity = "Số lượng phải lớn hơn 0";

        if (!formData.startDate) { newErrors.startDate = "Chọn ngày giờ bắt đầu"; }
        else if (!formData.startDate.includes('T')) { newErrors.startDate = "Thiếu thông tin giờ"; }
        else if (!validateYear(formData.startDate)) { newErrors.startDate = "Năm không hợp lệ"; }

        if (!formData.endDate) { newErrors.endDate = "Chọn ngày giờ kết thúc"; }
        else if (!formData.endDate.includes('T')) { newErrors.endDate = "Thiếu thông tin giờ"; }
        else if (!validateYear(formData.endDate)) { newErrors.endDate = "Năm không hợp lệ"; }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const today = new Date(); today.setHours(0, 0, 0, 0);

            if (!initialData && start < today) { showToast("error", "Ngày bắt đầu không được chọn trong quá khứ."); return; }
            if (end <= start) { showToast("error", "Thời gian kết thúc phải lớn hơn thời gian bắt đầu."); return; }

            setIsLoading(true);
            try {
                const submitData = { ...formData };
                if (promotionTypeOption === "FIXED_AMOUNT") { submitData.type = "FIXED_AMOUNT"; submitData.maxDiscount = 0; }
                else if (promotionTypeOption === "PERCENTAGE_UNLIMITED") { submitData.type = "PERCENTAGE"; submitData.maxDiscount = 0; }
                else if (promotionTypeOption === "PERCENTAGE_CAPPED") { submitData.type = "PERCENTAGE"; }

                let promotionId;
                if (initialData) {
                    promotionId = initialData.promotionId;
                    await promotionService.updatePromotion(promotionId, submitData);
                } else {
                    const res = await promotionService.createPromotion(submitData);
                    promotionId = res.data?.data?.promotionId || res.data?.promotionId;
                }
                if (bannerFile && promotionId) await promotionService.uploadBanner(promotionId, bannerFile);
                showToast("success", initialData ? "Cập nhật thành công!" : "Tạo khuyến mãi thành công!");
                if (onSuccess) onSuccess();
                onClose();
            } catch (error) {
                console.error(error);
                showToast("error", error.response?.data?.message || "Có lỗi xảy ra!");
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (!open) return null;
    const isPercentage = promotionTypeOption.startsWith("PERCENT");
    const isMaxDiscountDisabled = promotionTypeOption !== "PERCENTAGE_CAPPED";

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all scale-100 overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[rgb(40,169,224)] to-[rgb(26,140,189)] text-white">
                    <div><h3 className="text-xl font-bold flex items-center gap-2">{initialData ? <CheckCircle2 size={22}/> : <Tag size={22}/>} {initialData ? "Cập nhật Khuyến mãi" : "Tạo Khuyến mãi Mới"}</h3><p className="text-blue-100 text-xs mt-1 opacity-90">Điền đầy đủ thông tin để kích hoạt mã giảm giá.</p></div>
                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Banner Khuyến Mãi</label>
                        <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50/50 transition-colors relative overflow-hidden group">
                            {previewUrl ? <img src={previewUrl} alt="Banner" className="w-full h-full object-contain z-10" onError={handleImageError} /> : <div className="flex flex-col items-center text-gray-400"><ImageIcon size={40} className="mb-2 opacity-50" /><span className="text-sm font-medium">Nhấn để tải ảnh lên</span><span className="text-xs opacity-70">(JPG, PNG - Max 5MB)</span></div>}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                            {previewUrl && <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"><p className="text-white font-semibold flex items-center gap-2"><Upload size={18}/> Thay đổi ảnh</p></div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
                        <div className="sm:col-span-1"><CustomInput label="Mã Code" name="code" value={formData.code} onChange={handleChange} placeholder="VD: SALE50" icon={Tag} error={errors.code} /></div>
                        <div className="sm:col-span-2"><CustomInput label="Tên chương trình" name="name" value={formData.name} onChange={handleChange} placeholder="VD: Siêu sale tháng 11" icon={CheckCircle2} error={errors.name} /></div>
                    </div>

                    <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-5">
                        <CustomSelect label="Đối tượng áp dụng (Hạng thành viên tối thiểu)" name="minMembershipRank" value={formData.minMembershipRank} onChange={(val) => setFormData(prev => ({ ...prev, minMembershipRank: val }))} icon={<Crown />}
                                      options={[{ value: "BRONZE", label: "Đồng (Tất cả thành viên)" }, { value: "SILVER", label: "Bạc (Silver - Chi tiêu > 1 triệu đồng)" }, { value: "GOLD", label: "Vàng (Gold - Chi tiêu > 5 triệu đồng)" }, { value: "DIAMOND", label: "Kim Cương (Diamond - Chi tiêu > 10 triệu đồng)" }]}
                        />
                        <p className="text-xs text-gray-500 mt-2 ml-1 italic">* Khuyến mãi này sẽ áp dụng cho các thành viên có hạng này trở lên.</p>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                        <CustomSelect label="Loại giảm giá" name="type" value={promotionTypeOption} onChange={(val) => handleTypeChange(val)} icon={<Layers />}
                                      options={[
                                          { value: "FIXED_AMOUNT", label: "Giảm tiền trực tiếp" },
                                          { value: "PERCENTAGE_UNLIMITED", label: "Giảm giá theo % (Không giới hạn)" },
                                          { value: "PERCENTAGE_CAPPED", label: "Giảm giá theo % (Có giới hạn)" }
                                      ]}
                        />
                        <CustomInput label={isPercentage ? "Mức giảm (%)" : "Số tiền giảm (VNĐ)"} name="value" type={isPercentage ? "number" : "text"} value={isPercentage ? formData.value : formatCurrency(formData.value)} onChange={isPercentage ? handleChange : handleCurrencyChange} placeholder={isPercentage ? "VD: 20" : "VD: 50.000"} icon={isPercentage ? Percent : Banknote} error={errors.value} min="0" onFocus={(e) => e.target.select()} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
                        <CustomInput label="Đơn tối thiểu (VNĐ)" name="minOrder" type="text" value={formatCurrency(formData.minOrder)} onChange={handleCurrencyChange} icon={Banknote} error={errors.minOrder} placeholder="0 (Không giới hạn)" />
                        <CustomInput label="Giảm tối đa (VNĐ)" name="maxDiscount" type="text" value={formatCurrency(formData.maxDiscount)} onChange={handleCurrencyChange} icon={Banknote} placeholder={isMaxDiscountDisabled ? "Không áp dụng" : "VD: 200.000"} onFocus={(e) => e.target.select()} error={errors.maxDiscount} disabled={isMaxDiscountDisabled} />
                        <CustomInput label="Tổng số lượng" name="quantity" type="number" value={formData.quantity} onChange={handleChange} icon={Hash} error={errors.quantity} placeholder="1000" min="1" onFocus={(e) => e.target.select()} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Thời gian bắt đầu {errors.startDate && <span className="text-red-500">*</span>}</label>
                            <div className="flex gap-2 items-start">
                                {/* [FIX] DatePickerInput + minDate */}
                                <div className="w-3/5">
                                    <DatePickerInput
                                        value={parseDateLocal(getSplitValue(formData.startDate, 'date'))}
                                        onChange={(date) => handleSplitDateTimeChange('startDate', 'date', format(date, 'yyyy-MM-dd'))}
                                        minDate={new Date()} // Chặn quá khứ
                                    />
                                </div>
                                <div className="w-2/5"><TimePicker value={getSplitValue(formData.startDate, 'time')} onChange={(newTime) => handleSplitDateTimeChange('startDate', 'time', newTime)} error={!!errors.startDate} /></div>
                            </div>
                            {errors.startDate && <p className="text-xs text-red-500 flex items-center gap-1 ml-1 mt-1"><AlertCircle size={12}/> {errors.startDate}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Thời gian kết thúc {errors.endDate && <span className="text-red-500">*</span>}</label>
                            <div className="flex gap-2 items-start">
                                {/* [FIX] DatePickerInput + minDate dynamic */}
                                <div className="w-3/5">
                                    <DatePickerInput
                                        value={parseDateLocal(getSplitValue(formData.endDate, 'date'))}
                                        onChange={(date) => handleSplitDateTimeChange('endDate', 'date', format(date, 'yyyy-MM-dd'))}
                                        minDate={parseDateLocal(getSplitValue(formData.startDate, 'date')) || new Date()}
                                    />
                                </div>
                                <div className="w-2/5"><TimePicker value={getSplitValue(formData.endDate, 'time')} onChange={(newTime) => handleSplitDateTimeChange('endDate', 'time', newTime)} error={!!errors.endDate} /></div>
                            </div>
                            {errors.endDate && <p className="text-xs text-red-500 flex items-center gap-1 ml-1 mt-1"><AlertCircle size={12}/> {errors.endDate}</p>}
                        </div>
                    </div>

                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={handleSubmit} disabled={isLoading} className={`px-6 py-2.5 rounded-xl bg-[rgb(40,169,224)] text-white font-semibold shadow-lg shadow-blue-200 hover:bg-[rgb(26,140,189)] hover:shadow-none transition-all transform active:scale-95 flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        {isLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Đang xử lý...</> : initialData ? "Lưu thay đổi" : "Thêm"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PromotionFormModal;

