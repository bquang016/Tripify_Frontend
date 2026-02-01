import axios from "./axios.config";

// Helper tạo FormData chuẩn cho Backend Spring Boot
const createFormData = (ratingData, files) => {
  const formData = new FormData();

  formData.append(
    "data",
    new Blob([JSON.stringify(ratingData)], { type: "application/json" })
  );

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  return formData;
};

export const createRating = async ({ bookingId, stars, comment, files }) => {
  const ratingPayload = {
    bookingId: bookingId,
    stars: stars,
    comment: comment,
  };

  const formData = createFormData(ratingPayload, files);

  const response = await axios.post("/rating/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateRating = async (ratingId, { stars, comment, files }) => {
  const ratingPayload = {
    bookingId: 0,
    stars: stars,
    comment: comment,
  };

  const formData = createFormData(ratingPayload, files);

  const response = await axios.put(`/rating/update/${ratingId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getRatingByBooking = async (bookingId) => {
  const response = await axios.get(`/rating/booking/${bookingId}`);
  return response.data;
};

export const getRatingsByProperty = async (propertyId, page = 0) => {
  const response = await axios.get(`/rating/property/${propertyId}?page=${page}`);
  return response.data;
};

// --- BỔ SUNG 2 HÀM CÒN THIẾU ---

// Hàm ẩn/hiện đánh giá (Dành cho Admin)
export const hideRating = async (id, hide) => {
  // Method PATCH: /api/v1/rating/hide/{id}?hide=true/false
  const response = await axios.patch(`/rating/hide/${id}?hide=${hide}`);
  return response.data;
};

// Hàm xóa đánh giá (Dành cho Admin hoặc Owner)
export const deleteRating = async (id) => {
  // Method DELETE: /api/v1/rating/delete/{id}
  await axios.delete(`/rating/delete/${id}`);
};

export const pinRating = async (id, pin) => {
  // Method PATCH: /api/v1/rating/pin/{id}?pin=true/false
  const response = await axios.patch(`/rating/pin/${id}?pin=${pin}`);
  return response.data;
};