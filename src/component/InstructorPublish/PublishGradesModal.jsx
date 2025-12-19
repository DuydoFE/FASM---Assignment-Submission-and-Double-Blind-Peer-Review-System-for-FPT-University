import React from 'react';
import { Modal, Button } from 'antd';
import { Loader2 } from 'lucide-react';

const PublishGradesModal = ({ isOpen, onClose, onConfirm, loading }) => {
  return (
    <Modal
      title="Confirm Publish Grades"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger
          onClick={onConfirm}
          loading={loading}
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          className="bg-orange-500 hover:!bg-orange-600"
        >
          {loading ? 'Publishing...' : 'Confirm'}
        </Button>
      ]}
    >
      <p className="text-gray-600">
        Are you sure you want to publish grades for this assignment? Students will be able to see their grades.
      </p>
    </Modal>
  );
};

export default PublishGradesModal;