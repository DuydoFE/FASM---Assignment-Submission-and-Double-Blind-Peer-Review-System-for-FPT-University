import React from "react";
import { Modal } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserOutlined,
  MailOutlined,
  InfoCircleOutlined,
  BookOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const InstructionModal = ({ isOpen, onClose, assignmentData }) => {
  if (!assignmentData) return null;

  const { instructorName, instructorEmail, guidelines, title, previewUrl, fileName } = assignmentData;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={650}
      closable={false}
      title={null}
      styles={{ body: { padding: 0 } }} 
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-700 to-indigo-600 p-6 rounded-t-lg">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                  <InfoCircleOutlined className="text-3xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white m-0">Assignment Instructions</h2>
                  <p className="text-blue-100 text-sm m-0 mt-1 opacity-90">
                    {title || "General Details"}
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-6 right-6 text-white/80 hover:text-white text-xl bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              >
                <CloseOutlined />
              </motion.button>
            </div>

            <div className="p-8 bg-white rounded-b-lg">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <UserOutlined /> INSTRUCTOR CONTACT
                </h3>
                <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                    {instructorName?.charAt(0) || <UserOutlined />}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-800 m-0">
                      {instructorName || "N/A"}
                    </p>
                    <a
                      href={`mailto:${instructorEmail}`}
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-700 font-medium mt-1 transition-colors"
                    >
                      <MailOutlined />
                      <span>{instructorEmail || "No email provided"}</span>
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BookOutlined /> GUIDELINES & STEPS
                </h3>
                <div className="bg-indigo-50/50 p-6 rounded-2xl border-l-4 border-indigo-500 text-gray-700">
                  <div className="text-sm leading-relaxed whitespace-pre-wrap italic">
                    {guidelines || "No specific guidelines were provided for this assignment. If you have questions, please reach out to your instructor via email."}
                  </div>
                </div>
              </motion.div>

              {fileName && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    📎 ATTACHMENT
                  </p>
                  <p className="text-sm font-semibold text-gray-800">{fileName}</p>
                </motion.div>
              )}

              <div className="mt-8 flex gap-3">
                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    <EyeOutlined style={{ marginRight: '8px' }} />
                    Preview
                  </a>
                )}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className={`${previewUrl ? 'flex-1' : 'w-full'} px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all`}
                >
                  I Understand
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default InstructionModal;