import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Eye, Loader2, BookOpen, Users, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

import { getCoursesByUser } from '../../service/courseInstructorService';
import { getClassesByUser } from '../../service/courseInstanceService';
import { getAssignmentsByCourseInstanceId } from '../../service/assignmentService';
import { getSubmissionSummary } from '../../service/instructorSubmission';
import { getCurrentAccount } from '../../utils/accountUtils';

const InstructorManageGrading = () => {
  const currentUser = getCurrentAccount();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignmentInfo, setAssignmentInfo] = useState(null);
  
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  
  const [loading, setLoading] = useState({
    courses: false,
    classes: false,
    assignments: false,
    summary: false
  });

  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchClasses();
    } else {
      setClasses([]);
      setSelectedClassId('');
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedClassId) {
      fetchAssignments();
    } else {
      setAssignments([]);
      setSelectedAssignmentId('');
    }
  }, [selectedClassId]);

  const fetchCourses = async () => {
    setLoading(prev => ({ ...prev, courses: true }));
    try {
      const data = await getCoursesByUser(currentUser.id);
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const fetchClasses = async () => {
    setLoading(prev => ({ ...prev, classes: true }));
    try {
      const data = await getClassesByUser(currentUser.id, selectedCourseId);
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(prev => ({ ...prev, classes: false }));
    }
  };

  const fetchAssignments = async () => {
    setLoading(prev => ({ ...prev, assignments: true }));
    try {
      const data = await getAssignmentsByCourseInstanceId(selectedClassId);
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(prev => ({ ...prev, assignments: false }));
    }
  };

  const handleViewMark = async () => {
    if (!selectedCourseId || !selectedClassId || !selectedAssignmentId) {
      alert('Please select Course, Class, and Assignment');
      return;
    }

    setLoading(prev => ({ ...prev, summary: true }));
    setShowTable(true);
    
    try {
      const response = await getSubmissionSummary({
        courseId: selectedCourseId,
        classId: selectedClassId,
        assignmentId: selectedAssignmentId
      });
      
      const mappedStudents = response.map(submission => ({
        submissionId: submission.submissionId,
        studentId: submission.userId,
        studentCode: submission.studentCode,
        studentName: submission.studentName,
        studentEmail: submission.studentEmail,
        score: submission.finalScore !== null && submission.finalScore !== undefined ? submission.finalScore : null,
        feedback: submission.feedback,
        submittedAt: submission.submittedAt,
        gradedAt: submission.gradedAt,
        status: submission.status.toLowerCase()
      }));
      
      setStudents(mappedStudents);
      
      const assignmentData = assignments.find(a => a.assignmentId == selectedAssignmentId);
      if (assignmentData) {
        const submittedCount = mappedStudents.filter(s => s.status !== 'not-submitted').length;
        const gradedCount = mappedStudents.filter(s => s.status === 'graded').length;
        
        setAssignmentInfo({
          title: assignmentData.title,
          description: assignmentData.description,
          deadline: assignmentData.dueDate,
          maxScore: assignmentData.maxScore || 10,
          totalStudents: mappedStudents.length,
          submitted: submittedCount,
          graded: gradedCount
        });
      }
    } catch (error) {
      console.error('Error fetching submission summary:', error);
      alert('Failed to fetch submission data. Please try again.');
      setShowTable(false);
      setStudents([]);
      setAssignmentInfo(null);
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  const handleStatusClick = () => {
    if (statusFilter === 'All') setStatusFilter('submitted');
    else if (statusFilter === 'submitted') setStatusFilter('not-submitted');
    else if (statusFilter === 'not-submitted') setStatusFilter('graded');
    else setStatusFilter('All');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode?.includes(searchTerm);
    const matchesStatus =
      statusFilter === 'All' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getScoreStyle = (score) => {
    if (score === null || score === undefined) return 'border-gray-300 text-gray-400';
    const normalizedScore = score / 10;
    if (normalizedScore >= 8) return 'border-green-500 text-green-600';
    if (normalizedScore >= 6.5) return 'border-green-400 text-green-500';
    return 'border-red-400 text-red-500';
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'graded': return 'bg-green-100 text-green-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'not-submitted': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'graded': return 'Graded';
      case 'submitted': return 'Submitted';
      case 'not-submitted': return 'Not Submitted';
      default: return '';
    }
  };

  const getSubmissionTimeStyle = (status) => {
    return 'text-gray-600';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('vi-VN');
    const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    return { date: dateStr, time: timeStr };
  };

  return (
    <div className="min-h-screen bg-white-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Assignment Grading</h1>
        
        {/* Filters */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Course</label>
            <div className="relative">
              <select 
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                disabled={loading.courses}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Class</label>
            <div className="relative">
              <select 
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                disabled={!selectedCourseId || loading.classes}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.courseInstanceId} value={cls.courseInstanceId}>
                    {cls.sectionCode}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Assignment</label>
            <div className="relative">
              <select 
                value={selectedAssignmentId}
                onChange={(e) => setSelectedAssignmentId(e.target.value)}
                disabled={!selectedClassId || loading.assignments}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select Assignment</option>
                {assignments.map(assignment => (
                  <option key={assignment.assignmentId} value={assignment.assignmentId}>
                    {assignment.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">&nbsp;</label>
            <button 
              onClick={handleViewMark}
              disabled={!selectedCourseId || !selectedClassId || !selectedAssignmentId || loading.summary}
              className="w-full px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium flex items-center justify-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading.summary ? (
                <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Eye className="inline w-4 h-4 mr-2" />
              )}
              View Mark
            </button>
          </div>
        </div>

        {/* Empty State - Show when no table is displayed */}
        {!showTable && (
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 border border-blue-100">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Eye className="w-10 h-10 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                View Student Submissions
              </h2>
              <p className="text-gray-600 mb-8">
                Select a course, class, and assignment above to view and grade student submissions
              </p>

              {/* Step indicators */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all ${selectedCourseId ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200'}`}>
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">1. Select Course</span>
                  {selectedCourseId && <CheckCircle2 className="w-5 h-5" />}
                </div>

                <ArrowRight className={`w-5 h-5 ${selectedCourseId ? 'text-blue-500' : 'text-gray-300'}`} />

                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all ${selectedClassId ? 'bg-purple-500 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200'}`}>
                  <Users className="w-5 h-5" />
                  <span className="font-medium">2. Select Class</span>
                  {selectedClassId && <CheckCircle2 className="w-5 h-5" />}
                </div>

                <ArrowRight className={`w-5 h-5 ${selectedClassId ? 'text-purple-500' : 'text-gray-300'}`} />

                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all ${selectedAssignmentId ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200'}`}>
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">3. Select Assignment</span>
                  {selectedAssignmentId && <CheckCircle2 className="w-5 h-5" />}
                </div>
              </div>

              {/* Features list */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Search & Filter</h3>
                  <p className="text-sm text-gray-600">Quickly find students and filter by submission status</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Grade Submissions</h3>
                  <p className="text-sm text-gray-600">Review and grade student work with detailed feedback</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Track Progress</h3>
                  <p className="text-sm text-gray-600">Monitor submission and grading statistics</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showTable && (
          <>
            {/* Assignment Info Card */}
            {assignmentInfo && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                      {assignmentInfo.title}
                    </h2>
                    <p className="text-gray-600">{assignmentInfo.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-medium mb-1">
                      Deadline: {formatDateTime(assignmentInfo.deadline).date} - {formatDateTime(assignmentInfo.deadline).time}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-medium">
                      ✓ {assignmentInfo.submitted || 0}/{assignmentInfo.totalStudents || 0} submitted
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-600 font-medium">
                      ⭐ {assignmentInfo.graded || 0}/{assignmentInfo.submitted || 0} graded
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {loading.summary ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-3 text-gray-600">Loading students...</span>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Member</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Full Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Score</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Feedback</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Submission Time</th>
                      <th
                        onClick={handleStatusClick}
                        className="px-6 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:text-orange-600 select-none flex items-center gap-1"
                      >
                        Status <ChevronDown size={16} />
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => {
                        const submissionTime = formatDateTime(student.submittedAt);
                        return (
                          <tr key={student.studentId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-600">{student.studentCode}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{student.studentName}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center justify-center w-20 h-10 border-2 rounded-lg font-semibold ${getScoreStyle(student.score)}`}>
                                {student.score !== null && student.score !== undefined 
                                  ? `${(student.score / 10).toFixed(1)}` 
                                  : '--'} / {(assignmentInfo?.maxScore || 10) }
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {student.feedback || 'No feedback yet'}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {student.submittedAt ? (
                                <div className={getSubmissionTimeStyle(student.status)}>
                                  {submissionTime.date}<br />
                                  {submissionTime.time}
                                </div>
                              ) : (
                                <span className="text-gray-400">--</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(student.status)}`}>
                                {getStatusText(student.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {student.status === 'submitted' ? (
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                                  Grade
                                </button>
                              ) : student.status === 'graded' ? (
                                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                                  Re-grade
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          No students found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default InstructorManageGrading;