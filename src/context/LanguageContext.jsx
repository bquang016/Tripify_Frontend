import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n";
import { systemSettingsService } from "../services/systemSettings.service";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "vi");
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "VND");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await systemSettingsService.getSettings();
        const defaultLang = settings?.data?.defaultLanguage || settings?.defaultLanguage || "vi";
        const defaultCurr = settings?.data?.defaultCurrency || settings?.defaultCurrency || "VND";

        // Chỉ set nếu chưa có trong localStorage (ưu tiên preference của user nếu có, nhưng ở đây system default là quan trọng)
        // Hoặc chúng ta có thể luôn đồng bộ với system default nếu muốn
        if (!localStorage.getItem("language")) {
          setLanguage(defaultLang);
          i18n.changeLanguage(defaultLang);
        } else {
          i18n.changeLanguage(language);
        }

        if (!localStorage.getItem("currency")) {
          setCurrency(defaultCurr);
        }
      } catch (error) {
        console.error("Failed to fetch system settings:", error);
        i18n.changeLanguage(language);
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
