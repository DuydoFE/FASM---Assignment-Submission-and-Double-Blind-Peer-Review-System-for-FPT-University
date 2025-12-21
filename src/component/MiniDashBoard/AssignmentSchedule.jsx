import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { getAllAcademicYears, getSemestersByAcademicYear } from "../../service/adminService";
import api from "../../config/axios";

const AssignmentSchedule = ({ studentId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [semestersForYear, setSemestersForYear] = useState([]);

  // Fetch academic years
  const { data: academicYearsData } = useQuery({
    queryKey: ["academicYears"],
    queryFn: getAllAcademicYears,
    enabled: isModalOpen,
  });

  // Fetch semesters for selected academic year
  useEffect(() => {
    const fetchSemestersForYear = async () => {
      if (selectedAcademicYear) {
        try {
          const response = await getSemestersByAcademicYear(selectedAcademicYear);
          setSemestersForYear(response.data || []);
        } catch (error) {
          console.error("Error fetching semesters:", error);
          setSemestersForYear([]);
        }
      } else {
        setSemestersForYear([]);
      }
    };

    fetchSemestersForYear();
  }, [selectedAcademicYear]);

  // Fetch student assignments for selected semester
  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: ["studentSemesterAssignments", studentId, selectedSemester],
    queryFn: async () => {
      if (!selectedSemester || !studentId) return { data: [] };
      const response = await api.get(`/StudentReview/student/${studentId}/semester/${selectedSemester}/assignments-status`);
      return response.data;
    },
    enabled: isModalOpen && !!studentId && !!selectedSemester,
  });

  // Extract data from API response
  const academicYears = academicYearsData?.data || [];
  const assignments = assignmentsData?.data || [];

  // Get selected semester details
  const selectedSemesterData = semestersForYear.find(
    (s) => s.semesterId === parseInt(selectedSemester)
  );

  // Set initial month/year when semester is selected
  useEffect(() => {
    if (selectedSemesterData) {
      const semStart = new Date(selectedSemesterData.startDate);
      setCurrentMonth(semStart.getMonth());
      setCurrentYear(semStart.getFullYear());
    }
  }, [selectedSemesterData]);

  // Filter assignments - only show Active and InReview status
  const filteredAssignments = React.useMemo(() => {
    return assignments.filter((assignment) => {
      return assignment.status === "Active" || assignment.status === "InReview";
    });
  }, [assignments]);

  // Get assignments for a specific date
  const getAssignmentsForDate = (date) => {
    return filteredAssignments.filter((assignment) => {
      // Use reviewDeadline for InReview, deadline for Active
      const assignmentDate = assignment.status === "InReview"
        ? new Date(assignment.reviewDeadline)
        : new Date(assignment.deadline);
      
      return (
        assignmentDate.getDate() === date.getDate() &&
        assignmentDate.getMonth() === date.getMonth() &&
        assignmentDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Calendar logic
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (!selectedSemesterData) return;

    const semStart = new Date(selectedSemesterData.startDate);
    const newDate = new Date(currentYear, currentMonth - 1, 1);

    // Check if new month is within semester range
    if (newDate >= semStart) {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  const handleNextMonth = () => {
    if (!selectedSemesterData) return;

    const semEnd = new Date(selectedSemesterData.endDate);
    const newDate = new Date(currentYear, currentMonth + 1, 1);

    // Check if new month is within semester range
    if (newDate <= semEnd) {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Check if navigation buttons should be disabled
  const isPrevMonthDisabled = () => {
    if (!selectedSemesterData) return true;
    const semStart = new Date(selectedSemesterData.startDate);
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    return currentMonthStart <= semStart;
  };

  const isNextMonthDisabled = () => {
    if (!selectedSemesterData) return true;
    const semEnd = new Date(selectedSemesterData.endDate);
    const nextMonthStart = new Date(currentYear, currentMonth + 1, 1);
    return nextMonthStart > semEnd;
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = 42; // 6 rows × 7 days

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 bg-gray-50 border border-gray-100"></div>
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayAssignments = getAssignmentsForDate(date);
      const isToday =
        day === currentDate.getDate() &&
        currentMonth === currentDate.getMonth() &&
        currentYear === currentDate.getFullYear();

      days.push(
        <motion.div
          key={day}
          whileHover={{
            scale: 1.2,
            zIndex: 50,
            transition: { duration: 0.2 }
          }}
          className={`h-24 border border-gray-200 p-1.5 overflow-visible relative cursor-pointer shadow-sm hover:shadow-xl ${
            isToday ? "bg-orange-50 border-orange-300" : "bg-white"
          }`}
        >
          <div className={`text-xs font-semibold mb-1 ${isToday ? "text-orange-600" : "text-gray-700"}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayAssignments.map((assignment, index) => {
              const isInReview = assignment.status === "InReview";
              const statusBgColor = isInReview ? "bg-yellow-400" : "bg-green-500";
              const statusTextColor = isInReview ? "text-yellow-900" : "text-white";
              
              return (
                <div
                  key={assignment.assignmentId}
                  className={`relative text-[10px] bg-white border border-gray-200 p-1.5 rounded shadow-sm ${
                    index >= 2 ? "hidden group-hover:block" : ""
                  }`}
                  title={`${assignment.title} - ${assignment.sectionCode} - ${assignment.status}`}
                >
                  {/* Status badge in corner */}
                  <div className={`absolute top-0 right-0 ${statusBgColor} ${statusTextColor} text-[8px] px-1.5 py-0.5 rounded-bl rounded-tr font-semibold shadow-sm`}>
                    {assignment.status}
                  </div>
                  
                  <div className="pr-14">
                    <div className="font-semibold text-gray-800 line-clamp-2">{assignment.title}</div>
                    <div className="text-[9px] text-gray-600 mt-0.5">{assignment.sectionCode}</div>
                  </div>
                </div>
              );
            })}
            {dayAssignments.length > 2 && (
              <div className="text-[9px] text-blue-600 font-medium pl-1 group-hover:hidden">
                +{dayAssignments.length - 2} more
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    // Add empty cells to complete the grid
    const remainingCells = totalCells - days.length;
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div key={`empty-end-${i}`} className="h-24 bg-gray-50 border border-gray-100"></div>
      );
    }

    return days;
  };

  const modalContent = isModalOpen && createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Assignment Schedule</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year
                </label>
                <select
                  value={selectedAcademicYear}
                  onChange={(e) => {
                    setSelectedAcademicYear(e.target.value);
                    setSelectedSemester(""); // Reset semester when academic year changes
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Academic Year</option>
                  {academicYears.map((year) => (
                    <option key={year.academicYearId} value={year.academicYearId}>
                      {year.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedAcademicYear && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Semester</option>
                    {semestersForYear.map((semester) => (
                      <option key={semester.semesterId} value={semester.semesterId}>
                        {semester.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Calendar - Only show when semester is selected */}
          {selectedSemester && selectedSemesterData ? (
            <div className="flex-1 overflow-y-auto p-6">
              {/* Calendar Navigation */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={handlePrevMonth}
                  disabled={isPrevMonthDisabled()}
                  className={`p-2 rounded-lg transition-colors ${
                    isPrevMonthDisabled()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold text-gray-800">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <button
                  onClick={handleNextMonth}
                  disabled={isNextMonthDisabled()}
                  className={`p-2 rounded-lg transition-colors ${
                    isNextMonthDisabled()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="mb-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-gray-600 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading assignments...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1 group">{renderCalendarDays()}</div>
                )}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-50 border border-orange-300 rounded"></div>
                  <span className="text-gray-600">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Active (Deadline)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-gray-600">InReview (Review Deadline)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">
                  {!selectedAcademicYear
                    ? "Please select an academic year to view semesters"
                    : "Please select a semester to view the calendar"}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center p-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md"
      >
        <Calendar className="w-5 h-5 mr-2" /> Assignment schedule
      </motion.button>

      {modalContent}
    </>
  );
};

export default AssignmentSchedule;