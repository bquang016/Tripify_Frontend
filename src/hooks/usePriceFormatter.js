import { useLanguage } from "../context/LanguageContext";
import { formatPrice as formatPriceUtil, formatCurrency as formatCurrencyUtil } from "../utils/priceUtils";

export const usePriceFormatter = () => {
  const { currency } = useLanguage();

  const formatPrice = (amount, convertedAmount, itemCurrency) => {
    return formatPriceUtil(amount, convertedAmount, itemCurrency || currency);
  };

  const formatCurrency = (amount, itemCurrency) => {
    return formatCurrencyUtil(amount, itemCurrency || currency);
  };

  return { formatPrice, formatCurrency, currency };
};
