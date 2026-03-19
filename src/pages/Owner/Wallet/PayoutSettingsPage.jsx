import React, { useState, useEffect } from 'react';
import { Landmark, ShieldCheck, User, Building, Hash, CheckCircle2, XCircle, AlertTriangle, Edit3, ChevronUp, CreditCard } from 'lucide-react';
import paymentService from '../../../services/payment.service';
import { useAuth } from '../../../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Khởi tạo Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// ==========================================
// COMPONENT: THẺ NGÂN HÀNG (BANK ACCOUNT)
// ==========================================
const SavedBankAccount = ({ info, loading, onEdit }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (loading) return <div className="animate-pulse h-56 bg-gray-200 rounded-2xl w-full"></div>;
  if (!info?.accountNumber) return null; // Nếu chưa có thì có thể hiện giao diện Add mới

  const maskedAccount = `•••• •••• •••• ${info.accountNumber.slice(-4)}`;

  return (
    <div className="relative w-full h-56 perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`w-full h-full preserve-3d relative shadow-xl rounded-2xl ${isFlipped ? 'card-flipped' : ''}`}>
        
        {/* MẶT TRƯỚC */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-900 p-6 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-5"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-28 h-28 rounded-full bg-white opacity-5"></div>

          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm border border-white/20">
                <Landmark size={24} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-wide shadow-sm">{info.bankName}</span>
            </div>
            <span className="text-xs font-bold bg-green-400/90 text-emerald-900 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <CheckCircle2 size={12} /> Đang dùng
            </span>
          </div>

          <div className="z-10 mt-6">
            <p className="text-[10px] uppercase text-emerald-200 tracking-widest mb-1 font-semibold">Tài khoản ngân hàng</p>
            <p className="font-mono text-2xl tracking-[0.15em] text-white drop-shadow-md mb-4">{maskedAccount}</p>
            <div>
              <p className="text-[10px] uppercase text-emerald-200 tracking-widest mb-0.5 font-semibold">Chủ tài khoản</p>
              <p className="text-white text-base font-bold uppercase tracking-wider truncate">{info.accountHolderName}</p>
            </div>
          </div>
        </div>

        {/* MẶT SAU */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl bg-slate-800 flex flex-col overflow-hidden border border-slate-700 shadow-xl" style={{ transform: 'rotateY(180deg)' }}>
          <div className="w-full h-12 bg-black/80 mt-6"></div>
          <div className="px-6 py-5 flex-1 flex flex-col justify-center">
              <div className="bg-slate-700 rounded-lg p-3 border border-slate-600 text-center">
                  <p className="text-[10px] text-slate-400 uppercase mb-1">Loại tài khoản</p>
                  <p className="font-mono text-sm text-slate-200 uppercase">Tài khoản thụ hưởng nội địa</p>
              </div>
          </div>
        </div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="absolute -top-3 -right-3 bg-blue-600 text-white hover:bg-blue-700 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20"
      >
        <Edit3 size={18} />
      </button>
    </div>
  );
};

// ==========================================
// COMPONENT: THẺ STRIPE (CREDIT/DEBIT CARD)
// ==========================================
const SavedStripeCard = ({ info, loading, onEdit }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (loading) return <div className="animate-pulse h-56 bg-gray-200 rounded-2xl w-full"></div>;
  if (!info?.cardLast4) return null;

  const getCardBackground = (brand) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return "from-blue-700 to-indigo-900";
      case 'mastercard': return "from-gray-800 to-black";
      default: return "from-slate-700 to-slate-900";
    }
  };

  const getCardBrandLogo = (brand) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return "https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg";
      case 'mastercard': return "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg";
      case 'jcb': return "https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg";
      default: return null;
    }
  };

  return (
    <div className="relative w-full h-56 perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`w-full h-full preserve-3d relative shadow-xl rounded-2xl ${isFlipped ? 'card-flipped' : ''}`}>
        
        {/* MẶT TRƯỚC */}
        <div className={`absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-br ${getCardBackground(info.cardBrand)} p-6 flex flex-col justify-between overflow-hidden`}>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-5"></div>
          
          <div className="flex justify-between items-start z-10">
            <div className="w-12 h-9 rounded bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-90 flex flex-col justify-between p-1.5 shadow-inner">
               <div className="border-b border-black/20 h-1/3"></div>
               <div className="border-b border-black/20 h-1/3"></div>
            </div>
            <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-1 rounded backdrop-blur-md border border-white/20">Thẻ liên kết Stripe</span>
          </div>

          <div className="z-10">
            <p className="font-mono text-2xl tracking-[0.2em] text-white/90 mb-4 drop-shadow-md">
              •••• •••• •••• {info.cardLast4}
            </p>
            <div className="flex justify-between items-end">
               <div>
                 <p className="text-[10px] uppercase text-white/60 tracking-wider mb-0.5">Tên chủ thẻ</p>
                 <p className="text-white text-sm font-bold uppercase truncate max-w-[150px]">{info.accountHolderName}</p>
               </div>
               <div>
                  <div className="bg-white/90 p-1.5 rounded w-14 h-8 flex items-center justify-center shadow-sm">
                    {getCardBrandLogo(info.cardBrand) ? (
                      <img src={getCardBrandLogo(info.cardBrand)} alt={info.cardBrand} className="max-h-full max-w-full" />
                    ) : (
                      <span className="text-black text-xs font-bold uppercase">{info.cardBrand}</span>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* MẶT SAU */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl bg-gray-800 flex flex-col overflow-hidden border border-gray-700 shadow-xl" style={{ transform: 'rotateY(180deg)' }}>
          <div className="w-full h-10 bg-black mt-6 opacity-80"></div>
          <div className="px-6 py-5 flex-1 flex flex-col justify-center">
            <div className="bg-slate-700 rounded-lg p-3 border border-slate-600 text-center">
                <p className="text-[10px] text-slate-400 uppercase mb-1">Stripe Connect ID</p>
                <p className="font-mono text-sm text-slate-200 truncate">{info.stripeAccountId || 'acct_XXXXXXXXX'}</p>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center italic">Được sử dụng cho Stripe Connect Verification.</p>
          </div>
        </div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="absolute -top-3 -right-3 bg-blue-600 text-white hover:bg-blue-700 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20"
      >
        <Edit3 size={18} />
      </button>
    </div>
  );
};


// ==========================================
// FORM SỬA TÀI KHOẢN NGÂN HÀNG
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
    setTimeout(() => { onSave(formData); setLoading(false); }, 1000); // Mock API Call
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Sửa Tài khoản Ngân hàng</h3>
          <p className="text-sm text-gray-500 mt-1">Thông tin này dùng để nhận chuyển khoản doanh thu.</p>
        </div>
        <button onClick={onCancel} className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400"><ChevronUp size={20}/></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ngân hàng</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Building size={18} className="text-gray-400" /></div>
                  <input type="text" required value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Số tài khoản</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Hash size={18} className="text-gray-400" /></div>
                  <input type="text" required value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value.replace(/\D/g, '')})} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none font-mono" />
              </div>
            </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Tên chủ tài khoản</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><User size={18} className="text-gray-400" /></div>
            <input type="text" required value={formData.accountHolderName} onChange={(e) => setFormData({...formData, accountHolderName: e.target.value.toUpperCase()})} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none uppercase font-semibold text-gray-900" />
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
// FORM SỬA THẺ STRIPE (CÓ STRIPE ELEMENTS)
// ==========================================
const StripeFormInner = ({ onCancel, onSave }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      // Logic tương tự bên Khách hàng: Lấy clientSecret từ Backend, rồi gọi confirmCardSetup
      // const res = await paymentService.createStripeSetupIntent();
      // await stripe.confirmCardSetup(res.data.clientSecret, { payment_method: { card: elements.getElement(CardElement), billing_details: { name: cardName } } });
      
      setTimeout(() => {
        onSave({ cardLast4: "1234", cardBrand: "mastercard" }); // Mock data trả về
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const cardStyle = { style: { base: { fontSize: '16px', color: '#1f2937', '::placeholder': { color: '#9ca3af' } } }, hidePostalCode: true };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Tên in trên thẻ Stripe</label>
        <input type="text" required value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} placeholder="NGUYEN VAN A" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none uppercase" />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Số thẻ mới</label>
        <div className="px-4 py-3.5 border-2 border-gray-200 rounded-xl focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-500 bg-white">
          <CardElement options={cardStyle} />
        </div>
      </div>
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <ShieldCheck className="text-blue-600 shrink-0" size={20} />
        <p className="text-sm text-blue-800 leading-relaxed">Thông tin thẻ được mã hóa trực tiếp bởi Stripe theo tiêu chuẩn quốc tế PCI-DSS.</p>
      </div>
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200">Hủy</button>
        <button type="submit" disabled={!stripe || loading} className="flex-[2] py-3 px-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg">
          {loading ? 'Đang xác thực...' : 'Cập nhật thẻ Stripe'}
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
  
  // Trạng thái edit: 'none' | 'bank' | 'stripe'
  const [editMode, setEditMode] = useState('none');

  useEffect(() => {
    setTimeout(() => {
      // Mock data bao gồm cả Ngân hàng và Thẻ
      setPaymentInfo({
        bankName: "Vietcombank",
        accountHolderName: currentUser?.fullName || "NGUYEN VAN DOITAC",
        accountNumber: "10188998899",
        stripeAccountId: currentUser?.stripeAccountId || "acct_1OuXXXXXXX",
        cardBrand: "visa",
        cardLast4: "4242"
      });
      setLoading(false);
    }, 800);
  }, [currentUser]);

  const handleSaveInfo = (newData) => {
    setPaymentInfo(prev => ({...prev, ...newData}));
    setEditMode('none');
    window.toastRef?.current?.addMessage({ type: 'success', text: 'Cập nhật thành công!' });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-gray-50/30 min-h-screen">
      {/* STYLE CHO THẺ 3D */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .card-flipped { transform: rotateY(180deg); }
      `}</style>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cấu hình thanh toán & Rút tiền</h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">Quản lý tài khoản ngân hàng và thẻ Stripe Connect của bạn.</p>
      </div>

      {/* HIỂN THỊ 2 THẺ SONG SONG */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <SavedBankAccount info={paymentInfo} loading={loading} onEdit={() => setEditMode('bank')} />
        <SavedStripeCard info={paymentInfo} loading={loading} onEdit={() => setEditMode('stripe')} />
      </div>

      {/* FORM SỬA DỮ LIỆU */}
      {editMode === 'bank' && (
        <UpdateBankForm currentInfo={paymentInfo} onSave={handleSaveInfo} onCancel={() => setEditMode('none')} />
      )}

      {editMode === 'stripe' && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-6 animate-fadeIn max-w-2xl">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2"><CreditCard size={20}/> Thay đổi thẻ Stripe</h3>
              <p className="text-sm text-gray-500 mt-1">Liên kết thẻ tín dụng/ghi nợ mới cho tài khoản Stripe Connect.</p>
            </div>
            <button onClick={() => setEditMode('none')} className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400"><ChevronUp size={20}/></button>
          </div>
          <Elements stripe={stripePromise}>
            <StripeFormInner onSave={handleSaveInfo} onCancel={() => setEditMode('none')} />
          </Elements>
        </div>
      )}

    </div>
  );
};

export default PayoutSettingsPage;