import React from "react";
import { Bot } from "lucide-react";


const AIPayloadCard = ({ payload }) => {
    if (!payload) return null;

    // Tìm tất cả key có value là array
    const listKeys = Object.keys(payload).filter(
        (key) => Array.isArray(payload[key])
    );

    // Nếu không có array nào → không render card
    if (listKeys.length === 0) return null;

    return (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">

            {/* Tiêu đề chung */}
            <div className="flex items-center gap-2 mb-3">
                <Bot size={16} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900">
                    Gợi ý cho {payload.city || "địa điểm"}
                </h3>
            </div>

            {/* Render từng loại list */}
            {listKeys.map((key, idx) => {
                const items = payload[key];

                return (
                    <div key={idx} className="mb-3">
                        {/* Sub-title */}
                        <h4 className="font-semibold text-gray-800 mb-1 capitalize">
                            {key.replace(/_/g, " ")}
                        </h4>

                        <ul className="space-y-1">
                            {items.map((item, i) => (
                                <li key={i} className="text-[0.9rem] text-gray-700 flex gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2"></span>

                                    {/* Nếu item là object */}
                                    {typeof item === "object" && !Array.isArray(item) ? (
                                        <span>
                                            <b>{item.name || item.title || "Item"}</b>
                                            {item.type && <> – {item.type}</>}
                                            {/* Render thêm các fields khác nếu có */}
                                            {Object.keys(item)
                                                .filter((k) => k !== "name" && k !== "type")
                                                .map((otherKey) => (
                                                    <div key={otherKey} className="text-gray-600 text-[0.85rem] ml-1">
                                                        {otherKey}: {String(item[otherKey])}
                                                    </div>
                                                ))}
                                        </span>
                                    ) : (
                                        // Nếu item chỉ là string/number
                                        <span>{String(item)}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

export default AIPayloadCard;
