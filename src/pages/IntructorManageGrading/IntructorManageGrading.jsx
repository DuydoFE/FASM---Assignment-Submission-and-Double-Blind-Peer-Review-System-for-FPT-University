import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getCoursesByUser } from '../../service/courseInstructorService';
import { getClassesByUser } from '../../service/courseInstanceService';
import { getAssignmentsByCourseInstanceId } from '../../service/assignmentService';
import { getSubmissionSummary } from '../../service/instructorSubmission';
import { getCurrentAccount } from '../../utils/accountUtils';
import { autoGradeZero } from '../../service/instructorGrading';

import GradingFilterSection from '../../component/InstructorGrading/GradingFilterSection';
import GradingEmptyState from '../../component/InstructorGrading/GradingEmptyState';
import GradingTable from '../../component/InstructorGrading/GradingTable';
import AutoGradeZeroModal from '../../component/InstructorGrading/AutoGradeZeroModal';

const InstructorManageGrading = () => {
  const currentUser = getCurrentAccount();
  const navigate = useNavigate();
  const location = useLocation();

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
    autoGrading: false
  });

  const [showTable, setShowTable] = useState(false);
  const [showAutoGradeModal, setShowAutoGradeModal] = useState(false);
  
  // Store return state to use after data is loaded
  const [pendingReturnState, setPendingReturnState] = useState(null);

  // Restore state when coming back from detail page
  useEffect(() => {
    if (location.state?.returnState) {
      const returnState = location.state.returnState;
      setPendingReturnState(returnState);
      setSelectedCourseId(returnState.selectedCourseId || '');
      setSearchTerm(returnState.searchTerm || '');
      setStatusFilter(returnState.statusFilter || 'All');
      
      // Clear location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, []);

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

  // When classes are loaded and we have pending return state, set the class
  useEffect(() => {
    if (pendingReturnState && classes.length > 0 && pendingReturnState.selectedClassId) {
      const classExists = classes.some(c => c.courseInstanceId == pendingReturnState.selectedClassId);
      if (classExists) {
        setSelectedClassId(pendingReturnState.selectedClassId);
      }
    }
  }, [classes, pendingReturnState]);

  useEffect(() => {
    if (selectedClassId) {
      fetchAssignments();
    } else {
      setAssignments([]);
      setSelectedAssignmentId('');
    }
  }, [selectedClassId]);

  // When assignments are loaded and we have pending return state, set the assignment and fetch data
  useEffect(() => {
    if (pendingReturnState && assignments.length > 0 && pendingReturnState.selectedAssignmentId) {
      const assignmentExists = assignments.some(a => a.assignmentId == pendingReturnState.selectedAssignmentId);
      if (assignmentExists) {
        setSelectedAssignmentId(pendingReturnState.selectedAssignmentId);
      }
    }
  }, [assignments, pendingReturnState]);

  // Auto-fetch table data when all selections are restored
  useEffect(() => {
    if (pendingReturnState &&
        selectedCourseId &&
        selectedClassId &&
        selectedAssignmentId &&
        pendingReturnState.selectedCourseId == selectedCourseId &&
        pendingReturnState.selectedClassId == selectedClassId &&
        pendingReturnState.selectedAssignmentId == selectedAssignmentId) {
      // All selections are restored, now fetch the table data
      handleViewMarkFromRestore();
      setPendingReturnState(null); // Clear pending state after handling
    }
  }, [selectedCourseId, selectedClassId, selectedAssignmentId, pendingReturnState]);

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

  // Helper function to fetch submission data (shared logic)
  const fetchSubmissionData = async (courseId, classId, assignmentId) => {
    setLoading(prev => ({ ...prev, summary: true }));
    setShowTable(true);
    
    try {
      const response = await getSubmissionSummary({
        courseId: courseId,
        classId: classId,
        assignmentId: assignmentId
      });
      
      const mappedStudents = response.map(submission => ({
        submissionId: submission.submissionId,
        studentId: submission.userId,
        studentCode: submission.studentCode,
        studentName: submission.studentName,
        studentEmail: submission.studentEmail,
        instructorScore: submission.instructorScore,
        score: submission.finalScore !== null && submission.finalScore !== undefined ? submission.finalScore : null,
        feedback: submission.feedback,
        submittedAt: submission.submittedAt,
        gradedAt: submission.gradedAt,
        status: submission.status,
        assignmentStatus: submission.assignmentStatus,
        regradeRequestStatus: submission.regradeRequestStatus
      }));
      
      setStudents(mappedStudents);
      
      const assignmentData = assignments.find(a => a.assignmentId == assignmentId);
      const classData = classes.find(c => c.courseInstanceId == classId);
      if (assignmentData) {
        const submittedCount = mappedStudents.filter(s => s.status === 'Submitted' || s.status === 'Graded').length;
        const gradedCount = mappedStudents.filter(s => s.status === 'Graded').length;
        
        setAssignmentInfo({
          title: assignmentData.title,
          description: assignmentData.description,
          deadline: assignmentData.dueDate,
          maxScore: assignmentData.maxScore || 10,
          totalStudents: mappedStudents.length,
          submitted: submittedCount,
          graded: gradedCount,
          className: classData?.name || classData?.className || 'Class'
        });
      }
    } catch (error) {
      console.error('Error fetching submission summary:', error);
      toast.error('Failed to fetch submission data. Please try again.');
      setShowTable(false);
      setStudents([]);
      setAssignmentInfo(null);
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  const handleViewMark = async () => {
    if (!selectedCourseId || !selectedClassId || !selectedAssignmentId) {
      toast.error('Please select Course, Class, and Assignment');
      return;
    }
    await fetchSubmissionData(selectedCourseId, selectedClassId, selectedAssignmentId);
  };

  // Called when restoring state from navigation - no validation needed
  const handleViewMarkFromRestore = async () => {
    await fetchSubmissionData(selectedCourseId, selectedClassId, selectedAssignmentId);
  };

  const handleStatusClick = () => {
    if (statusFilter === 'All') setStatusFilter('Submitted');
    else if (statusFilter === 'Submitted') setStatusFilter('Graded');
    else if (statusFilter === 'Graded') setStatusFilter('Not Submitted');
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

  const handleGradeClick = (submissionId, status) => {
    if (status === 'Not Submitted') {
      toast.warning('Cannot grade a submission that has not been submitted');
      return;
    }
    
    navigate(`/instructor/grading-detail/${submissionId}`, {
      state: {
        returnState: {
          selectedCourseId,
          selectedClassId,
          selectedAssignmentId,
          showTable,
          searchTerm,
          statusFilter
        }
      }
    });
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
      toast.success('Auto-graded all non-submitted assignments with 0 Scores!');
      await handleViewMarkFromRestore();
    } catch (error) {
      console.error('Error auto-grading:', error);
      toast.error('Failed to auto-grade submissions. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, autoGrading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-white-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Instructor Scores Table</h1>
        
        <GradingFilterSection
          courses={courses}
          classes={classes}
          assignments={assignments}
          selectedCourseId={selectedCourseId}
          selectedClassId={selectedClassId}
          selectedAssignmentId={selectedAssignmentId}
          setSelectedCourseId={setSelectedCourseId}
          setSelectedClassId={setSelectedClassId}
          setSelectedAssignmentId={setSelectedAssignmentId}
          loading={loading}
          onViewMark={handleViewMark}
        />

        {!showTable && (
          <GradingEmptyState
            selectedCourseId={selectedCourseId}
            selectedClassId={selectedClassId}
            selectedAssignmentId={selectedAssignmentId}
          />
        )}

        {showTable && (
          <GradingTable
            assignmentInfo={assignmentInfo}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            handleStatusClick={handleStatusClick}
            filteredStudents={filteredStudents}
            loading={loading}
            onGradeClick={handleGradeClick}
            onAutoGradeZero={handleAutoGradeZero}
            students={students}
            assignmentId={selectedAssignmentId}
            currentUserId={currentUser?.id}
            onRefreshData={handleViewMarkFromRestore}
          />
        )}

        <AutoGradeZeroModal
          isOpen={showAutoGradeModal}
          onClose={() => setShowAutoGradeModal(false)}
          onConfirm={confirmAutoGradeZero}
          loading={loading.autoGrading}
          notSubmittedCount={assignmentInfo?.notSubmitted || students.filter(s => s.status === 'Not Submitted').length}
        />
      </div>
    </div>
  );
};

export default InstructorManageGrading;