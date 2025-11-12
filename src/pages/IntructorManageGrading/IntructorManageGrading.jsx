import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getCoursesByUser } from '../../service/courseInstructorService';
import { getClassesByUser } from '../../service/courseInstanceService';
import { getAssignmentsByCourseInstanceId } from '../../service/assignmentService';
import { getSubmissionSummary } from '../../service/instructorSubmission';
import { getCurrentAccount } from '../../utils/accountUtils';

import GradingFilterSection from '../../component/InstructorGrading/GradingFilterSection';
import GradingEmptyState from '../../component/InstructorGrading/GradingEmptyState';
import GradingTable from '../../component/InstructorGrading/GradingTable';

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
    summary: false
  });

  const [showTable, setShowTable] = useState(false);

  // Restore state when coming back from detail page
  useEffect(() => {
    if (location.state?.returnState) {
      const { 
        selectedCourseId: courseId, 
        selectedClassId: classId, 
        selectedAssignmentId: assignmentId,
        showTable: wasShowingTable,
        searchTerm: prevSearchTerm,
        statusFilter: prevStatusFilter
      } = location.state.returnState;
      
      setSelectedCourseId(courseId);
      setSelectedClassId(classId);
      setSelectedAssignmentId(assignmentId);
      setShowTable(wasShowingTable);
      setSearchTerm(prevSearchTerm || '');
      setStatusFilter(prevStatusFilter || 'All');
      
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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

  // Auto-fetch data when state is restored
  useEffect(() => {
    if (location.state?.returnState && showTable && selectedCourseId && selectedClassId && selectedAssignmentId) {
      handleViewMark();
    }
  }, [location.state]);

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
        status: submission.status
      }));
      
      setStudents(mappedStudents);
      
      const assignmentData = assignments.find(a => a.assignmentId == selectedAssignmentId);
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
          graded: gradedCount
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

  return (
    <div className="min-h-screen bg-white-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Assignment Grading</h1>
        
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
          />
        )}
      </div>
    </div>
  );
};

export default InstructorManageGrading;