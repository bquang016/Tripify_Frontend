import React from "react";
import OwnerSidebar from "./OwnerSidebar";
import OwnerHeader from "./OwnerHeader";

const OwnerLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50">
            <OwnerSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">

                <OwnerHeader />
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;
