import React, { useState } from 'react';
import { Upload, message, Progress, Image, Button, Space, Card } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import useCloudinaryUpload from '../assets/hook/useCloudinaryUpload';

const { Dragger } = Upload;

/**
 * Component upload hình ảnh lên Cloudinary
 * @param {Object} props
 * @param {Function} props.onUploadSuccess - Callback khi upload thành công, nhận vào URL
 * @param {string} props.folder - Thư mục trên Cloudinary để lưu ảnh
 * @param {boolean} props.multiple - Cho phép upload nhiều ảnh
 * @returns {JSX.Element}
 */
const CloudinaryImageUpload = ({ 
  onUploadSuccess, 
  folder = 'uploads',
  multiple = false 
}) => {
  const { uploadImage, uploading, progress, error, imageUrl } = useCloudinaryUpload();
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  /**
   * Xử lý khi chọn file
   */
  const handleUpload = async (file) => {
    try {
      // Upload lên Cloudinary
      const url = await uploadImage(file, { 
        folder: folder,
        tags: 'user_upload' // Tag để dễ quản lý trên Cloudinary
      });

      message.success('Upload hình ảnh thành công!');
      
      // Lưu URL vào state
      setUploadedUrls(prev => [...prev, url]);
      setPreviewUrl(url);

      // Callback cho component cha
      if (onUploadSuccess) {
        onUploadSuccess(url);
      }

    } catch (err) {
      message.error(`Upload thất bại: ${err.message}`);
    }

    // Ngăn Ant Design upload tự động
    return false;
  };

  /**
   * Xóa ảnh đã upload
   */
  const handleRemove = (url) => {
    setUploadedUrls(prev => prev.filter(item => item !== url));
    if (previewUrl === url) {
      setPreviewUrl(null);
    }
  };

  /**
   * Kiểm tra file trước khi upload
   */
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Bạn chỉ có thể upload file hình ảnh!');
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Hình ảnh phải nhỏ hơn 5MB!');
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Card title="Upload Hình Ảnh lên Cloudinary">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          {/* Upload Area */}
          <Dragger
            name="file"
            multiple={multiple}
            beforeUpload={beforeUpload}
            customRequest={({ file }) => handleUpload(file)}
            showUploadList={false}
            disabled={uploading}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Nhấp hoặc kéo thả file vào đây để upload
            </p>
            <p className="ant-upload-hint">
              Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 5MB)
            </p>
          </Dragger>

          {/* Progress Bar */}
          {uploading && (
            <div>
              <p>Đang upload...</p>
              <Progress percent={progress} status="active" />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{ color: 'red' }}>
              Lỗi: {error}
            </div>
          )}

          {/* Preview và danh sách ảnh đã upload */}
          {uploadedUrls.length > 0 && (
            <div>
              <h4>Hình ảnh đã upload:</h4>
              <Space wrap>
                {uploadedUrls.map((url, index) => (
                  <Card
                    key={index}
                    hoverable
                    style={{ width: 200 }}
                    cover={
                      <Image
                        src={url}
                        alt={`Upload ${index + 1}`}
                        style={{ height: 150, objectFit: 'cover' }}
                        preview={{
                          src: url
                        }}
                      />
                    }
                    actions={[
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemove(url)}
                      >
                        Xóa
                      </Button>
                    ]}
                  >
                    <Card.Meta 
                      description={
                        <div style={{ fontSize: 11, wordBreak: 'break-all' }}>
                          <strong>URL:</strong> {url}
                        </div>
                      }
                    />
                  </Card>
                ))}
              </Space>
            </div>
          )}

        </Space>
      </Card>
    </div>
  );
};

export default CloudinaryImageUpload;