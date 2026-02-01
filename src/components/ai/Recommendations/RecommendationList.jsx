// src/components/ai/Recommendations/RecommendationList.jsx
import React from "react";
// ✅ Import component card
import RecommendationCard from "../../common/Card/RecommendationCard"; 

// ✅ Nhận recommendations làm prop
const RecommendationList = ({ recommendations = [] }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* ✅ Map qua prop và dùng RecommendationCard */}
      {recommendations.map((rec) => (
        <RecommendationCard key={rec.id} rec={rec} />
      ))}
    </div>
  );
};

export default RecommendationList;