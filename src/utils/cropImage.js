// src/utils/cropImage.js

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Cần thiết để tránh lỗi CORS
    image.src = url;
  });

/**
 * Hàm cắt ảnh dựa trên vùng pixel đã chọn
 */
export default async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // Set kích thước canvas bằng kích thước vùng cắt
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Vẽ ảnh lên canvas tại vị trí đã crop
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Chuyển canvas thành Blob (file ảnh)
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      // Gán đè thuộc tính name để giống File object
      blob.name = "cropped_avatar.jpg";
      resolve(blob);
    }, "image/jpeg", 0.95); // Chất lượng ảnh 95%
  });
}