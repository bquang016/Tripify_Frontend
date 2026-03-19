import React, { useState, useEffect } from 'react';
import withdrawalService from '../../../services/withdrawal.service';
import { formatCurrency } from '../../../utils/priceUtils';
import toast from 'react-hot-toast';
import { Clock, CheckCircle2, XCircle, Search, FileText, Wallet, ArrowRight } from 'lucide-react';
import ProcessWithdrawalModal from './ProcessWithdrawalModal';

const AdminWithdrawalPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await withdrawalService.getAllRequests();
      if (res.data?.data) {
        const sorted = res.data.data.sort((a, b) => {
          if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
          if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setRequests(sorted);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách rút tiền');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      setIsProcessing(true);
      const res = await withdrawalService.approveRequest(id);
      toast.success(res.data?.message || 'Duyệt thành công!');
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi khi duyệt yêu cầu');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id, adminNote) => {
    try {
      setIsProcessing(true);
      const res = await withdrawalService.rejectRequest(id, adminNote);
      toast.success(res.data?.message || 'Đã từ chối yêu cầu!');
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi khi từ chối yêu cầu');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200/50 shadow-sm"><Clock size={14}/> Cần xử lý</span>;
      case 'APPROVED':
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green-600 border border-green-200/50 shadow-sm"><CheckCircle2 size={14}/> Đã hoàn tất</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 border border-red-200/50 shadow-sm"><XCircle size={14}/> Bị từ chối</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-50 text-gray-600 border border-gray-200/50 shadow-sm">{status}</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto bg-gray-50/30 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <Wallet size={24} />
            </div>
            Quản lý Rút tiền
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            Phê duyệt lệnh rút tiền của đối tác từ ví Tripify về ngân hàng.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-5 font-bold rounded-tl-3xl">Mã GD</th>
                <th className="p-5 font-bold">Đối tác (Owner)</th> {/* Bổ sung cột Đối tác */}
                <th className="p-5 font-bold">Ngày yêu cầu</th>
                <th className="p-5 font-bold">Số tiền rút</th>
                <th className="p-5 font-bold">Trạng thái</th>
                <th className="p-5 font-bold text-center rounded-tr-3xl">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></span>
                      <p className="text-gray-500 font-medium text-sm">Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <FileText size={32} />
                      </div>
                      <p className="text-gray-500 font-medium">Hiện không có yêu cầu rút tiền nào.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-5">
                      <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        #W{req.id}
                      </span>
                    </td>
                    
                    {/* Render thông tin Owner */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                          {req.ownerName ? req.ownerName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{req.ownerName || 'Không xác định'}</p>
                          <p className="text-xs text-gray-500">{req.ownerEmail || 'Chưa cập nhật email'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-gray-500 font-medium">
                      {new Date(req.createdAt).toLocaleString('vi-VN', {
                        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                    </td>
                    <td className="p-5 font-extrabold text-gray-900 tabular-nums text-base">
                      {formatCurrency(req.amount)}
                    </td>
                    <td className="p-5">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="p-5 text-center">
                      {req.status === 'PENDING' ? (
                        <button 
                          onClick={() => setSelectedRequest(req)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all text-xs shadow-sm"
                        >
                          Xử lý <ArrowRight size={14} />
                        </button>
                      ) : (
                        <span className="text-gray-400 font-medium text-sm px-4 py-2 bg-gray-50 rounded-xl inline-block">
                          Đã xử lý
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProcessWithdrawalModal 
        isOpen={!!selectedRequest}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default AdminWithdrawalPage;