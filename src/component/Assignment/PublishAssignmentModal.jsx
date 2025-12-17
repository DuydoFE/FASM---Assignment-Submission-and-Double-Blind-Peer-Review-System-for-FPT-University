import React from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Modal, Button } from 'antd';

const PublishAssignmentModal = ({ isOpen, onClose, onConfirm, assignment }) => {
  if (!assignment) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={500}
      title={
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <Upload className="w-6 h-6 text-yellow-600" />
          </div>
          <span className="text-xl font-bold text-gray-900">Publish Assignment</span>
        </div>
      }
      footer={
        <div className="flex gap-3 justify-end">
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => onConfirm(assignment.id || assignment.assignmentId)}
            icon={<Upload className="w-4 h-4" />}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            Publish Assignment
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to publish this assignment? Once published, students will be able to view and submit their work.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Assignment Title:
            </p>
            <p className="text-base font-semibold text-gray-900">
              {assignment.title}
            </p>
            
            <div className="mt-3 pt-3 border-t border-yellow-200">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Deadline:</span> {assignment.deadline} at {assignment.time}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                <span className="font-medium">Review Deadline:</span> {assignment.reviewDeadline}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Note:</span> After publishing, you can still extend deadlines but cannot edit the assignment details.
            </p>
        </div>
      </div>
    </Modal>
  );
};

export default PublishAssignmentModal;