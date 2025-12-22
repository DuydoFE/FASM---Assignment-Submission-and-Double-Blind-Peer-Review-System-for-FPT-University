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
    // Check file type
    if (!file.type.startsWith('image/')) {
      message.error('Please select an image file!');
      return false;
    }

    // Check size (2MB for avatar)
    if (file.size > 2 * 1024 * 1024) {
      message.error('Avatar must not exceed 2MB!');
      return false;
    }

    try {
      // Upload to Cloudinary with a separate folder for avatar
      const url = await uploadImage(file, { 
        folder: 'avatars',
        tags: 'user-avatar'
      });
      
      message.success('Avatar updated successfully!');
      setAvatarUrl(url);
      
      // Return URL to parent component
      if (onAvatarChanged) {
        onAvatarChanged(url);
      }

    } catch (error) {
      message.error(`Upload failed: ${error.message}`);
    }

    // Prevent Ant Design from uploading automatically
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