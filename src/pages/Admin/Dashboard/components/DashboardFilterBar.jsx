// File: src/pages/Admin/Dashboard/components/DashboardFilterBar.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import adminService from "@/services/admin.service";

const PRIMARY_RGB = "rgb(40,169,224)";

const normalize = (v) => (v ?? "").toString().trim();

const isSameFilters = (a, b) =>
  String(a.year) === String(b.year) &&
  String(a.month || "") === String(b.month || "") &&
  normalize(a.city) === normalize(b.city) &&
  normalize(a.ownerId) === normalize(b.ownerId);

// =============================
// Icons
// =============================
const IconChevron = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 10l5 5 5-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconClose = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconSearch = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 21l-4.3-4.3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M10.8 18.2a7.4 7.4 0 1 0 0-14.8 7.4 7.4 0 0 0 0 14.8Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

const IconPin = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 22s7-4.5 7-12a7 7 0 1 0-14 0c0 7.5 7 12 7 12Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M12 13.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

const IconUser = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 21a8 8 0 1 0-16 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M12 13a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

// =============================
// Mini Searchable Select (no lib)
// - Search
// - Keyboard: ↑ ↓ Enter Esc
// - Clear button
// - Outside click close
// =============================
const SearchableSelect = ({
  value,
  onChange, // (val, meta) => void
  options, // [{ value, label, subLabel?, title?, raw? }]
  placeholder = "Chọn...",
  allLabel = "Tất cả",
  icon = null,
  disabled = false,
  fieldBase = "",
  className = "",
  maxListHeight = 280,
}) => {
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const selected = useMemo(
    () => options.find((o) => String(o.value) === String(value)),
    [options, value]
  );

  const filtered = useMemo(() => {
    const nq = normalize(q).toLowerCase();
    if (!nq) return options;

    return options.filter((o) => {
      const hay = `${o.label || ""} ${o.subLabel || ""} ${o.title || ""}`.toLowerCase();
      return hay.includes(nq);
    });
  }, [options, q]);

  // Build list items (including ALL option at top)
  const items = useMemo(() => {
    const allItem = { value: "", label: allLabel, subLabel: "", _isAll: true };
    return [allItem, ...filtered];
  }, [allLabel, filtered]);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setActiveIdx(0);
  }, []);

  // click outside
  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [close]);

  useEffect(() => {
    if (open) {
      // focus search input after open
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQ("");
      setActiveIdx(0);
    }
  }, [open]);

  const pick = (opt) => {
    onChange?.(opt.value, opt);
    close();
  };

  const onKeyDown = (e) => {
    if (!open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, items.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const opt = items[activeIdx];
      if (opt) pick(opt);
    }
  };

  const showClear = !!normalize(value);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}

      {/* Clear */}
      {showClear && !disabled && (
        <button
          type="button"
          onClick={() => pick({ value: "", label: allLabel, _isAll: true })}
          className="absolute right-9 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          title="Xoá lựa chọn"
        >
          {IconClose}
        </button>
      )}

      {/* Caret */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        {IconChevron}
      </span>

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={[
          fieldBase,
          icon ? "pl-9" : "",
          "pr-10",
          "flex items-center justify-between gap-3",
          disabled ? "opacity-60 cursor-not-allowed" : "hover:border-gray-300",
        ].join(" ")}
      >
        <span className={`truncate ${selected ? "text-gray-900" : "text-gray-400"}`}>
          {selected ? selected.label : placeholder || allLabel}
        </span>
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_16px_50px_rgba(0,0,0,0.10)]"
          onKeyDown={onKeyDown}
        >
          {/* Search */}
          <div className="p-2 border-b border-gray-100 bg-white">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {IconSearch}
              </span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActiveIdx(0);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-[rgb(40,169,224)] focus:ring-4 focus:ring-[rgba(40,169,224,0.18)]"
                placeholder="Gõ để tìm..."
              />
            </div>

            <div className="mt-2 text-[11px] text-gray-500 flex items-center justify-between">
              <span>↑↓ di chuyển • Enter chọn • Esc đóng</span>
              <span className="font-semibold">{items.length - 1} kết quả</span>
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: maxListHeight }} className="overflow-auto">
            {items.length === 1 ? (
              <div className="px-3 py-3 text-sm text-gray-500">Không tìm thấy kết quả</div>
            ) : (
              items.map((opt, idx) => {
                const isSelected = String(opt.value) === String(value);
                const isActive = idx === activeIdx;

                return (
                  <button
                    key={`${String(opt.value)}-${idx}`}
                    type="button"
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => pick(opt)}
                    title={opt.title || ""}
                    className={[
                      "w-full text-left px-3 py-2.5 text-sm transition",
                      isActive ? "bg-gray-50" : "bg-white",
                      isSelected ? "font-semibold text-gray-900" : "text-gray-800",
                      "hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate">{opt.label}</div>
                        {opt.subLabel ? (
                          <div className="truncate text-xs text-gray-500 mt-0.5">{opt.subLabel}</div>
                        ) : null}
                      </div>

                      {isSelected ? (
                        <span
                          className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            color: PRIMARY_RGB,
                            background: "rgba(40,169,224,0.10)",
                          }}
                        >
                          ✓
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardFilterBar = ({ filters, setFilters, onApply, isLoading = false }) => {
  const currentYear = new Date().getFullYear();

  const years = useMemo(
    () => Array.from({ length: 5 }, (_, i) => currentYear - i),
    [currentYear]
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  // dropdown data
  const [owners, setOwners] = useState([]);
  const [cities, setCities] = useState([]);

  // draft state
  const [draft, setDraft] = useState({
    year: filters.year ?? currentYear,
    month: filters.month ?? "",
    city: filters.city ?? "",
    ownerId: filters.ownerId ?? "",
    ownerLabel: filters.ownerLabel ?? "",
  });

  // remember last applied
  const lastAppliedRef = useRef({
    year: draft.year,
    month: draft.month,
    city: normalize(draft.city),
    ownerId: normalize(draft.ownerId),
    ownerLabel: draft.ownerLabel,
  });

  // Sync draft when parent changes
  useEffect(() => {
    setDraft((prev) => ({
      ...prev,
      year: filters.year ?? currentYear,
      month: filters.month ?? "",
      city: filters.city ?? "",
      ownerId: filters.ownerId ?? "",
      ownerLabel: filters.ownerLabel ?? prev.ownerLabel ?? "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.year, filters.month, filters.city, filters.ownerId, filters.ownerLabel]);

  // Load options once
  useEffect(() => {
    const load = async () => {
      try {
        const [ownersRes, citiesRes] = await Promise.all([
          adminService.getDashboardOwners(),
          adminService.getDashboardCities(),
        ]);
        setOwners(ownersRes?.data || []);
        setCities(citiesRes?.data || []);
      } catch (e) {
        console.error("Load filter options error:", e);
      }
    };
    load();
  }, []);

  const cityOptions = useMemo(() => {
    return (cities || [])
      .filter((c) => normalize(c))
      .map((c) => ({ value: c, label: c }));
  }, [cities]);

  const ownerOptions = useMemo(() => {
    return (owners || []).map((o) => ({
      value: o.userId,
      label: o.fullName || o.userId,
      subLabel: o.email ? o.email : "",
      title: o.userId, // hover tooltip show id
      raw: o,
    }));
  }, [owners]);

  // Auto fill ownerLabel if missing
  useEffect(() => {
    if (!draft.ownerId || draft.ownerLabel) return;
    const found = ownerOptions.find((x) => String(x.value) === String(draft.ownerId));
    if (found) setDraft((prev) => ({ ...prev, ownerLabel: found.label }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.ownerId, ownerOptions.length]);

  const dirty = useMemo(() => !isSameFilters(draft, lastAppliedRef.current), [draft]);

  const fieldBase =
    "w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm " +
    "placeholder:text-gray-400 outline-none transition " +
    "focus:border-[rgb(40,169,224)] focus:ring-4 focus:ring-[rgba(40,169,224,0.18)]";

  const labelBase = "mb-1.5 block text-xs font-semibold text-gray-700";

  const applyNow = () => {
    // sync to parent (so UI state consistent)
    setFilters((prev) => ({
      ...prev,
      year: draft.year,
      month: draft.month,
      city: draft.city,
      ownerId: draft.ownerId,
      ownerLabel: draft.ownerLabel,
    }));

    lastAppliedRef.current = {
      year: draft.year,
      month: draft.month,
      city: normalize(draft.city),
      ownerId: normalize(draft.ownerId),
      ownerLabel: draft.ownerLabel,
    };

    // call parent apply to fetch dashboard
    onApply?.({
      year: draft.year,
      month: draft.month,
      city: draft.city,
      ownerId: draft.ownerId,
    });
  };

  const handleReset = () => {
    const reset = { year: currentYear, month: "", city: "", ownerId: "", ownerLabel: "" };
    setDraft(reset);
    setFilters(reset);
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const activeChips = useMemo(() => {
    const chips = [];
    if (draft.year) chips.push({ key: "year", label: `Năm: ${draft.year}` });
    if (draft.month) chips.push({ key: "month", label: `Tháng: ${draft.month}` });
    if (normalize(draft.city)) chips.push({ key: "city", label: `Khu vực: ${normalize(draft.city)}` });
    if (normalize(draft.ownerId)) {
      chips.push({
        key: "ownerId",
        label: `Owner: ${normalize(draft.ownerLabel) || "Đã chọn"}`,
        title: draft.ownerId,
      });
    }
    return chips;
  }, [draft]);

  const clearChip = (key) => {
    const next = { ...draft };
    if (key === "year") next.year = currentYear;
    if (key === "month") next.month = "";
    if (key === "city") next.city = "";
    if (key === "ownerId") {
      next.ownerId = "";
      next.ownerLabel = "";
    }
    setDraft(next);
    setFilters((prev) => ({ ...prev, ...next }));
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PRIMARY_RGB }} />
            <h3 className="text-sm font-bold text-gray-900">Bộ lọc thống kê</h3>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">
              Chọn bộ lọc rồi bấm <span className="font-semibold">Lọc dữ liệu</span>
            </span>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            {activeChips.length === 0 ? (
              <span className="text-xs text-gray-400">Chưa chọn bộ lọc</span>
            ) : (
              activeChips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => clearChip(c.key)}
                  title={c.title || "Bấm để xoá bộ lọc này"}
                  className="group inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-100"
                >
                  <span className="truncate max-w-[260px]">{c.label}</span>
                  <span className="text-gray-400 group-hover:text-gray-600">✕</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Year */}
          <div className="md:col-span-2">
            <label className={labelBase}>Năm</label>
            <select
              name="year"
              value={draft.year}
              onChange={handleSelectChange}
              className={`${fieldBase} rounded-2xl`}
              disabled={isLoading}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div className="md:col-span-2">
            <label className={labelBase}>Tháng</label>
            <select
              name="month"
              value={draft.month}
              onChange={handleSelectChange}
              className={`${fieldBase} rounded-2xl`}
              disabled={isLoading}
            >
              <option value="">Cả năm</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  Tháng {m}
                </option>
              ))}
            </select>
          </div>

          {/* City (Searchable) */}
          <div className="md:col-span-4">
            <label className={labelBase}>Khu vực</label>
            <SearchableSelect
              value={draft.city}
              onChange={(val) => {
                setDraft((prev) => ({ ...prev, city: val }));
                setFilters((prev) => ({ ...prev, city: val }));
              }}
              options={cityOptions}
              allLabel="Tất cả khu vực"
              placeholder="Tất cả khu vực"
              icon={IconPin}
              disabled={isLoading}
              fieldBase={fieldBase}
            />
          </div>

          {/* Owner (Searchable) */}
          <div className="md:col-span-4">
            <label className={labelBase}>Chủ sở hữu</label>
            <SearchableSelect
              value={draft.ownerId}
              onChange={(val, meta) => {
                const label = meta?.label || "";
                setDraft((prev) => ({
                  ...prev,
                  ownerId: val,
                  ownerLabel: val ? label : "",
                }));
                setFilters((prev) => ({
                  ...prev,
                  ownerId: val,
                  ownerLabel: val ? label : "",
                }));
              }}
              options={ownerOptions}
              allLabel="Tất cả chủ sở hữu"
              placeholder="Tất cả chủ sở hữu"
              icon={IconUser}
              disabled={isLoading}
              fieldBase={fieldBase}
            />
          </div>

          {/* Actions */}
          <div className="md:col-span-12">
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-200 active:scale-[0.99] disabled:opacity-60"
              >
                Đặt lại
              </button>

              <button
                type="button"
                onClick={applyNow}
                disabled={!dirty || isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition active:scale-[0.99] focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: PRIMARY_RGB,
                  boxShadow: "0 12px 28px rgba(40,169,224,0.22)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.97)")}
                onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                    Đang lọc...
                  </>
                ) : (
                  "Lọc dữ liệu"
                )}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
              <span>
                Mẹo: để trống <span className="font-semibold">Tháng</span> để xem tổng hợp cả năm.
              </span>

              <span className="inline-flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${dirty ? "" : "opacity-40"}`}
                  style={{ backgroundColor: PRIMARY_RGB }}
                />
                {dirty ? "Có thay đổi chưa áp dụng" : "Đã áp dụng"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilterBar;