import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n";
import { systemSettingsService } from "../services/systemSettings.service";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Lấy giá trị từ localStorage ngay lập tức để tránh bị delay
  const [language, setLanguage] = useState(localStorage.getItem("language") || "vi");
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "VND");
  const [isLoading, setIsLoading] = useState(true);

  // Đảm bảo i18n được set đúng ngay từ đầu
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await systemSettingsService.getSettings();
        const data = settings?.data || settings?.result || settings;
        
        const defaultLang = data?.defaultLanguage || "vi";
        const defaultCurr = data?.defaultCurrency || "VND";

        // Chỉ áp dụng cấu hình hệ thống nếu người dùng CHƯA TỪNG chọn ngôn ngữ nào
        if (!localStorage.getItem("language")) {
          setLanguage(defaultLang);
          i18n.changeLanguage(defaultLang);
          localStorage.setItem("language", defaultLang);
        }

        if (!localStorage.getItem("currency")) {
          setCurrency(defaultCurr);
          localStorage.setItem("currency", defaultCurr);
        }
      } catch (error) {
        console.error("Failed to fetch system settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

  const changeCurrency = (curr) => {
    setCurrency(curr);
    localStorage.setItem("currency", curr);
  };

  return (
    <LanguageContext.Provider value={{ language, currency, changeLanguage, changeCurrency, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
