import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from 'antd';

const DeleteAssignmentModal = ({ isOpen, onClose, onConfirm, assignment }) => {
  if (!assignment) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={500}
      title={
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <span className="text-xl font-bold text-gray-900">Delete Assignment</span>
        </div>
      }
      footer={
        <div className="flex gap-3 justify-end">
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => onConfirm(assignment.id)}
            icon={<AlertTriangle className="w-4 h-4" />}
          >
            Delete Assignment
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this assignment? This action cannot be undone.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Assignment Title:
            </p>
            <p className="text-base font-semibold text-gray-900">
              {assignment.title}
            </p>
            
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Deadline:</span> {assignment.deadline} at {assignment.time}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                <span className="font-medium">Submissions:</span> {assignment.submitted}/{assignment.total}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Warning:</span> All student submissions and reviews associated with this assignment will also be deleted.
            </p>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAssignmentModal;