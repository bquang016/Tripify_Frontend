import React from "react";
import Card from "../../../../components/common/Card/Card";
import CardHeader from "../../../../components/common/Card/CardHeader";
import Avatar from "../../../../components/common/Avatar/Avatar";
import { Bell } from "lucide-react";

// Dữ liệu mock
const activities = [
  {
    id: 1,
    user: "customer@travelmate.vn",
    action: "đã đặt phòng #12345.",
    time: "2 phút trước",
  },
  {
    id: 2,
    user: "owner@travelmate.vn",
    action: "đã cập nhật giá phòng tại Sunrise Resort.",
    time: "15 phút trước",
  },
  {
    id: 3,
    user: "admin@travelmate.vn",
    action: "đã khóa tài khoản user 'test@gmail.com'.",
    time: "1 giờ trước",
  },
  {
    id: 4,
    user: "Một khách sạn mới",
    action: "đang chờ được duyệt.",
    time: "3 giờ trước",
  },
];

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader
        title="Hoạt động gần đây"
        icon={<Bell className="text-[rgb(40,169,224)]" />}
      />
      <div className="space-y-4 max-h-80 overflow-y-auto mt-2">
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