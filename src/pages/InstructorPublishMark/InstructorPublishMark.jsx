import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Eye, Loader2, BookOpen, Users, FileText, ArrowRight, CheckCircle2, Edit3, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getCoursesByUser } from '../../service/courseInstructorService';
import { getClassesByUser } from '../../service/courseInstanceService';
import { getAssignmentsByCourseInstanceId } from '../../service/assignmentService';
import { getSubmissionSummary } from '../../service/instructorSubmission';
import { getCurrentAccount } from '../../utils/accountUtils';
import { publishGrades, autoGradeZero } from '../../service/instructorGrading';

const InstructorPublishMark = () => {
  const currentUser = getCurrentAccount();
  const navigate = useNavigate();

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
    summary: false,
    publishing: false,
    autoGrading: false
  });

  const [showTable, setShowTable] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAutoGradeModal, setShowAutoGradeModal] = useState(false);

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

  const handleViewGrades = async () => {
    if (!selectedCourseId || !selectedClassId || !selectedAssignmentId) {
      toast.error('Please select Course, Class, and Assignment');
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
      
      console.log('API Response:', response);
      
      const mappedStudents = response.map(submission => ({
        submissionId: submission.submissionId,
        studentId: submission.userId,
        studentCode: submission.studentCode,
        studentName: submission.studentName,
        studentEmail: submission.studentEmail,
        assignmentTitle: submission.assignmentTitle,
        courseName: submission.courseName,
        className: submission.className,
        peerReview: submission.peerAverageScore !== null && submission.peerAverageScore !== undefined ? submission.peerAverageScore : null,
        instructorGrade: submission.instructorScore !== null && submission.instructorScore !== undefined ? submission.instructorScore : null,
        finalGrade: submission.finalScore !== null && submission.finalScore !== undefined ? submission.finalScore : null,
        feedback: submission.feedback,
        submittedAt: submission.submittedAt,
        gradedAt: submission.gradedAt,
        status: submission.status
      }));
      
      setStudents(mappedStudents);
      
      const assignmentData = assignments.find(a => a.assignmentId == selectedAssignmentId);
      if (assignmentData) {
        const gradedCount = mappedStudents.filter(s => s.status === 'Graded').length;
        const submittedCount = mappedStudents.filter(s => s.status === 'Submitted').length;
        const notSubmittedCount = mappedStudents.filter(s => s.status === 'Not Submitted').length;
        
        setAssignmentInfo({
          title: assignmentData.title,
          description: assignmentData.description,
          deadline: assignmentData.dueDate,
          maxScore: assignmentData.maxScore || 10,
          totalStudents: mappedStudents.length,
          graded: gradedCount,
          submitted: submittedCount,
          notSubmitted: notSubmittedCount
        });
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast.error('Failed to fetch grades data. Please try again.');
      setShowTable(false);
      setStudents([]);
      setAssignmentInfo(null);
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  const handleStatusClick = () => {
    if (statusFilter === 'All') setStatusFilter('Graded');
    else if (statusFilter === 'Graded') setStatusFilter('Submitted');
    else if (statusFilter === 'Submitted') setStatusFilter('Not Submitted');
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

  const getGradeColor = (grade) => {
    if (grade === null || grade === undefined) return 'text-gray-400 bg-gray-50';
    const normalizedGrade = grade / 10;
    if (normalizedGrade >= 8.5) return 'text-green-600 bg-green-50';
    if (normalizedGrade >= 7.0) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Graded':
        return 'bg-green-100 text-green-800';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Not Submitted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePublishGrades = async () => {
    if (!selectedAssignmentId) {
      toast.error('Please select an assignment first');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmPublish = async () => {
    setShowConfirmModal(false);
    setLoading(prev => ({ ...prev, publishing: true }));
    
    try {
      await publishGrades(selectedAssignmentId);
      toast.success('Grades published successfully!');
      
      await handleViewGrades();
    } catch (error) {
      console.error('Error publishing grades:', error);
      toast.error('Failed to publish grades. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, publishing: false }));
    }
  };

  const handleAutoGradeZero = () => {
    if (!selectedAssignmentId) {
      toast.error('Please select an assignment first');
      return;
    }

    const notSubmittedCount = students.filter(s => s.status === 'Not Submitted').length;
    if (notSubmittedCount === 0) {
      toast.info('No students with "Not Submitted" status to grade');
      return;
    }

    setShowAutoGradeModal(true);
  };

  const confirmAutoGradeZero = async () => {
    setShowAutoGradeModal(false);
    setLoading(prev => ({ ...prev, autoGrading: true }));
    
    try {
      await autoGradeZero(selectedAssignmentId);
      toast.success('Auto-graded all non-submitted assignments with 0 points!');
      
      await handleViewGrades();
    } catch (error) {
      console.error('Error auto-grading:', error);
      toast.error('Failed to auto-grade submissions. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, autoGrading: false }));
    }
  };

  const handleEditGrade = (student) => {
    navigate(`/instructor/publish-mark/submission/${student.submissionId}`, {
      state: {
        courseId: selectedCourseId,
        classId: selectedClassId,
        assignmentId: selectedAssignmentId,
        returnPath: '/instructor/publish-mark'
      }
    });
  };

  return (
    <div className="min-h-screen bg-white-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Official Grade Table</h1>
        
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
              onClick={handleViewGrades}
              disabled={!selectedCourseId || !selectedClassId || !selectedAssignmentId || loading.summary}
              className="w-full px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium flex items-center justify-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading.summary ? (
                <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Eye className="inline w-4 h-4 mr-2" />
              )}
              View Grades
            </button>
          </div>
        </div>

        {/* Empty State */}
        {!showTable && (
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 border border-blue-100">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Eye className="w-10 h-10 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                View Published Grades
              </h2>
              <p className="text-gray-600 mb-8">
                Select a course, class, and assignment above to view and manage published grades
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
                  <h3 className="font-semibold text-gray-800 mb-2">Manage Grades</h3>
                  <p className="text-sm text-gray-600">Review and edit grades before publishing to students</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Publication Control</h3>
                  <p className="text-sm text-gray-600">Publish final grades to students when ready</p>
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
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-medium">
                      ✓ {assignmentInfo.graded || 0} graded
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-medium">
                      📝 {assignmentInfo.submitted || 0} submitted
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">
                      ⚠ {assignmentInfo.notSubmitted || 0} not submitted
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-gray-700 font-semibold">
                      Total: {assignmentInfo.totalStudents || 0} students
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
                  <span className="ml-3 text-gray-600">Loading grades...</span>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">No.</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Member</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Full Name</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Average Peer Review</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Instructor Grade</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Final Grade</th>
                      <th
                        onClick={handleStatusClick}
                        className="px-6 py-3 text-center text-sm font-medium text-gray-600 cursor-pointer hover:text-orange-600 select-none"
                      >
                        <div className="flex items-center justify-center gap-1">
                          Status <ChevronDown size={16} />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <tr key={student.studentId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.studentCode}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{student.studentName}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(student.peerReview)}`}>
                              {student.peerReview !== null && student.peerReview !== undefined 
                                ? (student.peerReview / 10).toFixed(1) 
                                : '--'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(student.instructorGrade)}`}>
                              {student.instructorGrade !== null && student.instructorGrade !== undefined 
                                ? (student.instructorGrade / 10).toFixed(1) 
                                : '--'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(student.finalGrade)}`}>
                              {student.finalGrade !== null && student.finalGrade !== undefined 
                                ? (student.finalGrade / 10).toFixed(1) 
                                : '--'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(student.status)}`}>
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                          No students found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button 
                onClick={handleAutoGradeZero}
                disabled={loading.autoGrading || !selectedAssignmentId || assignmentInfo?.notSubmitted === 0}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading.autoGrading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Grading...
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Auto Grade Zero
                  </>
                )}
              </button>
              <button 
                onClick={handlePublishGrades}
                disabled={loading.publishing || !selectedAssignmentId}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium flex items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading.publishing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish Grades'
                )}
              </button>
            </div>
          </>
        )}

        {/* Confirmation Modal for Publish */}
        {showConfirmModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowConfirmModal(false)}
          >
            <div 
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Confirm Publish Grades
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to publish grades for this assignment? Students will be able to see their grades.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPublish}
                  disabled={loading.publishing}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium flex items-center disabled:bg-gray-300"
                >
                  {loading.publishing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Auto Grade Zero */}
        {showAutoGradeModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowAutoGradeModal(false)}
          >
            <div 
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Auto Grade with Zero Points
                </h3>
              </div>
              <p className="text-gray-600 mb-2">
                This will automatically assign <span className="font-semibold text-red-600">0 points</span> to all students with "Not Submitted" status.
              </p>
              <p className="text-gray-600 mb-6">
                <span className="font-semibold">{assignmentInfo?.notSubmitted || 0} student(s)</span> will be affected. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAutoGradeModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAutoGradeZero}
                  disabled={loading.autoGrading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center disabled:bg-gray-300"
                >
                  {loading.autoGrading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Grading...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Confirm Auto Grade
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorPublishMark;