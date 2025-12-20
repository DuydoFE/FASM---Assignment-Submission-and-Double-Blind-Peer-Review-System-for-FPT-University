import { useState } from 'react';
import { cloudinaryConfig, CLOUDINARY_UPLOAD_URL, validateCloudinaryConfig } from '../../config/cloudinary';

/**
 * Custom hook để upload hình ảnh lên Cloudinary
 * @returns {Object} - { uploadImage, uploading, progress, error, imageUrl }
 */
const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  /**
   * Upload một file hình ảnh lên Cloudinary
   * @param {File} file - File hình ảnh cần upload
   * @param {Object} options - Tùy chọn upload (folder, transformation, etc.)
   * @returns {Promise<string>} - URL của hình ảnh đã upload
   */
  const uploadImage = async (file, options = {}) => {
    try {
      // Kiểm tra cấu hình
      validateCloudinaryConfig();

      // Reset state
      setUploading(true);
      setProgress(0);
      setError(null);
      setImageUrl(null);

      // Kiểm tra file có phải là hình ảnh không
      if (!file.type.startsWith('image/')) {
        throw new Error('File phải là hình ảnh (jpg, png, gif, etc.)');
      }

      // Tạo FormData để gửi lên Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);
      
      // Thêm các tùy chọn nếu có
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      if (options.tags) {
        formData.append('tags', options.tags);
      }
      if (options.transformation) {
        formData.append('transformation', JSON.stringify(options.transformation));
      }

      // Upload lên Cloudinary với XMLHttpRequest để theo dõi progress
      const url = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Theo dõi tiến trình upload
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setProgress(percentComplete);
          }
        });

        // Xử lý khi upload hoàn tất
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.secure_url);
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        });

        // Xử lý lỗi
        xhr.addEventListener('error', () => {
          reject(new Error('Network error occurred during upload'));
        });

        // Gửi request
        xhr.open('POST', CLOUDINARY_UPLOAD_URL);
        xhr.send(formData);
      });

      setImageUrl(url);
      setUploading(false);
      setProgress(100);
      return url;

    } catch (err) {
      setError(err.message);
      setUploading(false);
      setProgress(0);
      throw err;
    }
  };

  /**
   * Upload nhiều file cùng lúc
   * @param {FileList|Array} files - Danh sách file cần upload
   * @param {Object} options - Tùy chọn upload
   * @returns {Promise<Array<string>>} - Mảng URL của các hình ảnh đã upload
   */
  const uploadMultipleImages = async (files, options = {}) => {
    try {
      setUploading(true);
      setError(null);

      const uploadPromises = Array.from(files).map(file => 
        uploadImage(file, options)
      );

      const urls = await Promise.all(uploadPromises);
      setUploading(false);
      return urls;

    } catch (err) {
      setError(err.message);
      setUploading(false);
      throw err;
    }
  };

  /**
   * Reset state
   */
  const reset = () => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setImageUrl(null);
  };

  return {
    uploadImage,
    uploadMultipleImages,
    uploading,
    progress,
    error,
    imageUrl,
    reset
  };
};

export default useCloudinaryUpload;