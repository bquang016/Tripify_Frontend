// src/components/common/Loading/Skeleton.jsx
import React from "react";

export default function Skeleton({ width = "100%", height = "16px", radius = "8px" }) {
  return (
    <div
      className="bg-gray-200 animate-pulse"
      style={{
        width,
        height,
        borderRadius: radius,
      }}
    ></div>
  );
}
