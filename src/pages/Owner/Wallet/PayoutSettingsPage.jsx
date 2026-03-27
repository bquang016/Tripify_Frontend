import React, { useState, useEffect } from 'react';
import { Landmark, ShieldCheck, User, Building, Hash, CheckCircle2, Edit3, ChevronUp, CreditCard, Trash2, Star, PlusCircle, AlertCircle, Plus, AlertTriangle } from 'lucide-react';
import ownerService from '../../../services/owner.service';
import { useAuth } from '../../../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// ==========================================
// THẺ TRỐNG (EMPTY STATE)
// ==========================================
const EmptyMethodCard = ({ title, subtitle, icon: Icon, onClick }) => (
  <div 
    onClick={onClick} 
    className="w-full h-56 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
  >
    <div className="bg-gray-100 p-4 rounded-full group-hover:bg-blue-100 transition-colors mb-3">
      <Icon size={32} className="text-gray-400 group-hover:text-blue-600" />
    </div>
    <span className="font-bold text-gray-700">{title}</span>
    <span className="text-sm text-gray-500 mt-1">{subtitle}</span>
    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
      <PlusCircle size={16} /> Thêm ngay
    </div>
  </div>
);

// ==========================================
// COMPONENT: THẺ NGÂN HÀNG
// ==========================================
const SavedBankAccount = ({ info, loading, onEdit, onDelete, onSetDefault }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (loading) return <div className="animate-pulse h-56 bg-gray-200 rounded-2xl w-full"></div>;
  if (!info?.accountNumber) return <EmptyMethodCard title="Thêm tài khoản ngân hàng" subtitle="Nhận tiền mặt trực tiếp" icon={Landmark} onClick={onEdit} />;

  const maskedAccount = `•••• •••• •••• ${info.accountNumber.slice(-4)}`;
  const isDefault = info.defaultPayoutMethod === 'BANK_TRANSFER';

  return (
    <div className="relative w-full h-56 perspective-1000 group">
      <div className={`w-full h-full preserve-3d relative shadow-xl rounded-2xl cursor-pointer ${isFlipped ? 'card-flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
        <div className="absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-900 p-6 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-5"></div>
          
          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm border border-white/20">
                <Landmark size={24} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-wide shadow-sm">{info.bankName}</span>
            </div>
            {isDefault && (
              <span className="text-xs font-bold bg-green-400/90 text-emerald-900 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <CheckCircle2 size={12} /> Mặc định
              </span>
            )}
          </div>

          <div className="z-10 mt-6">
            <p className="font-mono text-2xl tracking-[0.15em] text-white drop-shadow-md mb-4">{maskedAccount}</p>
            <p className="text-white text-base font-bold uppercase tracking-wider truncate">{info.accountHolderName}</p>
          </div>
        </div>

        <div className="absolute w-full h-full backface-hidden rounded-2xl bg-slate-800 flex flex-col overflow-hidden border border-slate-700 shadow-xl" style={{ transform: 'rotateY(180deg)' }}>
          <div className="w-full h-12 bg-black/80 mt-6"></div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-400 text-sm">Nhấn để quay lại</p>
          </div>
        </div>
      </div>

      {!isFlipped && (
        <div className="absolute -bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20 translate-y-2 group-hover:-translate-y-2">
          {!isDefault && (
            <button onClick={onSetDefault} className="bg-white text-gray-700 hover:text-blue-600 p-2.5 rounded-full shadow-lg border border-gray-100 tooltip-trigger" title="Đặt làm mặc định">
              <Star size={18} />
            </button>
          )}
          <button onClick={onEdit} className="bg-white text-gray-700 hover:text-green-600 p-2.5 rounded-full shadow-lg border border-gray-100" title="Sửa">
            <Edit3 size={18} />
          </button>
          <button onClick={onDelete} className="bg-white text-gray-700 hover:text-red-600 p-2.5 rounded-full shadow-lg border border-gray-100" title="Xóa">
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

// ==========================================
// COMPONENT: THẺ STRIPE
// ==========================================
const SavedStripeCard = ({ info, loading, onAdd, onDelete, onSetDefault }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (loading) return <div className="animate-pulse h-56 bg-gray-200 rounded-2xl w-full"></div>;
  if (!info?.cardLast4) return <EmptyMethodCard title="Thêm thẻ Stripe" subtitle="Thanh toán quốc tế bảo mật" icon={CreditCard} onClick={onAdd} />;

  const isDefault = info.defaultPayoutMethod === 'STRIPE';

  return (
    <div className="relative w-full h-56 perspective-1000 group">
      <div className={`w-full h-full preserve-3d relative shadow-xl rounded-2xl cursor-pointer ${isFlipped ? 'card-flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
        <div className="absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 p-6 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div className="w-12 h-9 rounded bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-90 flex flex-col justify-between p-1.5 shadow-inner">
               <div className="border-b border-black/20 h-1/3"></div>
               <div className="border-b border-black/20 h-1/3"></div>
            </div>
            {isDefault ? (
              <span className="text-xs font-bold bg-green-400/90 text-emerald-900 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                 <CheckCircle2 size={12} /> Mặc định
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-1 rounded backdrop-blur-md border border-white/20">Thẻ Stripe</span>
            )}
          </div>

          <div className="z-10">
            <p className="font-mono text-2xl tracking-[0.2em] text-white/90 mb-4 drop-shadow-md">
              •••• •••• •••• {info.cardLast4}
            </p>
            <p className="text-white text-sm font-bold uppercase truncate max-w-[150px]">{info.accountHolderName || "CHỦ THẺ STRIPE"}</p>
          </div>
        </div>

        <div className="absolute w-full h-full backface-hidden rounded-2xl bg-gray-800 flex flex-col overflow-hidden border border-gray-700 shadow-xl" style={{ transform: 'rotateY(180deg)' }}>
          <div className="w-full h-10 bg-black mt-6 opacity-80"></div>
          <div className="px-6 py-5 flex-1 flex flex-col justify-center">
            <p className="font-mono text-sm text-slate-200 text-center truncate">{info.stripeAccountId}</p>
          </div>
        </div>
      </div>

      {!isFlipped && (
        <div className="absolute -bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20 translate-y-2 group-hover:-translate-y-2">
          {!isDefault && (
            <button onClick={onSetDefault} className="bg-white text-gray-700 hover:text-blue-600 p-2.5 rounded-full shadow-lg border border-gray-100" title="Đặt làm mặc định">
              <Star size={18} />
            </button>
          )}
          <button onClick={onDelete} className="bg-white text-gray-700 hover:text-red-600 p-2.5 rounded-full shadow-lg border border-gray-100" title="Xóa">
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

// ==========================================
// FORM SỬA NGÂN HÀNG (CÓ THÊM BANNER CẢNH BÁO)
// ==========================================
const UpdateBankForm = ({ currentInfo, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankName: currentInfo?.bankName || '',
    accountHolderName: currentInfo?.accountHolderName || '',
    accountNumber: currentInfo?.accountNumber || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData); 
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{currentInfo?.accountNumber ? "Sửa tài khoản ngân hàng" : "Thêm tài khoản ngân hàng"}</h3>
        </div>
        <button onClick={onCancel} className="p-2 rounded-full bg-gray-50 hover:bg-gray-100"><ChevronUp size={20}/></button>
      </div>

      {/* THÊM BANNER CẢNH BÁO Ở ĐÂY NẾU ĐÃ CÓ TÀI KHOẢN */}
      {currentInfo?.accountNumber && (
        <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-amber-800 text-sm">
          <AlertTriangle className="shrink-0 mt-0.5" size={18} />
          <p><strong>Lưu ý:</strong> Hệ thống hiện tại chỉ hỗ trợ liên kết 1 tài khoản ngân hàng. Việc lưu thông tin mới ở đây sẽ <strong>ghi đè (thay thế)</strong> tài khoản đang có.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ngân hàng</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Building size={18} className="text-gray-400" /></div>
                  <input type="text" required value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none" placeholder="VD: Vietcombank" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Số tài khoản</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Hash size={18} className="text-gray-400" /></div>
                  <input type="text" required value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value.replace(/\D/g, '')})} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none font-mono" placeholder="Nhập số tài khoản" />
              </div>
            </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Tên chủ tài khoản</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><User size={18} className="text-gray-400" /></div>
            <input type="text" required value={formData.accountHolderName} onChange={(e) => setFormData({...formData, accountHolderName: e.target.value.toUpperCase()})} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none uppercase font-semibold text-gray-900" placeholder="NGUYEN VAN A" />
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onCancel} className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200">Hủy bỏ</button>
          <button type="submit" disabled={loading} className="flex-[2] py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30">
            {loading ? 'Đang lưu...' : 'Lưu tài khoản'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// FORM SỬA STRIPE (CÓ STRIPE ELEMENTS THẬT)
// ==========================================
const StripeFormInner = ({ onCancel, onSave }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState(''); // Thêm state lưu tên thẻ

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Nếu Stripe chưa load xong thì không cho bấm
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      // 1. Lấy thông tin thẻ từ component <CardElement />
      const cardElement = elements.getElement(CardElement);

      // 2. Gọi API của Stripe (từ React) để tạo Token bảo mật
      const { error, token } = await stripe.createToken(cardElement, {
        name: cardName || "CHỦ THẺ STRIPE", // Truyền tên chủ thẻ lên Stripe
        currency: 'usd'
      });

      // Nếu thẻ sai số, sai ngày hết hạn, mã CVV sai... Stripe sẽ báo lỗi ở đây
      if (error) {
        window.toastRef?.current?.addMessage({ type: 'error', text: error.message });
        setLoading(false);
        return;
      }

      // 3. Nếu thành công, ta có được "token.id" thật (vd: tok_1Ouabc...)
      // Gửi token này xuống Backend để Backend xử lý
      await onSave({ 
        stripeToken: token.id, // Backend sẽ cần đọc biến này!
        accountHolderName: cardName // Cập nhật luôn tên chủ thẻ hiển thị
      }); 

    } catch (err) {
      console.error(err);
      window.toastRef?.current?.addMessage({ type: 'error', text: 'Lỗi kết nối máy chủ Stripe.' });
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = { style: { base: { fontSize: '16px', color: '#1f2937', '::placeholder': { color: '#9ca3af' } } }, hidePostalCode: true };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Tên in trên thẻ Stripe</label>
        <input 
            type="text" 
            required 
            value={cardName} 
            onChange={(e) => setCardName(e.target.value.toUpperCase())} 
            placeholder="VD: NGUYEN VAN A" 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none uppercase" 
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Số thẻ mới</label>
        <div className="px-4 py-3.5 border-2 border-gray-200 rounded-xl focus-within:ring-4 focus-within:border-blue-500 bg-white">
          <CardElement options={cardStyle} />
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-800 text-sm">
        <ShieldCheck className="shrink-0" size={18} />
        <p>Thông tin thẻ của bạn được mã hóa an toàn và gửi trực tiếp đến Stripe. Tripify không lưu trữ số thẻ trực tiếp của bạn.</p>
      </div>
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200">Hủy</button>
        <button type="submit" disabled={!stripe || loading} className="flex-[2] py-3 px-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg">
          {loading ? 'Đang xác thực thẻ...' : 'Liên kết thẻ Stripe'}
        </button>
      </div>
    </form>
  );
};

// ==========================================
// PAGE CHÍNH
// ==========================================
const PayoutSettingsPage = () => {
  const { currentUser } = useAuth(); 
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState('none');
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.add-menu-container')) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await ownerService.getPayoutSettings();
        if (res.success && res.data) {
            setPaymentInfo(res.data);
        }
      } catch (error) {
        window.toastRef?.current?.addMessage({ type: 'error', text: 'Không tải được thông tin thanh toán' });
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchSettings();
  }, [currentUser]);

  const handleSaveInfo = async (newData) => {
    try {
        const payload = {
            ...paymentInfo,
            ...newData,
            defaultPayoutMethod: editMode === 'stripe' ? 'STRIPE' : paymentInfo?.defaultPayoutMethod
        };

        const res = await ownerService.updatePayoutSettings(payload);
        if (res.success) {
            setPaymentInfo(res.data);
            setEditMode('none');
            window.toastRef?.current?.addMessage({ type: 'success', text: 'Cập nhật thành công!' });
        }
    } catch (error) {
        window.toastRef?.current?.addMessage({ type: 'error', text: 'Lỗi khi lưu thông tin.' });
    }
  };

  const handleDelete = async (type) => {
    if (!window.confirm(`Bạn có chắc muốn xóa phương thức thanh toán ${type === 'bank' ? 'Ngân hàng' : 'Stripe'} này không?`)) return;
    try {
      const res = await ownerService.deletePayoutMethod(type);
      if (res.success) {
        setPaymentInfo(res.data);
        window.toastRef?.current?.addMessage({ type: 'success', text: 'Đã xóa phương thức thanh toán!' });
      }
    } catch (error) {
      window.toastRef?.current?.addMessage({ type: 'error', text: 'Lỗi khi xóa. Vui lòng thử lại!' });
    }
  };

  const handleSetDefault = async (type) => {
    if (type === 'bank') {
      window.toastRef?.current?.addMessage({ 
        type: 'error', 
        text: 'Chưa hỗ trợ: Hiện tại hệ thống Admin chỉ hỗ trợ thanh toán tự động qua Stripe!' 
      });
      return;
    }

    try {
      const payload = { ...paymentInfo, defaultPayoutMethod: 'STRIPE' };
      const res = await ownerService.updatePayoutSettings(payload);
      if (res.success) {
        setPaymentInfo(res.data);
        window.toastRef?.current?.addMessage({ type: 'success', text: 'Đã cập nhật phương thức mặc định!' });
      }
    } catch (error) {
      window.toastRef?.current?.addMessage({ type: 'error', text: 'Lỗi khi cài đặt mặc định.' });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-gray-50/30 min-h-screen">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .card-flipped { transform: rotateY(180deg); }
      `}</style>

      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cấu hình thanh toán & Rút tiền</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Quản lý phương thức để nhận doanh thu từ Tripify.</p>
          
          {paymentInfo?.defaultPayoutMethod === 'NONE' && (
             <div className="mt-4 bg-orange-50 border border-orange-200 p-3 rounded-lg flex items-center gap-2 text-orange-800 text-sm">
                <AlertCircle size={18} className="shrink-0"/>
                <span>Bạn chưa cài đặt phương thức thanh toán mặc định. Hãy thêm thẻ Stripe để nhận tiền.</span>
             </div>
          )}
        </div>

        <div className="relative add-menu-container">
          <button 
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30"
          >
            <Plus size={20} /> Thêm phương thức
          </button>

          {showAddMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
              <button 
                onClick={() => { setEditMode('bank'); setShowAddMenu(false); }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-semibold text-gray-700 border-b border-gray-50 transition-colors"
              >
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 shrink-0"><Landmark size={18}/></div>
                <div>
                  <p className="text-gray-900">Tài khoản ngân hàng</p>
                  <p className="text-xs text-gray-500 font-normal">{paymentInfo?.accountNumber ? 'Thay đổi tài khoản hiện tại' : 'Nhận tiền mặt trực tiếp'}</p>
                </div>
              </button>
              <button 
                onClick={() => { setEditMode('stripe'); setShowAddMenu(false); }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-semibold text-gray-700 transition-colors"
              >
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0"><CreditCard size={18}/></div>
                <div>
                  <p className="text-gray-900">Thẻ Stripe Connect</p>
                  <p className="text-xs text-gray-500 font-normal">{paymentInfo?.cardLast4 ? 'Liên kết thẻ mới thay thế' : 'Thanh toán quốc tế bảo mật'}</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <SavedBankAccount 
            info={paymentInfo} 
            loading={loading} 
            onEdit={() => setEditMode('bank')} 
            onDelete={() => handleDelete('bank')}
            onSetDefault={() => handleSetDefault('bank')}
        />
        <SavedStripeCard 
            info={paymentInfo} 
            loading={loading} 
            onAdd={() => setEditMode('stripe')} 
            onDelete={() => handleDelete('stripe')}
            onSetDefault={() => handleSetDefault('stripe')}
        />
      </div>

      {editMode === 'bank' && (
        <UpdateBankForm currentInfo={paymentInfo} onSave={handleSaveInfo} onCancel={() => setEditMode('none')} />
      )}

      {editMode === 'stripe' && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-6 animate-fadeIn max-w-2xl">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <CreditCard size={20}/> {paymentInfo?.cardLast4 ? "Sửa đổi thẻ Stripe" : "Thêm thẻ Stripe mới"}
            </h3>
            <button onClick={() => setEditMode('none')} className="p-2 rounded-full bg-gray-50 hover:bg-gray-100"><ChevronUp size={20}/></button>
          </div>

          {/* THÊM BANNER CẢNH BÁO Ở ĐÂY NẾU ĐÃ CÓ THẺ STRIPE */}
          {paymentInfo?.cardLast4 && (
            <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-amber-800 text-sm">
              <AlertTriangle className="shrink-0 mt-0.5" size={18} />
              <p><strong>Lưu ý:</strong> Hệ thống chỉ hỗ trợ 1 thẻ Stripe duy nhất. Việc liên kết thẻ mới ở đây sẽ <strong>thay thế</strong> thẻ đuôi <strong>{paymentInfo.cardLast4}</strong> hiện tại của bạn.</p>
            </div>
          )}

          <Elements stripe={stripePromise}>
            <StripeFormInner onSave={handleSaveInfo} onCancel={() => setEditMode('none')} />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default PayoutSettingsPage;