import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

const UpdateDeadlineModal = ({ isOpen, onClose, onSave, assignment }) => {
  const [newDeadline, setNewDeadline] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    if (assignment && isOpen) {
      // Format date for input
      const [day, month, year] = assignment.deadline.split('/');
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      setNewDeadline(formattedDate);

      // Format time for input
      const timeArr = assignment.time.split(':');
      const formattedTime = `${timeArr[0].padStart(2, '0')}:${timeArr[1].padStart(2, '0')}`;
      setNewTime(formattedTime);
    }
  }, [assignment, isOpen]);

  if (!isOpen || !assignment) return null;

  const handleSubmit = () => {
    if (!newDeadline || !newTime) {
      alert('Please enter both date and time');
      return;
    }
    onSave(newDeadline, newTime);
  };

  const handleClose = () => {
    setNewDeadline('');
    setNewTime('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Extend Deadline</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment: <span className="font-semibold text-gray-900">{assignment.title}</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Current deadline:</span> {assignment.deadline} at {assignment.time}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Extend
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDeadlineModal;