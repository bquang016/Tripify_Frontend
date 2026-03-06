// src/layouts/CustomerLayout/Header.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, HelpCircle, Phone, Menu } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/user.service";
import Button from "../../components/common/Button/Button";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";
import Avatar from "../../components/common/Avatar/Avatar";
import CustomerProfileDropdown from "./CustomerProfileDropdown";
import CustomerNotificationDropdown from "./CustomerNotificationDropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, hasRole, updateUser } = useAuth();

  const [supportOpen, setSupportOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [headerAvatar, setHeaderAvatar] = useState(currentUser?.profilePhotoUrl);

  const supportRef = useRef(null);
  const profileRef = useRef(null);

  // --- 1. LẤY AVATAR (GIỮ NGUYÊN) ---
  useEffect(() => {
    const fetchFreshAvatar = async () => {
      if (currentUser) {
        try {
          const data = await userService.getUserDetail();
          if (data && data.profilePhotoUrl) {
            setHeaderAvatar(data.profilePhotoUrl);
            if (data.profilePhotoUrl !== currentUser.profilePhotoUrl) {
              updateUser({ profilePhotoUrl: data.profilePhotoUrl });
            }
          }
        } catch (error) {
          console.error("Failed to fetch header avatar:", error);
        }
      }
    };
    fetchFreshAvatar();
  }, [currentUser?.userId]);

  useEffect(() => {
    setHeaderAvatar(currentUser?.profilePhotoUrl);
  }, [currentUser?.profilePhotoUrl]);

  // --- CLICK OUTSIDE (GIỮ NGUYÊN) ---
  useEffect(() => {
    const handler = (e) => {
      if (
        !supportRef.current?.contains(e.target) &&
        !profileRef.current?.contains(e.target)
      ) {
        setSupportOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // --- ✅ TỐI ƯU SCROLL (FIX LAG) ---
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      // Dùng ngưỡng 50px để chắc chắn qua khỏi vùng Hero text một chút mới đổi màu
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LOGIC XỬ LÝ (GIỮ NGUYÊN) ---
  const handleConfirmLogout = () => {
    logout();
    setProfileOpen(false);
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const getPartnerNavigation = () => {
    if (!currentUser) return { label: "Hợp tác với chúng tôi", path: "/partner-with-us" };
    if (currentUser.isSuper || hasRole("ADMIN")) return { label: "Trang quản trị admin", path: "/admin" };
    if (hasRole("OWNER")) return { label: "Trang quản lý", path: "/owner" };
    return { label: "Hợp tác với chúng tôi", path: "/partner-with-us" };
  };

  const handleAccessOwnerChannel = () => {
    const roleLink = getPartnerNavigation();
    navigate(roleLink.path);
  };

  const handleDropdownClose = (action) => {
    setProfileOpen(false);
    if (action === "LOGOUT_ACTION") {
      setShowLogoutConfirm(true);
    }
  };

  // --- STYLE CONFIGURATION (TÍNH TOÁN) ---
  const isHomePage = location.pathname === "/";
  const isTransparent = isHomePage && !scrolled;

  // Class màu sắc (Dùng useMemo để tránh tính toán lại không cần thiết)
  const headerStyles = useMemo(() => {
    if (isTransparent) {
      return {
        container: "bg-transparent border-transparent",
        text: "text-white hover:text-blue-100",
        icon: "text-white",
        logo: "brightness-0 invert drop-shadow-md", // Logo trắng
        buttonGhost: "text-white hover:bg-white/20 border-white/40",
        profileBtn: "bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md"
      };
    } else {
      return {
        container: "bg-white/95 backdrop-blur-md shadow-sm border-gray-100",
        text: "text-slate-700 hover:text-blue-600",
        icon: "text-slate-600",
        logo: "", // Logo gốc
        buttonGhost: "text-slate-600 hover:bg-slate-100 border-slate-200",
        profileBtn: "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-200"
      };
    }
  }, [isTransparent]);

  return (
    <>
      <header
        // ✅ FIX LAG: Bỏ transition padding (luôn py-4), chỉ transition màu nền
        className={`fixed top-0 w-full z-50 py-4 border-b transition-colors duration-300 ease-in-out ${headerStyles.container}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

          {/* 1. LOGO */}
          <Link to="/" className="flex items-center gap-2 group relative z-10">
            <img
              src="src/assets/logo/logo_tripify_xoafont.png"
              alt="Tripify"
              style={{ width: "135px", height: "auto" }}
              className={`object-contain transition-all duration-300 ${headerStyles.logo}`}
            />
          </Link>

          {/* 2. MID NAV (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`text-[15px] font-bold tracking-wide transition-colors ${headerStyles.text} ${location.pathname === '/' ? 'opacity-100' : 'opacity-90'}`}
            >
              {t('common.home')}
            </Link>
            <Link
              to="/promotions"
              className={`text-[15px] font-bold tracking-wide transition-colors ${headerStyles.text} ${location.pathname === '/promotions' ? 'opacity-100' : 'opacity-90'}`}
            >
              {t('common.promotions')}
            </Link>

            <div className="relative" ref={supportRef}>
              <button
                onClick={() => setSupportOpen(!supportOpen)}
                className={`flex items-center gap-1.5 text-[15px] font-bold tracking-wide transition-colors ${headerStyles.text} opacity-90 hover:opacity-100`}
              >
                {t('common.support')} <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-300 ${supportOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Support Dropdown */}
              {supportOpen && (
                <div className="absolute top-full left-0 mt-4 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 animate-fade-in-up origin-top-left">
                  <Link
                    to="/help"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all"
                    onClick={() => setSupportOpen(false)}
                  >
                    <HelpCircle size={18} /> Trung tâm trợ giúp
                  </Link>
                  <Link
                    to="/about#contact"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all"
                    onClick={() => setSupportOpen(false)}
                  >
                    <Phone size={18} /> Liên hệ hỗ trợ
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* 3. RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-3 md:gap-5">

            {/* Partner Button */}
            <div className="hidden lg:block">
              <Button
                variant="ghost"
                onClick={handleAccessOwnerChannel}
                className={`text-sm font-bold px-5 py-2.5 rounded-full border transition-all hover:shadow-sm ${headerStyles.buttonGhost}`}
              >
                {getPartnerNavigation().label}
              </Button>
            </div>

            {!currentUser ? (
              <div className="flex items-center gap-3">
                <div className={`h-6 w-[1px] mx-1 hidden lg:block ${isTransparent ? "bg-white/30" : "bg-slate-200"}`}></div>

                <Button
                  variant="ghost"
                  onClick={() => navigate("/register")}
                  className={`hidden lg:flex text-sm font-bold transition-all ${isTransparent ? "text-white hover:bg-white/10" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Đăng ký
                </Button>

                <Button
                  onClick={() => navigate("/login")}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20 px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 border-none"
                >
                  Đăng nhập
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Language Switcher */}
                <div className="hidden md:block">
                  <LanguageSwitcher navLinkClass={`flex items-center gap-1 text-[13px] font-bold px-3 py-1.5 rounded-full border transition-all ${headerStyles.buttonGhost}`} />
                </div>

                {/* ✅ FIX ICON ẨN: Wrapper này dùng CSS selector cực mạnh [&_*] và !important 
                   để ép màu cho icon chuông bên trong Dropdown
                */}
                <div
                  className={`relative transition-colors duration-300 
                            [&_.notification-trigger]:!text-current
                            [&_.notification-trigger_svg]:!text-current
                            ${headerStyles.icon}`}
                >
                  <CustomerNotificationDropdown />
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all duration-300 shadow-sm ${headerStyles.profileBtn}`}
                  >
                    <Avatar
                      src={headerAvatar}
                      name={currentUser.fullName}
                      size={34}
                      className="border-2 border-white ring-1 ring-black/5"
                    />
                    <span className="text-sm font-bold max-w-[100px] truncate hidden md:block">
                      {currentUser.fullName?.split(" ").pop()}
                    </span>
                    <ChevronDown size={14} strokeWidth={3} className={`opacity-80 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute top-full right-0 mt-4 w-72 animate-fade-in-up origin-top-right z-50">
                      <CustomerProfileDropdown onClose={handleDropdownClose} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button className={`lg:hidden p-2 rounded-lg transition-colors ${isTransparent ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"}`}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <ConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất?"
        type="danger"
        confirmText="Đăng xuất"
        cancelText="Hủy"
      />
    </>
  );
};

export default Header;