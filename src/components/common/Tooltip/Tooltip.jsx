import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Tooltip({ text, children, position = "top" }) {
  const [show, setShow] = useState(false);

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 px-3 py-1.5 rounded-xl text-sm text-white bg-[rgb(40,169,224)] shadow-lg ${positionClasses[position]}`}
          >
            {text}
            <div className="absolute w-2 h-2 bg-[rgb(40,169,224)] rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
