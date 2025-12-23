import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import ViewScoresModal from "./ViewScoresModal";

const ViewAllScore = ({ studentId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center p-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md"
      >
        <FileText className="w-5 h-5 mr-2" /> View scores
      </motion.button>

      <ViewScoresModal
        studentId={studentId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ViewAllScore;