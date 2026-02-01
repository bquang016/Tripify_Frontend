// src/components/common/Breadcrumb/Breadcrumb.jsx
import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom"; // nếu chưa dùng router, thay <Link> bằng <a>

export default function Breadcrumb({
  items = [], // [{ label, href }]
  maxItems = 5,
  home = { label: "Trang chủ", href: "/" },
}) {
  const list = home ? [home, ...items] : items;

  let display = list;
  let collapsed = false;

  if (list.length > maxItems) {
    collapsed = true;
    // Giữ: first, ..., last-2, last-1, last
    display = [list[0], { label: "..." }, ...list.slice(-3)];
  }

  return (
    <nav aria-label="breadcrumb" className="w-full">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {display.map((item, idx) => {
          const isLast = idx === display.length - 1;
          const isEllipsis = item.label === "...";
          return (
            <li key={idx} className="inline-flex items-center">
              {idx !== 0 && <ChevronRight size={16} className="mx-1 text-gray-300" />}
              {isEllipsis ? (
                <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-500">...</span>
              ) : isLast ? (
                <span className="px-2 py-1 rounded-md bg-[rgb(40,169,224,0.08)] text-[rgb(40,169,224)] font-medium">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  to={item.href}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {idx === 0 && <Home size={16} className="text-gray-400" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="px-2 py-1">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
