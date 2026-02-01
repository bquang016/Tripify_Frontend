import React from "react";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const toastTypes = {
    success: {
        icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
        borderColor: "border-l-emerald-500",
        bgIcon: "bg-emerald-50",
        titleColor: "text-emerald-800",
    },
    error: {
        icon: <XCircle className="w-6 h-6 text-rose-500" />,
        borderColor: "border-l-rose-500",
        bgIcon: "bg-rose-50",
        titleColor: "text-rose-800",
    },
    warning: {
        icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
        borderColor: "border-l-amber-500",
        bgIcon: "bg-amber-50",
        titleColor: "text-amber-800",
    },
    info: {
        icon: <Info className="w-6 h-6 text-sky-500" />,
        borderColor: "border-l-sky-500",
        bgIcon: "bg-sky-50",
        titleColor: "text-sky-800",
    },
};

export default function ModernToast({ t, type = "info", title, message }) {
    const style = toastTypes[type];

    return (
        <div
            className={`${
                t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden border-l-4 ${style.borderColor}`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <div className={`p-2 rounded-full ${style.bgIcon}`}>
                            {style.icon}
                        </div>
                    </div>
                    <div className="ml-3 flex-1">
                        <p className={`text-sm font-bold ${style.titleColor}`}>
                            {title}
                        </p>
                        <p className="mt-1 text-sm text-gray-600 leading-snug">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-gray-100">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus:outline-none transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}