import React from "react";
import { motion } from "framer-motion";

// Component này được thiết kế để nổi bật trên nền tối/nền ảnh
export default function CtaButton({ children, ...props }) {
  return (
    <motion.button
      {...props}
      className="inline-flex items-center justify-center px-6 py-3
                 text-base font-bold text-white
                 border-2 border-white
                 rounded-xl bg-transparent 
                 shadow-lg
                 transition-all duration-300
                 hover:bg-white hover:text-[rgb(40,169,224)]
                 transform hover:scale-105"
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}