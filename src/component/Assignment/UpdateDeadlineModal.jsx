import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Button } from 'antd';

const UpdateDeadlineModal = ({ isOpen, onClose, onSave, assignment }) => {
  const [newDeadline, setNewDeadline] = useState(null);

  useEffect(() => {
    if (assignment && isOpen) {
      // Parse the assignment deadline (now it's a datetime string like "2025-12-25T00:00:00")
      if (assignment.deadline) {
        // Remove 'Z' and milliseconds if present
        const cleanStr = assignment.deadline.replace('Z', '').split('.')[0];
        const parsedDate = new Date(cleanStr);
        setNewDeadline(parsedDate);
      }
    }
  }, [assignment, isOpen]);

  const formatCurrentDeadline = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    const cleanStr = dateTimeStr.replace('Z', '').split('.')[0];
    const [datePart, timePart] = cleanStr.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  };

  if (!assignment) return null;

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
    <Modal
      open={isOpen}
      onCancel={handleClose}
      width={500}
      title={
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <span className="text-xl font-bold text-gray-900">Extend Deadline</span>
        </div>
      }
      footer={
        <div className="flex gap-3 justify-end">
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            icon={<Calendar className="w-5 h-5" />}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Extend
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
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
              <span className="font-medium">Current deadline:</span> {formatCurrentDeadline(assignment.deadline)}
            </p>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateDeadlineModal;