import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UpdateDeadlineModal = ({ isOpen, onClose, onSave, assignment }) => {
  const [newDeadline, setNewDeadline] = useState(null);

  useEffect(() => {
    if (assignment && isOpen) {
      // Parse the assignment deadline and time to create a Date object
      if (assignment.deadline && assignment.time) {
        const [day, month, year] = assignment.deadline.split('/');
        const [hours, minutes] = assignment.time.split(':');
        const parsedDate = new Date(year, month - 1, day, hours, minutes); // month is 0-indexed
        setNewDeadline(parsedDate);
      } else if (assignment.deadline) {
        // If there's no time component, just parse the date
        const [day, month, year] = assignment.deadline.split('/');
        const parsedDate = new Date(year, month - 1, day);
        setNewDeadline(parsedDate);
      }
    }
  }, [assignment, isOpen]);

  if (!isOpen || !assignment) return null;

  const handleSubmit = () => {
    if (!newDeadline) {
      alert('Please select a date and time');
      return;
    }

    // Format as local datetime without timezone conversion
    const year = newDeadline.getFullYear();
    const month = String(newDeadline.getMonth() + 1).padStart(2, '0');
    const day = String(newDeadline.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`; // YYYY-MM-DD
    
    const hours = String(newDeadline.getHours()).padStart(2, '0');
    const minutes = String(newDeadline.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`; // HH:MM

    onSave(formattedDate, formattedTime);
  };

  const handleClose = () => {
    setNewDeadline(null);
    onClose();
  };

  // Get current time to prevent past dates/times
  const now = new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Extend Deadline</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment: <span className="font-semibold text-gray-900">{assignment.title}</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Deadline <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={newDeadline}
              onChange={(date) => setNewDeadline(date)}
              showTimeSelect
              timeIntervals={1}
              dateFormat="MMM d, yyyy h:mm aa"
              minDate={now}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholderText="Select new deadline and time"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Current deadline:</span> {assignment.deadline} at {assignment.time || 'N/A'}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Extend
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDeadlineModal;