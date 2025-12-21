import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { getAllAcademicYears, getAllSemesters } from "../../service/adminService";
import { assignmentService } from "../../service/assignmentService";

const AssignmentSchedule = ({ studentId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Fetch academic years
  const { data: academicYearsData } = useQuery({
    queryKey: ["academicYears"],
    queryFn: getAllAcademicYears,
    enabled: isModalOpen,
  });

  // Fetch semesters
  const { data: semestersData } = useQuery({
    queryKey: ["semesters"],
    queryFn: getAllSemesters,
    enabled: isModalOpen,
  });

  // Fetch student assignments
  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: ["studentAssignments", studentId],
    queryFn: () => assignmentService.getStudentAssignments(studentId),
    enabled: isModalOpen && !!studentId,
  });

  const academicYears = academicYearsData?.data || [];
  const semesters = semestersData?.data || [];
  const assignments = assignmentsData?.data || [];

  // Filter semesters by selected academic year
  const filteredSemesters = React.useMemo(() => {
    if (!selectedAcademicYear) return semesters;
    return semesters.filter(
      (sem) => sem.academicYearId === parseInt(selectedAcademicYear)
    );
  }, [selectedAcademicYear, semesters]);

  // Filter assignments by selected semester and academic year
  const filteredAssignments = React.useMemo(() => {
    let filtered = assignments;

    if (selectedSemester) {
      const semester = semesters.find(
        (s) => s.semesterId === parseInt(selectedSemester)
      );
      if (semester) {
        filtered = filtered.filter((assignment) => {
          const deadline = new Date(assignment.deadline);
          const semStart = new Date(semester.startDate);
          const semEnd = new Date(semester.endDate);
          return deadline >= semStart && deadline <= semEnd;
        });
      }
    }

    return filtered;
  }, [assignments, selectedSemester, semesters]);

  // Get assignments for a specific date
  const getAssignmentsForDate = (date) => {
    return filteredAssignments.filter((assignment) => {
      const deadline = new Date(assignment.deadline);
      return (
        deadline.getDate() === date.getDate() &&
        deadline.getMonth() === date.getMonth() &&
        deadline.getFullYear() === date.getFullYear()
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
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = 42; // 6 rows × 7 days

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 bg-gray-50 border border-gray-100"></div>
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
        <div
          key={day}
          className={`h-20 border border-gray-200 p-1 overflow-hidden ${
            isToday ? "bg-orange-50 border-orange-300" : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className={`text-xs font-semibold mb-1 ${isToday ? "text-orange-600" : "text-gray-700"}`}>
            {day}
          </div>
          <div className="space-y-0.5">
            {dayAssignments.slice(0, 2).map((assignment) => (
              <div
                key={assignment.assignmentId}
                className="text-[10px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded truncate"
                title={assignment.title}
              >
                {assignment.title}
              </div>
            ))}
            {dayAssignments.length > 2 && (
              <div className="text-[9px] text-gray-500 pl-1">
                +{dayAssignments.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    // Add empty cells to complete the grid
    const remainingCells = totalCells - days.length;
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div key={`empty-end-${i}`} className="h-20 bg-gray-50 border border-gray-100"></div>
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
                  <option value="">All Academic Years</option>
                  {academicYears.map((year) => (
                    <option key={year.academicYearId} value={year.academicYearId}>
                      {year.yearName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={!selectedAcademicYear}
                >
                  <option value="">All Semesters</option>
                  {filteredSemesters.map((semester) => (
                    <option key={semester.semesterId} value={semester.semesterId}>
                      {semester.semesterName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Calendar Navigation */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-gray-800">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-50 border border-orange-300 rounded"></div>
                <span className="text-gray-600">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 rounded"></div>
                <span className="text-gray-600">Assignment Deadline</span>
              </div>
            </div>
          </div>
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