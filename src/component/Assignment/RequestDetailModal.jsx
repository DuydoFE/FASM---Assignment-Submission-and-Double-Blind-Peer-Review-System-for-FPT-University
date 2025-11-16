import { Modal, Button } from "antd";
import {
  FileText,
  Edit,
  User,
  Star,
  MessageSquare,
  Tag as TagIcon,
} from "lucide-react";

import { StatusTag } from "./ViewRequestHistoryPage";

const RequestDetailModal = ({ visible, request, onClose }) => {
  if (!request) {
    return null;
  }

  return (
    <Modal
      title="Regrade Request Details"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <div className="space-y-4 py-4">
        <div className="flex items-start">
          <TagIcon className="w-5 h-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800">Status</p>
            <StatusTag status={request.status} />
          </div>
        </div>

        <div className="flex items-start">
          <FileText className="w-5 h-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800">File Name</p>
            <p className="text-gray-700">{request.submission?.fileName}</p>
          </div>
        </div>

        <div className="flex items-start">
          <Edit className="w-5 h-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800">Your Reason</p>
            <p className="text-gray-700">{request.reason}</p>
          </div>
        </div>

        <div className="flex items-start">
          <User className="w-5 h-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800">
              Reviewed By Instructor
            </p>
            <p className="text-gray-700">SangNm</p>
          </div>
        </div>

        <div className="flex items-start">
          <Star className="w-5 h-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800">Score After Regrade</p>
            <p className="text-gray-700 font-bold text-green-600">9</p>
          </div>
        </div>

        <div className="flex items-start">
          <MessageSquare className="w-5 h-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800">Comment</p>
            <p className="text-gray-700 italic">
              "There are some errors that cause the score to be incorrect."
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RequestDetailModal;
