import React from 'react';
import { Modal, Button } from 'antd';
import { AlertCircle, Loader2 } from 'lucide-react';

const AutoGradeZeroModal = ({ isOpen, onClose, onConfirm, loading, notSubmittedCount }) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <span>Auto Grade with Zero Scores</span>
        </div>
      }
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
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
        >
          {loading ? 'Grading...' : 'Confirm Auto Grade'}
        </Button>
      ]}
    >
      <p className="text-gray-600 mb-2">
        This will automatically assign <span className="font-semibold text-red-600">0 scores</span> to all students with "Not Submitted" status.
      </p>
      <p className="text-gray-600">
        <span className="font-semibold">{notSubmittedCount || 0} student(s)</span> will be affected. This action cannot be undone.
      </p>
    </Modal>
  );
};

export default AutoGradeZeroModal;