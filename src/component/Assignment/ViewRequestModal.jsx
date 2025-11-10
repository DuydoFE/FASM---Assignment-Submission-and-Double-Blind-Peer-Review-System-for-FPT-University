
import React from 'react';
import { X, ShieldQuestion, Hash, AlertCircle, MessageSquare, Calendar } from 'lucide-react';

// Hàm helper để định dạng ngày tháng
const formatFullDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const options = {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  };
  return new Date(dateString).toLocaleString('vi-VN', options);
};

// Component con để hiển thị từng dòng chi tiết
const DetailRow = ({ icon, label, children }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500 flex items-center">
            {icon}
            <span className="ml-2">{label}</span>
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{children}</dd>
    </div>
);


const ViewRequestModal = ({ isOpen, onClose, details }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 animate-fade-in-up">
                {/* Header */}
                <div className="p-5 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <div className="flex items-center">
                        <ShieldQuestion className="w-6 h-6 mr-3 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-800">Regrade Request Details</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-6">
                    {!details ? (
                        <div className="text-center p-8">Loading details...</div>
                    ) : (
                        <dl className="divide-y divide-gray-200">
                            <DetailRow icon={<Hash size={16} />} label="Request ID">
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{details.requestId}</span>
                            </DetailRow>

                            <DetailRow icon={<AlertCircle size={16} />} label="Status">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${details.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                      details.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {details.status}
                                </span>
                            </DetailRow>

                             <DetailRow icon={<Calendar size={16} />} label="Date Requested">
                                {formatFullDateTime(details.requestedAt)}
                            </DetailRow>

                            <DetailRow icon={<MessageSquare size={16} />} label="Reason">
                                <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md border">{details.reason}</p>
                            </DetailRow>
                        </dl>
                    )}
                </div>

                {/* Footer */}
                 <div className="px-6 py-4 bg-gray-50 flex justify-end rounded-b-lg">
                    <button type="button" onClick={onClose} className="px-5 py-2 bg-white border rounded-md text-gray-700 hover:bg-gray-100 font-semibold">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewRequestModal;