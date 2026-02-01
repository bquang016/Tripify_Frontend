import React from "react";
import { motion } from "framer-motion";
import { Plane } from "lucide-react"; // npm install lucide-react

export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 select-none">
      {/* ✈️ Máy bay bay theo đường cong ~ từ trái sang phải */}
      <div className="relative w-[200px] h-[60px] overflow-visible">
        <motion.div
          initial={{ x: -100, y: 0 }}
          animate={{
            x: [ -100, -50, 0, 50, 100 ],
            y: [ 0, -15, 0, 15, 0 ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2"
        >
          <Plane
            size={42}
            strokeWidth={2.5}
            className="text-[rgb(40,169,224)] rotate-6 drop-shadow-sm"
          />
        </motion.div>

        {/* hiệu ứng “vệt bay nhẹ” phía sau máy bay */}
        <motion.span
          className="absolute left-0 top-1/2 -translate-y-1/2 text-[rgb(40,169,224,0.3)] text-2xl"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ~~~
        </motion.span>
      </div>

      {/* chữ Đang tải với dấu chấm tuần tự */}
      <div className="text-[rgb(40,169,224)] font-semibold text-lg tracking-wide flex items-center">
        Đang tải
        <motion.span
          className="ml-1"
          animate={{ opacity: [0, 1, 0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.0 }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1.0 }}
        >
          .
        </motion.span>
      </div>
    </div>
  );
}
