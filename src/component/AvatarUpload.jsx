import React, { useState } from 'react';
import { Avatar, Button, message, Spin, Upload } from 'antd';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import useCloudinaryUpload from '../assets/hook/useCloudinaryUpload';

const AvatarUpload = ({ 
  currentAvatar, 
  onAvatarChanged,
  size = 120 
}) => {
  const { uploadImage, uploading } = useCloudinaryUpload();
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar || '');

  const handleFileSelect = async (file) => {
    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chọn file hình ảnh!');
      return false;
    }

    // Kiểm tra kích thước (2MB cho avatar)
    if (file.size > 2 * 1024 * 1024) {
      message.error('Avatar không được vượt quá 2MB!');
      return false;
    }

    try {
      // Upload lên Cloudinary với folder riêng cho avatar
      const url = await uploadImage(file, { 
        folder: 'avatars',
        tags: 'user-avatar'
      });
      
      message.success('Cập nhật avatar thành công!');
      setAvatarUrl(url);
      
      // Trả URL về component cha
      if (onAvatarChanged) {
        onAvatarChanged(url);
      }

    } catch (error) {
      message.error(`Upload thất bại: ${error.message}`);
    }

    // Ngăn Ant Design upload tự động
    return false;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Avatar Preview */}
        <Avatar 
          size={size} 
          src={avatarUrl}
          icon={!avatarUrl && <UserOutlined />}
          style={{ 
            border: '3px solid #f0f0f0',
            cursor: 'pointer'
          }}
        />
        
        {/* Upload Button Overlay */}
        <Upload
          beforeUpload={handleFileSelect}
          showUploadList={false}
          accept="image/*"
        >
          <Button
            type="primary"
            shape="circle"
            icon={uploading ? <Spin size="small" /> : <CameraOutlined />}
            loading={uploading}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}
          />
        </Upload>
      </div>
      
      <div style={{ marginTop: 10, color: '#999', fontSize: 12 }}>
        {uploading ? 'Uploading...' : 'Click camera icon to change'}
      </div>
    </div>
  );
};

export default AvatarUpload;