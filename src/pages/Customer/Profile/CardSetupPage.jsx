import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import paymentService from '../../../services/payment.service';
import { ShieldCheck, CreditCard, User, Lock, CheckCircle2, XCircle, AlertTriangle, Trash2, Plus, ChevronUp } from 'lucide-react';
import AccountMenu from './AccountMenu'; 
import { useAuth } from '../../../context/AuthContext'; 

// Khởi tạo Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// --- Component Liệt Kê Danh Sách Thẻ ---
const SavedCardsList = ({ cards, loadingCards, onDeleteCard }) => {
  // State lưu trạng thái lật thẻ khi click (dành cho mobile)
  const [flippedCards, setFlippedCards] = useState({});

  const handleFlip = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getCardBrandLogo = (brand) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return "https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg";
      case 'mastercard': return "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg";
      case 'jcb': return "https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg";
      default: return null;
    }
  };

  const getCardBackground = (brand) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return "from-blue-600 to-indigo-900";
      case 'mastercard': return "from-gray-800 to-black";
      default: return "from-slate-600 to-slate-800";
    }
  };

  if (loadingCards) return (
    <div className="animate-pulse flex space-x-4 mb-6">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-48 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );

  if (cards.length === 0) return (
    <div className="text-center py-10 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl mb-8">
      <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
         <CreditCard size={28} className="text-gray-400" />
      </div>
      <h3 className="text-gray-700 font-semibold text-lg">Chưa có phương thức thanh toán</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">Thêm thẻ tín dụng hoặc ghi nợ để thanh toán nhanh chóng hơn ở các lần đặt phòng tiếp theo.</p>
    </div>
  );

  return (
    <div className="mb-10">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { 
          transform-style: preserve-3d; 
          transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1); 
        }
        .backface-hidden { 
          backface-visibility: hidden; 
          -webkit-backface-visibility: hidden; 
        }
        .card-back { transform: rotateY(180deg); }
        .group:hover .preserve-3d, .flipped .preserve-3d { transform: rotateY(180deg); }
      `}</style>

      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        Thẻ đã lưu <span className="bg-blue-100 text-blue-600 text-xs py-0.5 px-2 rounded-full">{cards.length}</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((item, index) => {
          const isFlipped = flippedCards[item.id] || false;
          
          // Lấy đúng tên biến do Spring Boot Jackson trả về (camelCase)
          const expMonth = item.card?.expMonth || item.card?.exp_month || '00';
          const expYear = item.card?.expYear || item.card?.exp_year || '0000';
          const cardHolderName = item.billingDetails?.name || item.billing_details?.name || 'KHÁCH HÀNG';
          const brand = item.card?.brand;
          const last4 = item.card?.last4;

          return (
            <div 
              key={item.id} 
              className={`group relative w-full h-48 perspective-1000 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleFlip(item.id)}
            >
              
              <div className="w-full h-full preserve-3d relative shadow-lg rounded-2xl">
                
                {/* ================= MẶT TRƯỚC ================= */}
                <div className={`absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-br ${getCardBackground(brand)} p-5 flex flex-col justify-between overflow-hidden`}>
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-5"></div>
                  <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-5"></div>

                  <div className="flex justify-between items-start z-10">
                    <div className="w-10 h-8 rounded bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-80 flex flex-col justify-between p-1">
                       <div className="border-b border-black/20 h-1/3"></div>
                       <div className="border-b border-black/20 h-1/3"></div>
                    </div>
                    {index === 0 && (
                      <span className="text-[10px] uppercase font-bold bg-white/20 text-white px-2 py-1 rounded backdrop-blur-md border border-white/20 shadow-sm">Mặc định</span>
                    )}
                  </div>

                  <div className="z-10">
                    <p className="font-mono text-xl tracking-[0.2em] text-white/90 mb-3 drop-shadow-md">
                      •••• •••• •••• {last4}
                    </p>
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-[9px] uppercase text-white/60 tracking-wider mb-0.5">Thương hiệu</p>
                          <div className="bg-white/90 p-1.5 rounded w-12 h-7 flex items-center justify-center shadow-sm">
                            {getCardBrandLogo(brand) ? (
                              <img src={getCardBrandLogo(brand)} alt={brand} className="max-h-full max-w-full" />
                            ) : (
                              <span className="text-black text-xs font-bold uppercase">{brand}</span>
                            )}
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* ================= MẶT SAU ================= */}
                <div className="card-back absolute w-full h-full backface-hidden rounded-2xl bg-gray-800 flex flex-col overflow-hidden border border-gray-700 shadow-lg">
                  <div className="w-full h-10 bg-black mt-4 opacity-80"></div>
                  
                  <div className="px-5 py-4 flex-1 flex flex-col justify-between">
                     <div className="flex items-center gap-2">
                       <div className="bg-gray-200 h-8 flex-1 flex items-center px-3 justify-end rounded-sm">
                          <span className="font-mono text-sm italic text-gray-500">•••</span>
                       </div>
                       <p className="text-[9px] text-white/50 w-8">CVC</p>
                     </div>
                     
                     <div className="flex justify-between items-end pb-2">
                        <div className="max-w-[70%]">
                          <p className="text-[9px] uppercase text-white/50 tracking-wider mb-0.5">Tên chủ thẻ</p>
                          <p className="text-white text-sm font-medium uppercase truncate" title={cardHolderName}>
                            {cardHolderName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] uppercase text-white/50 tracking-wider mb-0.5">Hết hạn</p>
                          <p className="text-white text-sm font-medium">
                            {String(expMonth).padStart(2, '0')}/{String(expYear).slice(-2)}
                          </p>
                        </div>
                     </div>
                  </div>
                </div>

              </div>

              {/* Nút Xoá */}
              <button 
                className="absolute -top-3 -right-3 bg-red-500 text-white hover:bg-red-600 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20 transform scale-75 group-hover:scale-100"
                onClick={(e) => {
                  e.stopPropagation(); 
                  onDeleteCard(item.id, last4); // Gọi hàm xóa từ prop truyền vào
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Component Form Nhập Thẻ ---
const CardSetupForm = ({ onCardAdded, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState('');
  
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));
  const showModal = (type, message) => setModalState({ isOpen: true, type, message });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!cardName.trim()) {
      showModal('warning', 'Vui lòng nhập tên in trên thẻ!');
      return;
    }

    setLoading(true);
    try {
      const response = await paymentService.createStripeSetupIntent();
      const clientSecret = response.data.clientSecret;
      const cardElement = elements.getElement(CardElement);

      const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: cardName }
        }
      });

      if (error) {
        showModal('error', `Lỗi: ${error.message}`);
      } else if (setupIntent && setupIntent.status === 'succeeded') {
        showModal('success', 'Thêm phương thức thanh toán thành công!');
        cardElement.clear();
        setCardName('');
        if(onCardAdded) onCardAdded();
      }
    } catch (error) {
      console.error("Setup Intent Error:", error);
      showModal('error', 'Có lỗi xảy ra khi kết nối máy chủ thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    style: {
      base: { iconColor: '#28A9E0', color: '#1f2937', fontWeight: '500', fontFamily: 'Inter', fontSize: '16px', '::placeholder': { color: '#9ca3af' } },
      invalid: { iconColor: '#ef4444', color: '#ef4444' },
    }, hidePostalCode: true,
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 mt-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Thêm thẻ mới</h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <Lock size={12} className="text-green-500"/>
            Thông tin được mã hoá bảo mật bởi Stripe
          </p>
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-800 transition-colors bg-gray-50 p-2 rounded-full hover:bg-gray-100">
          <ChevronUp size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tên in trên thẻ</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User size={16} className="text-gray-400" />
            </div>
            <input type="text" placeholder="NGUYEN VAN A" value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[rgb(40,169,224)] focus:border-transparent transition-all uppercase placeholder:normal-case outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Số thẻ, Ngày hết hạn & CVC</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                <CreditCard size={16} className="text-gray-400" />
              </div>
            <div className="pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-[rgb(40,169,224)] focus-within:border-transparent focus-within:bg-white transition-all shadow-sm relative">
              <CardElement options={cardStyle} />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-100 mt-6">
          <button type="button" onClick={onCancel} className="flex-1 py-3.5 px-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all">
            Hủy bỏ
          </button>
          <button type="submit" disabled={!stripe || loading} className="flex-[2] py-3.5 px-4 flex items-center justify-center gap-2 bg-[rgb(40,169,224)] hover:bg-[#208ab8] text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <span>Đang xác thực...</span> : <><ShieldCheck size={18} />Lưu thẻ an toàn</>}
          </button>
        </div>
      </form>

      {/* Modal Thông báo (trong form) */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-scale-up">
            <div className={`p-6 text-center ${modalState.type === 'success' ? 'bg-green-50' : modalState.type === 'error' ? 'bg-red-50' : 'bg-yellow-50'}`}>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-sm mb-4">
                {modalState.type === 'success' && <CheckCircle2 size={32} className="text-green-500" />}
                {modalState.type === 'error' && <XCircle size={32} className="text-red-500" />}
                {modalState.type === 'warning' && <AlertTriangle size={32} className="text-yellow-500" />}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{modalState.type === 'success' ? 'Thành công!' : modalState.type === 'error' ? 'Thất bại!' : 'Lưu ý!'}</h3>
              <p className="text-gray-600 mb-6">{modalState.message}</p>
              <button onClick={closeModal} className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-colors ${modalState.type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Page Layout Wrapper ---
const CardSetupPage = () => {
  const { currentUser } = useAuth(); 
  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State quản lý Modal thông báo chung của trang (ví dụ khi xoá thẻ thành công)
  const [pageModalState, setPageModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const closePageModal = () => setPageModalState(prev => ({ ...prev, isOpen: false }));
  const showPageModal = (type, message) => setPageModalState({ isOpen: true, type, message });

  const fetchCards = async () => {
    setLoadingCards(true);
    try {
      const res = await paymentService.getSavedCards();
      setCards(res.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách thẻ:", error);
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleCardAdded = () => {
    fetchCards();
    setShowAddForm(false);
  };

  // --- HÀM XOÁ THẺ ---
  const handleDeleteCard = async (paymentMethodId, last4) => {
    if (window.confirm(`Bạn có chắc chắn muốn gỡ bỏ thẻ đuôi ${last4} khỏi hệ thống không?`)) {
      try {
        await paymentService.deleteSavedCard(paymentMethodId);
        showPageModal('success', `Đã gỡ bỏ thẻ đuôi ${last4} thành công.`);
        fetchCards(); // Cập nhật lại danh sách thẻ
      } catch (error) {
        console.error("Lỗi xoá thẻ:", error);
        showPageModal('error', 'Có lỗi xảy ra khi xoá thẻ. Vui lòng thử lại sau.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in bg-gray-50/30 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <AccountMenu activeSection="payment-methods" userData={currentUser} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý thanh toán</h1>
            <p className="text-gray-500 mt-2 text-sm">Thêm thẻ để thanh toán tự động, an toàn và nhanh chóng cho các chuyến đi của bạn.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 relative">
            
            {/* DANH SÁCH THẺ (Truyền thêm hàm onDeleteCard) */}
            <SavedCardsList cards={cards} loadingCards={loadingCards} onDeleteCard={handleDeleteCard} />

            {/* NÚT THÊM THẺ HOẶC FORM */}
            {!showAddForm ? (
              <button 
                onClick={() => setShowAddForm(true)}
                className="w-full flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all group"
              >
                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <Plus size={24} className="text-blue-600" />
                </div>
                <span className="font-bold text-lg">Thêm thẻ thanh toán mới</span>
              </button>
            ) : (
              <Elements stripe={stripePromise}>
                <CardSetupForm onCardAdded={handleCardAdded} onCancel={() => setShowAddForm(false)} />
              </Elements>
            )}

            {/* Box Thông tin bảo mật */}
            <div className="mt-12 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between">
               <div className="flex-1 flex gap-4 items-start">
                  <ShieldCheck size={32} className="text-green-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Thanh toán an toàn 100%</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Toàn bộ dữ liệu thẻ của bạn được mã hoá theo chuẩn quốc tế PCI-DSS. Tripify không lưu trữ số thẻ thật của bạn trên hệ thống.
                    </p>
                  </div>
               </div>
               <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex-shrink-0">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg" alt="Visa" className="h-5" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-7" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg" alt="JCB" className="h-7" />
               </div>
            </div>

            {/* Modal Thông báo chung (Dùng khi xóa thẻ) */}
            {pageModalState.isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-scale-up">
                  <div className={`p-6 text-center ${pageModalState.type === 'success' ? 'bg-green-50' : pageModalState.type === 'error' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-sm mb-4">
                      {pageModalState.type === 'success' && <CheckCircle2 size={32} className="text-green-500" />}
                      {pageModalState.type === 'error' && <XCircle size={32} className="text-red-500" />}
                      {pageModalState.type === 'warning' && <AlertTriangle size={32} className="text-yellow-500" />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {pageModalState.type === 'success' ? 'Thành công!' : pageModalState.type === 'error' ? 'Thất bại!' : 'Lưu ý!'}
                    </h3>
                    <p className="text-gray-600 mb-6">{pageModalState.message}</p>
                    <button onClick={closePageModal} className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-colors ${pageModalState.type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSetupPage;
