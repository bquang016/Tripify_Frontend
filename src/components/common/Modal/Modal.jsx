import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
// 1. Import ModalPortal để đảm bảo modal hiển thị đúng cấp
import ModalPortal from "./ModalPortal"; 

// 2. Nhận thêm props { title, children, maxWidth }
export default function Modal({
  open,
  onClose,
  title = "Thông báo", // Thêm title mặc định
  children, // Thêm children
  maxWidth = "max-w-md", // 3. ✅ Thêm prop maxWidth, gán giá trị mặc định là 'max-w-md'
}) {
  if (!open) return null;

  return (
    <ModalPortal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              // 4. ✅ Sử dụng biến 'maxWidth' thay vì hard-code 'max-w-md'
              className={`bg-white rounded-2xl shadow-2xl w-[95%] ${maxWidth} overflow-hidden`}
              onClick={(e) => e.stopPropagation()} 
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h3 className="text-lg font-semibold text-[rgb(40,169,224)]">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              {/* 5. ✅ Tăng max-h (chiều cao tối đa) để phù hợp với modal rộng hơn */}
              <div className="px-6 py-5 space-y-4 text-gray-700 max-h-[80vh] overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
}