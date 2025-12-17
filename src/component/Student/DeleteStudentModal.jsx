import React from 'react';
import { Trash2 } from 'lucide-react';
import { Modal, Button } from 'antd';

const DeleteStudentModal = ({
  isOpen,
  onClose,
  onConfirm,
  student,
  deleting,
  courseInfo
}) => {
  if (!student) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={500}
      title={
        <h2 className="text-xl font-bold text-gray-900">Remove Student</h2>
      }
      footer={
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            onClick={onConfirm}
            disabled={deleting}
            loading={deleting}
            icon={<Trash2 className="w-4 h-4" />}
          >
            {deleting ? 'Removing...' : 'Remove'}
          </Button>
        </div>
      }
    >
      <div>
          <p className="text-gray-700 mb-4">
            Are you sure you want to remove{' '}
            <span className="font-semibold">{student.name}</span> from Course{' '}
            {courseInfo?.courseCode} - Class {courseInfo?.className}?
          </p>
        </div>
    </Modal>
  );
};

export default DeleteStudentModal;