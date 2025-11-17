// RequestRegradeDetailModal.js

import { Modal, Button, Spin } from "antd";
import {
  FileText,
  Edit,
  User,
  Star,
  MessageSquare,
  Tag as TagIcon,
} from "lucide-react";
import { StatusTag } from "../../pages/RegradeRequest/ViewRequestHistoryPage";

// MODIFIED: Props now include 'details' and 'loading'
const RequestRegradeDetailModal = ({ visible, details, loading, onClose }) => {
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
      {/* MODIFIED: Handle loading and empty states */}
      {loading ? (
        <div className="text-center py-12">
          <Spin size="large" />
        </div>
      ) : !details ? (
        <div className="text-center py-12">
          <p>Could not load request details.</p>
        </div>
      ) : (
        <div className="space-y-4 py-4">
          <div className="flex items-start">
            <TagIcon className="w-5 h-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">Status</p>
              <StatusTag status={details.status} />
            </div>
          </div>

          <div className="flex items-start">
            <FileText className="w-5 h-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">File Name</p>
              <p className="text-gray-700">{details.submission?.fileName}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Edit className="w-5 h-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">Your Reason</p>
              <p className="text-gray-700">{details.reason}</p>
            </div>
          </div>

          <div className="flex items-start">
            <User className="w-5 h-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">
                Reviewed By Instructor
              </p>
              <p className="text-gray-700">
                {details.reviewedByInstructor?.fullName || "Not reviewed yet"}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Star className="w-5 h-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">
                Final Score After Regrade
              </p>
              <p className="text-gray-700 font-bold text-green-600">
                {details.gradeInfo?.finalScoreAfterRegrade ?? "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <MessageSquare className="w-5 h-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">Instructor Comment</p>
              <p className="text-gray-700 italic">
                {details.resolutionNotes || "No comments yet."}
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RequestRegradeDetailModal;