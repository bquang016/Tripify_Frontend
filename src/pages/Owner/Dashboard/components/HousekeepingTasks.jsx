import React from "react";

const tasks = [
    { id: 1, room: "201", type: "Dọn dẹp (Check-out)", status: "Đang chờ" },
    { id: 2, room: "305", type: "Yêu cầu thêm khăn.", status: "Đang xử lý" },
    { id: 3, room: "510", type: "Dọn dẹp (Theo lịch)", status: "Đang chờ" },
    { id: 4, room: "102", type: "Hỏng TV", status: "Báo kỹ thuật" },
    { id: 5, room: "208", type: "Dọn dẹp (Check-out)", status: "Đã xong" },
];

const getStatusClass = (status) => {
    switch (status) {
        case "Đang chờ":
            return "bg-yellow-100 text-yellow-800";
        case "Đang xử lý":
            return "bg-blue-100 text-blue-800";
        case "Báo kỹ thuật":
            return "bg-red-100 text-red-800";
        case "Đã xong":
            return "bg-green-100 text-green-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const HousekeepingTasks = () => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 h-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tác vụ dọn phòng & Bảo trì
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Phòng</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tác vụ</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{task.room}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{task.type}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(task.status)}`}>
                                        {task.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HousekeepingTasks;
