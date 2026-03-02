/**
 * Extracts a user-friendly error message from an API error response.
 * Backend now provides localized 'message' fields for all responses.
 * 
 * @param {any} error - The error object from axios or a service call.
 * @param {string} fallback - The fallback message if no message is found.
 * @returns {string} The extracted error message.
 */
export const extractErrorMessage = (error, fallback = "Đã có lỗi xảy ra. Vui lòng thử lại.") => {
  if (!error) return fallback;

  if (error.response && error.response.data) {
    const data = error.response.data;
    // Prioritize the localized message field from Backend
    return data.message || data.error || data.msg || fallback;
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
};
