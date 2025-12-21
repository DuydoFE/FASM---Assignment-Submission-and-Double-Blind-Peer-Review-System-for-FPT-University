import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getAssignmentsByCourseInstanceId } from '../../service/assignmentService';
import { getSubmissionSummary } from '../../service/instructorSubmission';
import { getCurrentAccount } from '../../utils/accountUtils';
import { autoGradeZero } from '../../service/instructorGrading';
import { getCourseInstanceById } from '../../service/courseInstanceService';

import GradingFilterSection from '../../component/InstructorGrading/GradingFilterSection';
import GradingEmptyState from '../../component/InstructorGrading/GradingEmptyState';
import GradingTable from '../../component/InstructorGrading/GradingTable';
import AutoGradeZeroModal from '../../component/InstructorGrading/AutoGradeZeroModal';

const InstructorManageGrading = () => {
  const currentUser = getCurrentAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const { courseInstanceId } = useParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignmentInfo, setAssignmentInfo] = useState(null);
  const [courseInstanceData, setCourseInstanceData] = useState(null);
  
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  
  const [loading, setLoading] = useState({
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
      setSearchTerm(returnState.searchTerm || '');
      setStatusFilter(returnState.statusFilter || 'All');
      
      // Clear location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, []);

  useEffect(() => {
    if (courseInstanceId) {
      fetchAssignments();
      fetchCourseInstanceData();
    }
  }, [courseInstanceId]);

  const fetchCourseInstanceData = async () => {
    try {
      const response = await getCourseInstanceById(courseInstanceId);
      setCourseInstanceData(response);
    } catch (error) {
      console.error('Failed to fetch course instance data:', error);
    }
  };

  // When assignments are loaded and we have pending return state, set the assignment and fetch data
  useEffect(() => {
    if (pendingReturnState && assignments.length > 0 && pendingReturnState.selectedAssignmentId) {
      const assignmentExists = assignments.some(a => a.assignmentId == pendingReturnState.selectedAssignmentId);
      if (assignmentExists) {
        setSelectedAssignmentId(pendingReturnState.selectedAssignmentId);
      }
    }
  }, [assignments, pendingReturnState]);

  // Auto-fetch table data when assignment selection is restored
  useEffect(() => {
    if (pendingReturnState &&
        selectedAssignmentId &&
        pendingReturnState.selectedAssignmentId == selectedAssignmentId) {
      // Selection is restored, now fetch the table data
      handleViewMarkFromRestore();
      setPendingReturnState(null); // Clear pending state after handling
    }
  }, [selectedAssignmentId, pendingReturnState]);

  const fetchAssignments = async () => {
    setLoading(prev => ({ ...prev, assignments: true }));
    try {
      const data = await getAssignmentsByCourseInstanceId(courseInstanceId);
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(prev => ({ ...prev, assignments: false }));
    }
  };

  // Helper function to fetch submission data (shared logic)
  const fetchSubmissionData = async (assignmentId) => {
    setLoading(prev => ({ ...prev, summary: true }));
    setShowTable(true);
    
    try {
      const response = await getSubmissionSummary({
        courseId: null,
        classId: null,
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
          className: 'Class'
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
    if (!selectedAssignmentId) {
      toast.error('Please select an Assignment');
      return;
    }
    await fetchSubmissionData(selectedAssignmentId);
  };

  // Called when restoring state from navigation - no validation needed
  const handleViewMarkFromRestore = async () => {
    await fetchSubmissionData(selectedAssignmentId);
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
          courseInstanceId,
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Instructor Scores Table</h1>
          <div className="flex items-center space-x-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Course: {courseInstanceData?.courseCode || "N/A"}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Class: {courseInstanceData?.sectionCode || "N/A"}
            </span>
          </div>
        </div>
        
        <GradingFilterSection
          assignments={assignments}
          selectedAssignmentId={selectedAssignmentId}
          setSelectedAssignmentId={setSelectedAssignmentId}
          loading={loading}
          onViewMark={handleViewMark}
        />

        {!showTable && (
          <GradingEmptyState
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