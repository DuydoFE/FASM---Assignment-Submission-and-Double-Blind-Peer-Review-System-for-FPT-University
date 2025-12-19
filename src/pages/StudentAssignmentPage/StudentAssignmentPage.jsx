import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  ChevronRight,
  HelpCircle,
  Smartphone,
  Server,
  Globe,
  Code,
} from "lucide-react";
import CourseListItem from "../../component/Assignment/CourseListItem";
import EnrolledCourseCard from "../../component/Assignment/EnrolledCourseCard";
import JoinClassModal from "../../component/Assignment/JoinClassModal";
import FASMLogo from "../../assets/img/FASM.png";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { courseService } from "../../service/courseService";
import { selectUser } from "../../redux/features/userSlice";

const getCourseIcon = (courseCode) => {
  if (courseCode.startsWith("PRM"))
    return { component: Smartphone, color: "text-red-500" };
  if (courseCode.startsWith("PRN"))
    return { component: Server, color: "text-blue-500" };
  if (courseCode.startsWith("FER"))
    return { component: Globe, color: "text-purple-500" };
  return { component: Code, color: "text-yellow-600" };
};

const StudentAssignmentPage = () => {
  const currentUser = useSelector(selectUser);
  const studentId = currentUser?.userId;
  console.log("Current User from Redux:", currentUser);

  const queryClient = useQueryClient();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.userId) {
      const fetchEnrolledCourses = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const response = await courseService.getEnrolledCoursesByStudentId(
            currentUser.userId
          );
          setEnrolledCourses(response.data.data);
        } catch (err) {
          console.error("Lỗi khi tải danh sách lớp học:", err);
          setError("Không thể tải danh sách lớp học. Vui lòng thử lại.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchEnrolledCourses();
    } else {
      setIsLoading(false);
      setEnrolledCourses([]);
    }
  }, [currentUser]);

  const {
    data: registrationsData,
    isLoading: isLoadingRegistrations,
    isError: isErrorRegistrations,
  } = useQuery({
    queryKey: ["studentCourseRegistrations", studentId],
    queryFn: () => courseService.getStudentCourseRegistrations(studentId),
    enabled: !!studentId,
  });
  const availableCourses = registrationsData?.data || [];

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleEnrollSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["studentCourseRegistrations", studentId],
    });

    toast.success("Enrolled in class successfully!");
  };

  const renderEnrolledCourses = () => {
    if (isLoading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Classes...</p>
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-red-50 rounded-lg border border-red-200"
        >
          <p className="text-red-600 font-medium">{error}</p>
        </motion.div>
      );
    }

    if (enrolledCourses.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center flex flex-col items-center py-16 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <BookOpen className="w-20 h-20 text-blue-400 mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            You haven't joined any class yet
          </h2>
          <p className="text-gray-600 mb-6">Start your learning journey today!</p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Explore Available Courses
          </motion.button>
        </motion.div>
      );
    }

    return (
      <div className="space-y-4">
        <AnimatePresence>
          {enrolledCourses.map((course, index) => (
            <motion.div
              key={course.courseStudentId}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -4 }}
            >
              <EnrolledCourseCard
                subjectCode={course.courseCode}
                title={`${course.courseName} - ${course.courseCode}`}
                classCode={course.courseInstanceId}
                lecturer={
                  course.instructorNames && course.instructorNames.length > 0
                    ? course.instructorNames.join(", ")
                    : "N/A"
                }
                studentCount={course.studentCount}
                schedule="N/A"
                assignmentCount={0}
                status={course.status}
                instructorNames={course.instructorNames}
                enrolledAt={course.enrolledAt}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center text-sm text-gray-600"
        >
          <span>My Assignment</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-semibold text-gray-800">My Assignment</span>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 via-orange-500 to-green-600 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden"
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-orange-500/50 to-green-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 mb-3"
            >
              <h1 className="text-3xl font-bold">My Classes</h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/90 text-lg"
            >
              Manage your enrolled courses and explore new learning opportunities
            </motion.p>
          </div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
        >
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
          >
            <motion.img
              src={FASMLogo}
              alt="FASM Logo"
              className="w-12 h-12 object-contain"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            Enrolled Classes
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {renderEnrolledCourses()}
          </motion.div>

          {/* Available Courses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <img
                    src={FASMLogo}
                    alt="FASM Logo"
                    className="w-6 h-6 object-contain"
                  />
                  Available Courses
                </h3>
                <p className="text-sm text-gray-600">Discover and join new classes</p>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-md bg-white"
            >
              {isLoadingRegistrations && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading courses...</p>
                </motion.div>
              )}
              {isErrorRegistrations && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 text-center text-red-500"
                >
                  Could not load courses.
                </motion.p>
              )}
              <AnimatePresence mode="wait">
                {!isLoadingRegistrations &&
                  !isErrorRegistrations &&
                  availableCourses.map((course, index) => {
                    const Icon = getCourseIcon(course.courseCode).component;
                    const iconColor = getCourseIcon(course.courseCode).color;

                    return (
                      <motion.div
                        key={course.courseInstanceId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <CourseListItem
                          icon={Icon}
                          iconColor={iconColor}
                          title={course.courseName}
                          code={`Class Code: ${course.courseInstanceName}`}
                          status={course.status}
                          onJoinClick={() => handleOpenModal(course)}
                        />
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-8"
        >
          <motion.a
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            href="#"
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Need Help?
          </motion.a>
        </motion.div>
        
        <JoinClassModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          course={selectedCourse}
          onEnrollSuccess={handleEnrollSuccess}
        />
      </div>
    </div>
  );
};

export default StudentAssignmentPage;