import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, MapPin, Send, Twitter, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#", color: "hover:bg-[#1877F2]" },
    { icon: <Instagram size={20} />, href: "#", color: "hover:bg-[#E4405F]" },
    { icon: <Twitter size={20} />, href: "#", color: "hover:bg-[#1DA1F2]" },
    { icon: <Youtube size={20} />, href: "#", color: "hover:bg-[#FF0000]" },
  ];

  const footerLinks = {
    about: [
      { label: t('common.home'), to: "/" },
      { label: t('common.promotions'), to: "/promotions" },
      { label: t('common.support'), to: "/help" },
      { label: t('common.contact'), to: "/contact" },
    ],
    support: [
      { label: t('common.help_center'), to: "/help" },
      { label: t('common.partner_with_us'), to: "/partner-with-us" },
    ]
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#006494] to-[#004e7c] text-white mt-20 pt-16 overflow-hidden">
      {/* Họa tiết nền trang trí */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-[rgb(40,169,224)] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* === PHẦN TRÊN: NEWSLETTER & LOGO === */}
        <div className="grid lg:grid-cols-2 gap-10 border-b border-white/10 pb-10 mb-10">
          <div>
             <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-extrabold tracking-tight">
                    Travel<span className="text-[rgb(40,169,224)]">Mate</span>
                </span>
             </div>
             <p className="text-blue-100 max-w-md text-sm leading-relaxed">
               {t('common.footer_desc')}
             </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
             <h4 className="font-bold text-lg mb-2">Newsletter</h4>
             <p className="text-sm text-blue-100 mb-4">Subscribe for exclusive offers up to 50% off.</p>
             <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email..." 
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[rgb(40,169,224)] transition-all"
                />
                <button className="bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg flex items-center gap-2">
                   <Send size={16} /> <span className="hidden sm:inline">Subscribe</span>
                </button>
             </div>
          </div>
        </div>

        {/* === PHẦN GIỮA: LINKS === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Cột 1: Liên hệ */}
          <div>
            <h4 className="font-bold text-lg mb-5 border-l-4 border-[rgb(40,169,224)] pl-3">{t('common.contact_info')}</h4>
            <ul className="space-y-4 text-sm text-white">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-[rgb(40,169,224)] shrink-0" />
                <span>Bitexco Building, District 1, Ho Chi Minh City, Vietnam</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[rgb(40,169,224)] shrink-0" />
                <span className="cursor-pointer transition-colors hover:text-[rgb(40,169,224)] hover:underline decoration-[rgb(40,169,224)]">
                    1900 1234
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[rgb(40,169,224)] shrink-0" />
                <span className="cursor-pointer transition-colors hover:text-[rgb(40,169,224)] hover:underline decoration-[rgb(40,169,224)]">
                    support@Tripify.vn
                </span>
              </li>
            </ul>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h4 className="font-bold text-lg mb-5 border-l-4 border-[rgb(40,169,224)] pl-3">{t('common.quick_links')}</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.about.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="text-white hover:text-[rgb(40,169,224)] hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h4 className="font-bold text-lg mb-5 border-l-4 border-[rgb(40,169,224)] pl-3">{t('common.support')}</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.support.map((link, index) => (
                 <li key={index}>
                  <Link 
                    to={link.to} 
                    className="text-white hover:text-[rgb(40,169,224)] hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Mạng xã hội & Chứng nhận */}
          <div>
            <h4 className="font-bold text-lg mb-5 border-l-4 border-[rgb(40,169,224)] pl-3">Social</h4>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.href} 
                  className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 ${item.color} hover:scale-110 hover:shadow-lg text-white`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* === BOTTOM BAR === */}
      <div className="bg-[#003b5c] py-4">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-200">
            <p>© {new Date().getFullYear()} Tripify. {t('common.all_rights_reserved')}</p>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
