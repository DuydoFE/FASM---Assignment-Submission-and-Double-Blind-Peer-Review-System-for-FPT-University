import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Filter, Award, TrendingUp } from "lucide-react";
import { getAllAcademicYears, getSemestersByAcademicYear } from "../../service/adminService";
import api from "../../config/axios";

const ViewScoresModal = ({ studentId, isOpen, onClose }) => {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [semestersForYear, setSemestersForYear] = useState([]);

  // Fetch academic years
  const { data: academicYearsData } = useQuery({
    queryKey: ["academicYears"],
    queryFn: getAllAcademicYears,
    enabled: isOpen,
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

  // Fetch student scores for selected semester
  const { data: scoresData, isLoading } = useQuery({
    queryKey: ["studentFinalScores", studentId, selectedSemester],
    queryFn: async () => {
      if (!selectedSemester || !studentId) return { data: [] };
      const response = await api.get(`/StudentReview/student/${studentId}/semester/${selectedSemester}/final-scores`);
      return response.data;
    },
    enabled: isOpen && !!studentId && !!selectedSemester,
  });

  // Extract data from API response
  const academicYears = academicYearsData?.data || [];
  const scores = scoresData?.data || [];

  // Calculate statistics
  const averageScore = scores.length > 0
    ? (scores.reduce((sum, item) => sum + (item.finalScore || 0), 0) / scores.length).toFixed(2)
    : 0;

  const passedCount = scores.filter(item => item.finalScore >= 5).length;
  const failedCount = scores.filter(item => item.finalScore < 5).length;

  const getScoreColor = (score) => {
    if (score >= 8.5) return "text-green-600 bg-green-50";
    if (score >= 7) return "text-blue-600 bg-blue-50";
    if (score >= 5) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreGrade = (score) => {
    if (score >= 8.5) return "A";
    if (score >= 7) return "B";
    if (score >= 5.5) return "C";
    if (score >= 4) return "D";
    return "F";
  };

  const modalContent = isOpen && createPortal(
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
                <FileText className="w-6 h-6" />
                <h2 className="text-2xl font-bold">View All Scores</h2>
              </div>
              <button
                onClick={onClose}
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
                    setSelectedSemester("");
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

          {/* Statistics Cards - Only show when semester is selected and data is loaded */}
          {selectedSemester && !isLoading && scores.length > 0 && (
            <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 rounded-xl shadow-md border border-orange-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Average Score</p>
                      <p className="text-2xl font-bold text-orange-600">{averageScore}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 rounded-xl shadow-md border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Passed</p>
                      <p className="text-2xl font-bold text-green-600">{passedCount}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 rounded-xl shadow-md border border-red-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Failed</p>
                      <p className="text-2xl font-bold text-red-600">{failedCount}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Scores Table - Only show when semester is selected */}
          {selectedSemester ? (
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-gray-500">Loading scores...</div>
                </div>
              ) : scores.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="text-left p-4 font-semibold text-gray-700">Course Code</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Course Name</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Section</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Assignment</th>
                        <th className="text-center p-4 font-semibold text-gray-700">Score</th>
                        <th className="text-center p-4 font-semibold text-gray-700">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.map((item, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: "#f9fafb" }}
                          className="border-b border-gray-200"
                        >
                          <td className="p-4">
                            <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {item.courseCode}
                            </span>
                          </td>
                          <td className="p-4 text-gray-800 font-medium">{item.courseName}</td>
                          <td className="p-4">
                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {item.sectionCode}
                            </span>
                          </td>
                          <td className="p-4 text-gray-700">{item.assignmentTitle}</td>
                          <td className="p-4 text-center">
                            <span className={`font-bold text-lg px-3 py-1 rounded-lg ${getScoreColor(item.finalScore)}`}>
                              {item.finalScore?.toFixed(2) || "N/A"}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`font-bold text-lg px-3 py-1 rounded-lg ${getScoreColor(item.finalScore)}`}>
                              {getScoreGrade(item.finalScore)}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-500">
                    No scores found for this semester
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">
                  {!selectedAcademicYear
                    ? "Please select an academic year to view semesters"
                    : "Please select a semester to view scores"}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );

  return modalContent;
};

export default ViewScoresModal;