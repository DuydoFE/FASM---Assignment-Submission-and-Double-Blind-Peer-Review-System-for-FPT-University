import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

const AIOverviewCard = ({ aiSummaryData }) => {
  return (
    <AnimatePresence>
      {aiSummaryData && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white p-6 rounded-lg border shadow-sm"
        >
          <motion.h3
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-lg font-bold text-gray-800 flex items-center mb-4"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Bot className="w-6 h-6 mr-3 text-blue-600" />
            </motion.div>
            AI Overview
          </motion.h3>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`p-4 rounded-lg border ${
              aiSummaryData.statusCode === 400
                ? "bg-red-50 border-red-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <p className="text-gray-700">
              {aiSummaryData.data?.overallComment || aiSummaryData.message}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIOverviewCard;