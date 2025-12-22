import React, { useState } from 'react';
import { Upload, message, Progress, Image, Button, Space, Card } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import useCloudinaryUpload from '../assets/hook/useCloudinaryUpload';

const { Dragger } = Upload;

const CloudinaryImageUpload = ({ 
  onUploadSuccess, 
  folder = 'uploads',
  multiple = false 
}) => {
  const { uploadImage, uploading, progress, error, imageUrl } = useCloudinaryUpload();
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  /**
   * Handle when selecting a file
   */
  const handleUpload = async (file) => {
    try {
      // Upload lên Cloudinary
      const url = await uploadImage(file, { 
        folder: folder,
        tags: 'user_upload' // Tag for easy management on Cloudinary
      });

      message.success('Image upload successful!');
      
      // Lưu URL vào state
      setUploadedUrls(prev => [...prev, url]);
      setPreviewUrl(url);

      // Callback cho component cha
      if (onUploadSuccess) {
        onUploadSuccess(url);
      }

    } catch (err) {
      message.error(`Upload failed: ${err.message}`);
    }

    // Prevent Ant Design from uploading automatically
    return false;
  };

  /**
   * Remove uploaded image
   */
  const handleRemove = (url) => {
    setUploadedUrls(prev => prev.filter(item => item !== url));
    if (previewUrl === url) {
      setPreviewUrl(null);
    }
  };

  /**
   * Check file before upload
   */
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Card title="Upload Images to Cloudinary">
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
              Click or drag and drop files here to upload
            </p>
            <p className="ant-upload-hint">
              Supported: JPG, PNG, GIF, WebP (up to 5MB)
            </p>
          </Dragger>

          {/* Progress Bar */}
          {uploading && (
            <div>
              <p>Uploading...</p>
              <Progress percent={progress} status="active" />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{ color: 'red' }}>
              Error: {error}
            </div>
          )}

          {/* Preview and list of uploaded images */}
          {uploadedUrls.length > 0 && (
            <div>
              <h4>Uploaded images:</h4>
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
                        Delete
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