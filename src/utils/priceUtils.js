/**
 * Formats a price with a given currency.
 * If a pre-converted price string (e.g., "From $50") is provided, it returns it directly.
 * 
 * @param {number} amount - The original price amount (usually in VND).
 * @param {string|number} convertedAmount - The price already converted by the backend.
 * @param {string} currency - The currency code (e.g., "VND", "USD").
 * @returns {string} The formatted price.
 */
export const formatPrice = (amount, convertedAmount, currency = 'VND') => {
  if (convertedAmount !== undefined && convertedAmount !== null) {
    if (typeof convertedAmount === 'string') {
      return convertedAmount;
    }
    
    try {
      return new Intl.NumberFormat(currency === 'VND' ? 'vi-VN' : 'en-US', {
        style: 'currency',
        currency: currency,
      }).format(convertedAmount);
    } catch (e) {
      return `${currency} ${convertedAmount}`;
    }
  }

  if (amount === undefined || amount === null) {
    return "Liên hệ";
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Formats a currency value based on the currency code.
 */
export const formatCurrency = (amount, currency = 'VND') => {
  try {
    return new Intl.NumberFormat(currency === 'VND' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (e) {
    return `${currency} ${amount}`;
  }
};
