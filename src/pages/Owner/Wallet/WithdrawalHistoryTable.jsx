import React from 'react';
import Table from '../../../components/common/Table/Table';
import Badge from '../../../components/common/Badge/Badge';
import { formatCurrency } from '../../../utils/priceUtils';
import { CheckCircle, Clock, XCircle, AlertTriangle, Package2 } from 'lucide-react';

const WithdrawalHistoryTable = ({ history }) => {
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': 
        return <Badge variant="warning" className="flex items-center gap-1.5 py-1 px-3"><Clock size={14} /> Đang xử lý</Badge>;
      case 'APPROVED': 
        return <Badge variant="info" className="flex items-center gap-1.5 py-1 px-3"><Package2 size={14} /> Đã duyệt</Badge>;
      case 'COMPLETED': 
        return <Badge variant="success" className="flex items-center gap-1.5 py-1 px-3"><CheckCircle size={14} /> Hoàn tất</Badge>;
      case 'REJECTED': 
        return <Badge variant="danger" className="flex items-center gap-1.5 py-1 px-3"><XCircle size={14} /> Từ chối</Badge>;
      case 'FAILED': 
        return <Badge variant="danger" className="flex items-center gap-1.5 py-1 px-3"><AlertTriangle size={14} /> Thất bại</Badge>;
      default: 
        return <Badge>{status}</Badge>;
    }
  };

  const columns = [
    { 
      header: 'Mã Lệnh', 
      accessor: 'id', 
      render: (row) => <span className="font-medium text-blue-800 bg-blue-50 py-1 px-3 rounded-md">#W{row.id}</span> 
    },
    { 
      header: 'Ngày tạo', 
      accessor: 'createdAt', 
      render: (row) => new Date(row.createdAt).toLocaleString('vi-VN') 
    },
    { 
      header: 'Số tiền rút', 
      accessor: 'amount', 
      render: (row) => <span className="font-bold text-lg text-gray-950 tabular-nums">{formatCurrency(row.amount)} VNĐ</span> 
    },
    { 
      header: 'Trạng thái', 
      accessor: 'status', 
      render: (row) => getStatusBadge(row.status) 
    },
    { 
      header: 'Ghi chú Admin', 
      accessor: 'adminNote', 
      render: (row) => row.adminNote || <span className="text-gray-400 italic">Không có</span> 
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeInDelay2">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Lịch sử rút tiền</h2>
      </div>
      {history.length === 0 ? (
          <div className="p-10 text-center text-gray-500">Chưa có giao dịch rút tiền nào.</div>
      ) : (
          <Table columns={columns} data={history} />
      )}
    </div>
  );
};

export default WithdrawalHistoryTable;