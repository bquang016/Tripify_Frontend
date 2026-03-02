import React from "react";
import Card from "../../../../components/common/Card/Card";
import CardHeader from "../../../../components/common/Card/CardHeader";
import Avatar from "../../../../components/common/Avatar/Avatar";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

const RecentActivity = () => {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';

  // Dữ liệu mock kết hợp dịch thuật
  const activities = [
    {
      id: 1,
      user: "customer@travelmate.vn",
      action: isVi ? "đã đặt phòng #12345." : "booked room #12345.",
      time: isVi ? "2 phút trước" : "2 mins ago",
    },
    {
      id: 2,
      user: "owner@travelmate.vn",
      action: isVi ? "đã cập nhật giá phòng tại Sunrise Resort." : "updated room prices at Sunrise Resort.",
      time: isVi ? "15 phút trước" : "15 mins ago",
    },
    {
      id: 3,
      user: "admin@travelmate.vn",
      action: isVi ? "đã khóa tài khoản user 'test@gmail.com'." : "locked user account 'test@gmail.com'.",
      time: isVi ? "1 giờ trước" : "1 hour ago",
    },
    {
      id: 4,
      user: isVi ? "Một khách sạn mới" : "A new hotel",
      action: isVi ? "đang chờ được duyệt." : "is pending approval.",
      time: isVi ? "3 giờ trước" : "3 hours ago",
    },
  ];

  return (
    <Card>
      <CardHeader
        title={isVi ? "Hoạt động gần đây" : "Recent Activity"}
        icon={<Bell className="text-[rgb(40,169,224)]" />}
      />
      <div className="space-y-4 max-h-80 overflow-y-auto mt-2 custom-scrollbar">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <Avatar name={item.user} size={36} className="mt-1" />
            <div className="text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">{item.user}</span> {item.action}
              </p>
              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
