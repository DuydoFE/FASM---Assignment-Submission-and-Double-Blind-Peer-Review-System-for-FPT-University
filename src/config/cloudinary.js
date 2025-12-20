// Cấu hình Cloudinary
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY, // Optional - chỉ cần nếu signed upload
};

// URL API để upload
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;

// Hàm kiểm tra cấu hình
export const validateCloudinaryConfig = () => {
  if (!cloudinaryConfig.cloudName) {
    throw new Error('VITE_CLOUDINARY_CLOUD_NAME chưa được cấu hình trong file .env');
  }
  if (!cloudinaryConfig.uploadPreset) {
    throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET chưa được cấu hình trong file .env');
  }
  return true;
};