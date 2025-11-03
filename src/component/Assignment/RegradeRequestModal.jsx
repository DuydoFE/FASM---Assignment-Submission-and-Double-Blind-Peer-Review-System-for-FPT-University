import React, { useState } from "react";
import { X, Send, ShieldQuestion } from "lucide-react";
import { toast } from "react-toastify";

const RegradeRequestModal = ({
  isOpen,
  onClose,
  onSubmit,
  assignmentTitle,
  isSubmitting,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please enter a reason for your request.");
      return;
    }

    onSubmit({ reason });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 animate-fade-in-up">
        <div className="p-6 border-b flex justify-between items-center">
          <div className="flex items-center">
            <ShieldQuestion className="w-6 h-6 mr-3 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Request for Regrade
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Submit a regrade request for assignment:{" "}
              <span className="font-semibold">{assignmentTitle}</span>. Please
              state your reasons clearly.
            </p>

            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason for regrade
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Explain why you believe the current score is inaccurate..."
                required
              />
            </div>
          </div>
          <div className="p-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border rounded-md text-gray-700 hover:bg-gray-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 flex items-center disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegradeRequestModal;
