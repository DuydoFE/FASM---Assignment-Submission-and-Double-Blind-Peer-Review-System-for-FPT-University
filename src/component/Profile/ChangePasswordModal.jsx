import React, { useState } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';
import { LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import api from '../../config/axios';

const ChangePasswordModal = ({ isOpen, onClose, userId }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/account/change-password', {
        userId: userId,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });

      // Lấy message từ API response
      const responseMessage = response.data?.message || response.data || 'Password changed successfully!';
      
      // Kiểm tra status từ response hoặc HTTP status
      const statusCode = response.data?.statusCode || response.status;
      
      if (statusCode >= 200 && statusCode < 300) {
        message.success(responseMessage);
        form.resetFields();
        onClose();
      } else {
        message.error(responseMessage);
      }
    } catch (error) {
      console.error('Change password error:', error);
      // Lấy message từ error response
      const errorMsg = error.response?.data?.message ||
                       error.response?.data ||
                       error.message ||
                       'Failed to change password';
      message.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <LockOutlined className="mr-2 text-blue-600" />
          <span className="text-lg font-semibold">Change Password</span>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        className="mt-4"
      >
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[
            { required: true, message: 'Please enter your current password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Enter current password"
            size="large"
            iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Please enter new password' },
            { min: 6, message: 'Password must be at least 6 characters' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
              message: 'Password must contain uppercase, lowercase, number and special character'
            }
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Enter new password"
            size="large"
            iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Confirm new password"
            size="large"
            iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800 font-medium mb-1">Password Requirements:</p>
          <ul className="text-xs text-blue-700 space-y-1 ml-4">
            <li>• At least 6 characters</li>
            <li>• Contains uppercase letter (A-Z)</li>
            <li>• Contains lowercase letter (a-z)</li>
            <li>• Contains number (0-9)</li>
            <li>• Contains special character (@$!%*?&)</li>
          </ul>
        </div>

        <Form.Item className="mb-0">
          <div className="flex justify-end gap-3">
            <Button onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;