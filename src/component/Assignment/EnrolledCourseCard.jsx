import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Users, BookCopy, Eye, Info, ArrowRight } from 'lucide-react';

const EnrolledCourseCard = ({
  subjectCode,
  title,
  classCode,
  classId,
  lecturer,
  studentCount,
  schedule,
  semester,
  status,
  instructorNames,
  enrolledAt,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewAssignments = () => {
    navigate(`/assignment/${classId || classCode}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="p-6 rounded-xl shadow-lg border border-gray-200 bg-white hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/80 group-hover:via-purple-50/40 group-hover:to-pink-50/80 transition-all duration-500 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className={`flex-shrink-0 w-14 h-14 flex items-center justify-center font-bold rounded-full text-lg shadow-md ${
                status === 'Enrolled'
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
                  : 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
              }`}
            >
              {subjectCode}
            </motion.div>
            <div className="ml-4">
              <h3 className="font-bold text-gray-900 text-xl group-hover:text-blue-600 transition-colors duration-300">
                {title}
              </h3>
              <p className="text-gray-500 text-sm font-medium">{classCode}</p>
            </div>
          </div>

          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            {status === 'Enrolled' ? (
              <div className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full shadow-md">
                ✓ Enrolled
              </div>
            ) : (
              <div className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-md">
                ⏳ Pending
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-gray-700 text-sm mb-6"
        >
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center bg-gray-50 p-3 rounded-lg group-hover:bg-blue-50 transition-colors duration-300"
          >
            <User className="w-5 h-5 mr-2 text-blue-500" />
            <span className="font-medium">Instructor:</span>
            <span className="ml-1 text-gray-600">{instructorNames ? instructorNames.join(', ') : 'N/A'}</span>
          </motion.div>
          
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center bg-gray-50 p-3 rounded-lg group-hover:bg-purple-50 transition-colors duration-300"
          >
            <Users className="w-5 h-5 mr-2 text-purple-500" />
            <span className="font-medium">{studentCount} Students</span>
          </motion.div>
         
          {semester && (
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center bg-gray-50 p-3 rounded-lg group-hover:bg-indigo-50 transition-colors duration-300"
            >
              <BookCopy className="w-5 h-5 mr-2 text-indigo-500" />
              <span className="font-medium">Semester:</span>
              <span className="ml-1 text-gray-600">{semester}</span>
            </motion.div>
          )}
          
          {enrolledAt && (
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center bg-gray-50 p-3 rounded-lg group-hover:bg-green-50 transition-colors duration-300"
            >
              <Info className="w-5 h-5 mr-2 text-green-500" />
              <span className="font-medium">Joined:</span>
              <span className="ml-1 text-gray-600">{new Date(enrolledAt).toLocaleDateString()}</span>
            </motion.div>
          )}
        </motion.div>

        <div className="flex justify-end space-x-3">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewAssignments}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
            disabled={status !== 'Enrolled'}
          >
            <Eye className="w-5 h-5 mr-2" />
            View Assignments
            <motion.div
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EnrolledCourseCard;