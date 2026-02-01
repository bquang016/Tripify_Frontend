import React from "react";
import { Send } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-16 md:px-16 text-center md:text-left">
        
        {/* Background Circles Decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Đừng bỏ lỡ ưu đãi khủng!
            </h2>
            <p className="text-blue-100 text-lg">
              Đăng ký nhận bản tin để là người đầu tiên nhận mã giảm giá 50% và các gợi ý du lịch độc quyền.
            </p>
          </div>

          <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 flex pl-6">
            <input 
              type="email" 
              placeholder="Nhập email của bạn..." 
              className="w-full bg-transparent border-none outline-none text-white placeholder-blue-200"
            />
            <button className="bg-white text-blue-900 hover:bg-blue-50 font-bold py-3 px-8 rounded-full transition-all flex items-center gap-2 shadow-lg">
              Đăng ký <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;