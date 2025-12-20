import React, { useState } from 'react';
import { Button, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useCloudinaryUpload from '../assets/hook/useCloudinaryUpload';

/**
 * Component upload hình ảnh đơn giản - chỉ trả về URL
 * @param {Object} props
 * @param {Function} props.onImageUploaded - Callback nhận URL khi upload xong
 * @param {string} props.buttonText - Text hiển thị trên button
 * @param {string} props.folder - Thư mục lưu trên Cloudinary
 * @returns {JSX.Element}
 */
const SimpleImageUpload = ({ 
  onImageUploaded, 
  buttonText = 'Chọn hình ảnh',
  folder = 'uploads' 
}) => {
  const { uploadImage, uploading } = useCloudinaryUpload();
  const [fileInputRef] = useState(React.createRef());

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chọn file hình ảnh!');
      return;
    }

    // Kiểm tra kích thước (5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('File không được vượt quá 5MB!');
      return;
    }

    try {
      // Upload lên Cloudinary
      const url = await uploadImage(file, { folder });
      
      message.success('Upload thành công!');
      
      // Trả URL về component cha
      if (onImageUploaded) {
        onImageUploaded(url);
      }

      // Reset input
      event.target.value = '';
      
    } catch (error) {
      message.error(`Upload thất bại: ${error.message}`);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      <Button
        icon={uploading ? <Spin size="small" /> : <UploadOutlined />}
        onClick={() => fileInputRef.current?.click()}
        loading={uploading}
        disabled={uploading}
      >
        {uploading ? 'Đang upload...' : buttonText}
      </Button>
    </div>
  );
};

export default SimpleImageUpload;