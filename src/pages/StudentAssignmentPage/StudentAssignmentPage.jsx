import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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

    toast.success("Ghi danh vào lớp học thành công!");
  };

  const renderEnrolledCourses = () => {
    if (isLoading) {
      return <p className="text-center py-12">Loading Class...</p>;
    }

    if (error) {
      return <p className="text-center py-12 text-red-500">{error}</p>;
    }

    if (enrolledCourses.length === 0) {
      return (
        <div className="text-center flex flex-col items-center py-12 border-b">
          <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            You have not Join any class
          </h2>
          <p className="text-gray-600 mb-6">Join Any Class</p>
          <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Choose Course to Join
          </button>
        </div>
      );
    }

    return enrolledCourses.map((course) => (
      <EnrolledCourseCard
        key={course.courseStudentId}
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
    ));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex items-center text-sm text-gray-600">
          <span>My Assignment</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-semibold text-gray-800">My Assignment</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">My Class</h1>
          {renderEnrolledCourses()}


          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Available Courses
            </h3>
            <p className="text-sm text-gray-600 mb-4">Choose Class to join</p>
            
            <div className="border rounded-lg">
              {isLoadingRegistrations && (
                <p className="p-4 text-center">Loading courses...</p>
              )}
              {isErrorRegistrations && (
                <p className="p-4 text-center text-red-500">
                  Could not load courses.
                </p>
              )}
              {!isLoadingRegistrations &&
                !isErrorRegistrations &&
                availableCourses.map((course) => {
                  const Icon = getCourseIcon(course.courseCode).component;
                  const iconColor = getCourseIcon(course.courseCode).color;

                  return (
                    <CourseListItem
                      key={course.courseInstanceId}
                      icon={Icon}
                      iconColor={iconColor}
                      title={course.courseName}
                      code={`Class Code: ${course.courseInstanceName}`}
                      status={course.status}
                      onJoinClick={() => handleOpenModal(course)}
                    />
                  );
                })}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="#"
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Help ?
          </a>
        </div>
        
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