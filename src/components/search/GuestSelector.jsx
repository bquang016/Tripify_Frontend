import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, PawPrint } from "lucide-react";
import { useTranslation } from "react-i18next";

const Row = ({ label, value, min = 0, onChange }) => {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-none">
      <span className="text-gray-800">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded-full hover:bg-gray-100"
        >
          −
        </button>
        <span className="w-6 text-center">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded-full hover:bg-gray-100"
        >
          +
        </button>
      </div>
    </div>
  );
};

const GuestSelector = ({ value, onChange }) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const [data, setData] = useState({
    adults: value?.adults ?? 2,
    children: value?.children ?? 0,
    rooms: value?.rooms ?? 1,
    pets: value?.pets ?? false,
  });

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const update = (patch) => {
    const next = { ...data, ...patch };
    setData(next);
    onChange?.(next);
  };

  const summary = `${data.adults + data.children} ${t('search.guests')} • ${data.rooms} ${t('search.rooms')}${
    data.pets ? (i18n.language === 'vi' ? " • có thú cưng" : " • with pets") : ""
  }`;

  return (
    <div className="relative flex flex-col" ref={ref}>
      <label className="text-sm font-semibold text-gray-600 mb-1">{t('search.guests')}</label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
      >
        <span className="text-gray-700 text-sm">{summary}</span>
        <ChevronDown size={18} className="text-gray-500" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl z-50 w-80 p-4 text-sm">
          <Row
            label={t('search.adults')}
            value={data.adults}
            min={1}
            onChange={(v) => update({ adults: v })}
          />
          <Row
            label={t('search.children')}
            value={data.children}
            min={0}
            onChange={(v) => update({ children: v })}
          />
          <Row
            label={t('search.rooms')}
            value={data.rooms}
            min={1}
            onChange={(v) => update({ rooms: v })}
          />

          <div className="flex justify-between items-center pt-3">
            <span className="flex items-center gap-2 text-gray-800">
              <PawPrint size={16} className="text-gray-500" />
              {i18n.language === 'vi' ? "Mang theo thú cưng" : "Bring pets"}
            </span>
            <input
              type="checkbox"
              checked={data.pets}
              onChange={(e) => update({ pets: e.target.checked })}
              className="accent-[rgb(40,169,224)] w-4 h-4"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-white"
              onClick={() => setOpen(false)}
            >
              {t('search.apply')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestSelector;
