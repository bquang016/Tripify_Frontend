import React from "react";

const RoomStatusOverview = () => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tình trạng phòng
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-around">
                <div className="flex items-center justify-center h-52 w-52 bg-gray-50 dark:bg-gray-700 rounded-full">

                    <span className="text-gray-500 dark:text-gray-400"> (Biểu đồ) </span>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 space-y-2">
                    <div className="flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-gray-700 dark:text-gray-300">Sẵn sàng (52)</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        <span className="text-gray-700 dark:text-gray-300">Đang có khách (78)</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                        <span className="text-gray-700 dark:text-gray-300">Cần dọn (12)</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        <span className="text-gray-700 dark:text-gray-300">Đang sửa chữa (3)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomStatusOverview;
