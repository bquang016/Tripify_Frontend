import React from "react";
import Card from "../../../../components/common/Card/Card";
import CardHeader from "../../../../components/common/Card/CardHeader";

// Đây là component con, chỉ để hiển thị
const StatCard = ({ title, value, icon, change }) => {
  return (
    <Card>
      {/* Dùng CardHeader để hiển thị icon và tiêu đề */}
      <CardHeader title={title} icon={icon} />
      <div className="mt-2">
        <span className="text-3xl font-bold text-gray-800">{value}</span>
        {/* Logic hiển thị % thay đổi */}
        {change && (
          <span
            className={`ml-2 text-sm font-medium ${
              change.startsWith("+") ? "text-green-500" : (change.startsWith("-") ? "text-red-500" : "text-gray-500")
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </Card>
  );
};

export default StatCard;