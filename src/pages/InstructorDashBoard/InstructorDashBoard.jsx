import React, { useState, useEffect } from "react";
import {
  Search,
  ArrowUpDown,
  Book,
  Users,
  Calendar,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Input } from "antd";
import { getInstructorCourses } from "../../service/courseInstructorService";
import { getCurrentAccount } from "../../utils/accountUtils";
import { useNavigate } from "react-router-dom";
import SplitText from "../../components/SplitText";

// Dashboard Content Component
const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = getCurrentAccount();
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border border-green-200";
      case "completed":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      case "upcoming":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case "completed":
        return <div className="w-2 h-2 bg-orange-500 rounded-full"></div>;
      case "upcoming":
        return <div className="w-2 h-2 bg-purple-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        if (!currentUser?.id) {
          console.error("No user ID found");
          return;
        }
        const response = await getInstructorCourses(currentUser.id);

        const mappedCourses = response.map((course) => {
          let status, statusText;

          // Map API's courseInstanceStatus to the UI's status values
          switch (course.courseInstanceStatus) {
            case "Upcoming":
              status = "upcoming";
              statusText = "Upcoming";
              break;
            case "Ongoing":
              status = "active";
              statusText = "Ongoing";
              break;
            case "Completed":
              status = "completed";
              statusText = "Completed";
              break;
            default:
              status = "upcoming"; // Default fallback
              statusText = "Upcoming";
          }

          return {
            ...course,
            status,
            statusText,
            semester: course.semesterName,
          };
        });

        console.log("Mapped Courses:", mappedCourses); // Debug the mapped statuses
        setCourses(mappedCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentUser?.id]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Title and Welcome Message */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {courses[0]?.semester}
        </h1>
        <SplitText
          text={`Welcome back, ${currentUser?.username || currentUser?.fullName || 'Instructor'}!`}
          className="text-2xl font-semibold"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="right"
          onLetterAnimationComplete={handleAnimationComplete}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Total Classes */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <Book className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Classes</p>
              <p className="text-3xl font-bold text-gray-900">
                {courses.length}
              </p>
            </div>
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">
                {courses.reduce(
                  (total, course) => total + (course.studentCount || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading courses...</p>
        </div>
      )}

      {/* Semester Classes Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Classes This Semester
            </h2>
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search course..."
                prefix={<Search className="w-5 h-5 text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="large"
                className="w-80"
                style={{
                  borderRadius: '8px',
                  fontSize: '16px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Course Cards */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {!loading &&
              courses
                .filter(
                  (course) =>
                    // Only show courses with status 'active' (Ongoing)
                    course.status === "active" &&
                    (course.courseCode
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                      course.courseInstanceName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
                )
                .map((course) => (
                  <div
                    key={course.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white cursor-pointer"
                    onClick={() => {
                      try {
                        sessionStorage.setItem(
                          "currentCourseInstanceId",
                          String(course.courseInstanceId)
                        );
                      } catch (e) {
                        /* ignore */
                      }
                      navigate(
                        `/instructor/class-statistic/${course.courseInstanceId}`
                      );
                    }}
                  >
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-600">
                          {course.courseCode} - {course.courseInstanceName}
                        </span>
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                            course.status
                          )}`}
                        >
                          {getStatusIcon(course.status)}
                          {course.statusText}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-4 text-base">
                      {course.courseName}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{course.studentCount} students</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{course.semester}</span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
          {!loading && courses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No courses found
              </h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
