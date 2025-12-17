import React from 'react';
import { Plus } from 'lucide-react';
import { Input, Modal, Button } from 'antd';

const AddStudentModal = ({
  isOpen,
  onClose,
  onSubmit,
  studentCode,
  setStudentCode,
  modalError,
  setModalError,
  addingStudent,
  courseInfo
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleClose = () => {
    setStudentCode('');
    setModalError('');
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      width={600}
      title={
        <h2 className="text-xl font-bold text-gray-900">
          Add Student into Course: {courseInfo?.courseCode} - Class: {courseInfo?.className}
        </h2>
      }
      footer={
        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleClose}
            disabled={addingStudent}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={addingStudent}
            loading={addingStudent}
            icon={<Plus className="w-4 h-4" />}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {addingStudent ? 'Adding...' : 'Add'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Code
            </label>
            <Input
              value={studentCode}
              onChange={(e) => {
                setStudentCode(e.target.value);
                setModalError('');
              }}
              placeholder="Enter student code (e.g., SE123456)"
              disabled={addingStudent}
              autoFocus
              size="large"
              status={modalError ? 'error' : ''}
            />
            {modalError && (
              <p className="text-red-500 text-sm mt-2">{modalError}</p>
            )}
          </div>
        </form>
    </Modal>
  );
};

export default AddStudentModal;