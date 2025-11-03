import React, { useState } from 'react';
import { X, Send, ShieldQuestion } from 'lucide-react';
import { toast } from 'react-toastify';

const RegradeRequestModal = ({ isOpen, onClose, assignmentTitle }) => {
    const [expectedScore, setExpectedScore] = useState('');
    const [reason, setReason] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!expectedScore || !reason.trim()) {
            toast.error("Please enter your desired score and reason.");
            return;
        }
        
        // --- CHƯA CẦN GỌI API ---
        // Chỉ hiển thị thông báo thành công và đóng modal
        console.log("Submitting Regrade Request:", { expectedScore, reason });
        toast.success("Request for review has been acknowledged (not sent yet)!");
        onClose(); // Đóng modal sau khi submit
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 animate-fade-in-up">
                <div className="p-6 border-b flex justify-between items-center">
                    <div className="flex items-center">
                        <ShieldQuestion className="w-6 h-6 mr-3 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-800">Request for review</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <p className="text-sm text-gray-600 mb-4">
                            Submit a request for review of an assignment: <span className="font-semibold">{assignmentTitle}</span>. 
                            Please state your reasons clearly and the score you think is reasonable.
                        </p>
                        
                        <div className="mb-4">
                            <label htmlFor="expectedScore" className="block text-sm font-medium text-gray-700 mb-1">
                               Desired score
                            </label>
                            <input
                                type="number"
                                id="expectedScore"
                                value={expectedScore}
                                onChange={(e) => setExpectedScore(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ví dụ: 8.5"
                                step="0.01"
                                min="0"
                                max="10"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for appeal
                            </label>
                            <textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Giải thích tại sao bạn tin rằng điểm số hiện tại chưa chính xác..."
                                required
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border rounded-md text-gray-700 hover:bg-gray-100 font-semibold">
                           Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 flex items-center"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Send Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegradeRequestModal;