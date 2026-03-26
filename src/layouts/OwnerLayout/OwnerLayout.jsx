import React, { useState, useEffect } from "react";
import OwnerSidebar from "./OwnerSidebar";
import OwnerHeader from "./OwnerHeader";
import { useAuth } from "../../context/AuthContext";
// Import Modal vừa tạo
import OwnerFirstLoginModal from "./OwnerFirstLoginModal"; 

const OwnerLayout = ({ children }) => {
    const { currentUser } = useAuth();
    const [showSuggestModal, setShowSuggestModal] = useState(false);

    useEffect(() => {
        // Kiểm tra xem User có phải là OWNER và đang ở trạng thái đăng nhập lần đầu không
        const isOwner = currentUser?.roles?.includes("OWNER"); // Hoặc tùy cách bạn check role
        
        if (isOwner && currentUser?.isFirstLogin === true) {
            setShowSuggestModal(true);
        } else {
            setShowSuggestModal(false);
        }
    }, [currentUser]);

    return (
        <div className="flex h-screen bg-gray-50">
            <OwnerSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <OwnerHeader />
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Gọi Modal ra đây */}
            <OwnerFirstLoginModal 
                open={showSuggestModal} 
                onClose={() => setShowSuggestModal(false)} 
            />
        </div>
    );
};

export default OwnerLayout;