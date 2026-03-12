import React, { useState, useEffect } from "react";
import { 
  Search, Filter, Download, ArrowUpRight, ArrowDownLeft, Wallet, RefreshCw, XCircle, CreditCard
} from "lucide-react";
import Button from "../../../components/common/Button/Button";
import paymentService from "../../../services/payment.service";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

// Badge Status Component
const TransactionStatusBadge = ({ status }) => {
  const { t } = useTranslation();
  
  const styles = {
    APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200", 
    PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",     
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",         
    REFUNDED: "bg-purple-100 text-purple-700 border-purple-200",     
    REFUND_REQUESTED: "bg-orange-100 text-orange-700 border-orange-200", 
    REJECTED: "bg-rose-100 text-rose-700 border-rose-200"            
  };

  const labels = {
    APPROVED: t('finance.status_success', 'Success'),
    PAID: t('finance.status_success', 'Success'),
    PENDING: t('finance.status_processing', 'Processing'),
    REFUNDED: t('finance.status_refunded', 'Refunded'),
    REFUND_REQUESTED: t('finance.status_refund_req', 'Refund Requested'),
    REJECTED: t('finance.status_failed', 'Failed')
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${styles[status] || "bg-gray-100"}`}>
      {status === 'REFUNDED' ? <ArrowDownLeft size={12}/> : <ArrowUpRight size={12}/>}
      {labels[status] || status}
    </span>
  );
};

const TransactionManagementPage = () => {
  const { t, i18n } = useTranslation();
  const { currency } = useLanguage();
  const isVi = i18n.language === 'vi';

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getAllTransactions(); 
      const data = res.data || res; 
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch transactions error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = transactions.filter(t_item => {
    const matchSearch = 
      t_item.transactionReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t_item.bookingId?.toString().includes(searchTerm);
    
    let matchFilter = true;
    if (filter === 'IN') matchFilter = t_item.status === 'APPROVED' || t_item.status === 'PAID';
    if (filter === 'OUT') matchFilter = t_item.status === 'REFUNDED';
    if (filter === 'PENDING') matchFilter = t_item.status === 'REFUND_REQUESTED' || t_item.status === 'PENDING';

    return matchSearch && matchFilter;
  });

  const totalRevenue = transactions
    .filter(t_item => t_item.status === 'APPROVED' || t_item.status === 'PAID')
    .reduce((sum, t_item) => sum + (t_item.amount || 0), 0);

  const formatMoney = (amount) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 25000);
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "---";
    return new Date(date).toLocaleString(isVi ? 'vi-VN' : 'en-US');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="text-blue-600" /> {t('finance.title', 'Financial Management')}
          </h1>
          <p className="text-slate-500 text-sm">{t('finance.subtitle', 'Track all income and expenses.')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={Download}>{t('finance.export_report', 'Export Report')}</Button>
          <Button variant="primary" icon={RefreshCw} onClick={fetchData}>{t('finance.refresh', 'Refresh')}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">{t('finance.total_actual_revenue', 'Total Actual Revenue')}</p>
            <p className="text-2xl font-bold text-emerald-600">{formatMoney(totalRevenue)}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <ArrowUpRight size={20} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">{t('finance.total_refund_orders', 'Total Refund Orders')}</p>
            <p className="text-2xl font-bold text-purple-600">
              {transactions.filter(t_item => t_item.status === 'REFUNDED').length} {t('finance.orders', 'orders')}
            </p>
          </div>
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
            <ArrowDownLeft size={20} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">{t('finance.failed_transactions', 'Failed Transactions')}</p>
            <p className="text-2xl font-bold text-rose-600">
              {transactions.filter(t_item => t_item.status === 'REJECTED').length}
            </p>
          </div>
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t('finance.search_placeholder', 'Search by transaction ref, booking ID...')} 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'ALL', label: t('finance.filter_all', 'All') },
            { id: 'IN', label: t('finance.filter_income', 'Income') },
            { id: 'OUT', label: t('finance.filter_expense', 'Expense') },
            { id: 'PENDING', label: t('finance.filter_processing', 'Processing') }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === f.id ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">{t('finance.table_tx_ref', 'Transaction Ref')}</th>
                <th className="px-6 py-4">{t('finance.table_booking_id', 'Booking ID')}</th>
                <th className="px-6 py-4">{t('finance.table_time', 'Time')}</th>
                <th className="px-6 py-4">{t('finance.table_method', 'Method')}</th>
                <th className="px-6 py-4 text-right">{t('finance.table_amount', 'Amount')}</th>
                <th className="px-6 py-4 text-center">{t('finance.table_status', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">{t('common.loading', 'Loading...')}</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500 italic">{t('finance.no_requests', 'No data found.')}</td></tr>
              ) : (
                filteredData.map((t_item) => (
                  <tr key={t_item.paymentId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">
                      {t_item.transactionReference || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-blue-600 font-bold">BK-{t_item.bookingId}</td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(t_item.paymentDate)}</td>
                    <td className="px-6 py-4 text-slate-600">{t_item.paymentMethod || "Unknown"}</td>
                    <td className={`px-6 py-4 text-right font-bold ${
                      t_item.status === 'REFUNDED' ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {t_item.status === 'REFUNDED' ? '-' : '+'}{formatMoney(t_item.amount)}
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center">
                      <TransactionStatusBadge status={t_item.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionManagementPage;
