import React from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from 'antd';

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
  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Add Student into Course: {courseInfo?.courseCode} - Class: {courseInfo?.className}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              disabled={addingStudent}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
              disabled={addingStudent}
            >
              <Plus className="w-4 h-4" />
              {addingStudent ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;