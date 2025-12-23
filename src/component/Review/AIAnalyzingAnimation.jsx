import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

const AIAnalyzingAnimation = ({ isAnalyzing, aiFeedback, aiSummaryData }) => {
  return (
    <AnimatePresence mode="wait">
      {isAnalyzing ? (
        <motion.div
          key="analyzing"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex flex-col items-start mt-2"
        >
          <div className="flex items-center text-gray-700 font-medium mb-2">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.5, repeat: Infinity },
              }}
            >
              <Bot className="w-5 h-5 mr-2 text-blue-600" />
            </motion.div>
            <span>AI Analyzing...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <motion.div
            className="mt-2 space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-2 bg-gray-200 rounded"
                initial={{ width: 0 }}
                animate={{ width: `${60 + i * 15}%` }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
              />
            ))}
          </motion.div>
        </motion.div>
      ) : aiFeedback ? (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-1"
        >
          <motion.div
            className="flex items-center mb-1"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Bot size={14} className="text-blue-600 mr-2" />
            </motion.div>
            <span className="font-bold text-gray-900 text-sm">
              AI Suggestions
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`text-sm ${
              aiSummaryData?.statusCode === 400 ||
              aiFeedback.summary.includes("⚠")
                ? "text-red-700 bg-red-50 p-2 rounded border border-red-200"
                : "text-gray-800 bg-blue-50 p-2 rounded border border-blue-100"
            }`}
          >
            {aiFeedback.summary}
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center text-gray-500 py-4"
        >
          <p className="text-xs italic">No AI summary available</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIAnalyzingAnimation;