import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";

const CourseListItem = ({
  icon: Icon,
  iconColor,
  title,
  code,
  semester,
  status,
  onJoinClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)", x: 5 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex items-center justify-between p-5 border-b last:border-b-0 hover:bg-gray-50 transition-all duration-300 group"
    >
      <div className="flex items-center">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className={`flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mr-4 shadow-md group-hover:shadow-lg transition-shadow duration-300 ${iconColor}`}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
        <div>
          <motion.p
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
            className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors duration-300"
          >
            {title}
          </motion.p>
          <p className="text-sm text-gray-500 font-medium">{code}</p>
          {semester && (
            <p className="text-xs text-gray-400 font-medium mt-1">Semester: {semester}</p>
          )}
        </div>
      </div>

      {status === "Pending" ? (
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(20, 184, 166, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onJoinClick}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Enroll
        </motion.button>
      ) : (
        <motion.button
          initial={{ scale: 1 }}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-400 to-emerald-400 text-white font-semibold rounded-lg shadow-md cursor-not-allowed opacity-75"
          disabled
        >
          <Check className="w-4 h-4" />
          Enrolled
        </motion.button>
      )}
    </motion.div>
  );
};

export default CourseListItem;
