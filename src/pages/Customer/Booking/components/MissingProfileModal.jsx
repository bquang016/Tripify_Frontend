import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, UserCog } from 'lucide-react';
import Modal from '@/components/common/Modal/Modal'; // Giả sử bạn có Modal base
import Button from '@/components/common/Button/Button';

const MissingProfileModal = ({ isOpen, onClose, missingFields }) => {
    const navigate = useNavigate();

    return (
        <Modal open={isOpen} onClose={onClose} title="Cập nhật thông tin" maxWidth="max-w-md">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle size={32} />
                </div>
                
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Thông tin chưa đầy đủ</h3>
                    <p className="text-sm text-slate-500 mt-2">
                        Để sử dụng tính năng "Đặt cho chính mình", bạn cần cập nhật các thông tin sau trong hồ sơ:
                    </p>
                </div>

                <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 text-left">
                    <ul className="list-disc list-inside text-sm text-rose-700 space-y-1 font-medium">
                        {missingFields.map((field, index) => (
                            <li key={index}>{field}</li>
                        ))}
                    </ul>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={onClose}>
                        Tôi sẽ nhập tay
                    </Button>
                    <Button 
                        className="flex-1 bg-blue-600 text-white" 
                        icon={UserCog}
                        onClick={() => navigate('/customer/profile')}
                    >
                        Cập nhật ngay
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default MissingProfileModal;