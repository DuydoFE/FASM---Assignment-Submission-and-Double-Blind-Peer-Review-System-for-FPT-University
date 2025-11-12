import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getCoursesByUser } from '../../service/courseInstructorService';
import { getClassesByUser } from '../../service/courseInstanceService';
import { getAssignmentsByCourseInstanceId } from '../../service/assignmentService';
import { getSubmissionSummary } from '../../service/instructorSubmission';
import { getCurrentAccount } from '../../utils/accountUtils';
import { publishGrades, autoGradeZero } from '../../service/instructorGrading';

import FilterSection from '../../component/InstructorPublish/FilterSection';
import EmptyState from '../../component/InstructorPublish/EmptyState';
import GradesTable from '../../component/InstructorPublish/GradesTable';
import PublishGradesModal from '../../component/InstructorPublish/PublishGradesModal';
import AutoGradeZeroModal from '../../component/InstructorPublish/AutoGradeZeroModal';

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

  const handlePublishGrades = () => {
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

  return (
    <div className="min-h-screen bg-white-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Official Grade Table</h1>
        
        <FilterSection
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
          onViewGrades={handleViewGrades}
        />

        {!showTable && (
          <EmptyState
            selectedCourseId={selectedCourseId}
            selectedClassId={selectedClassId}
            selectedAssignmentId={selectedAssignmentId}
          />
        )}

        {showTable && (
          <GradesTable
            assignmentInfo={assignmentInfo}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            handleStatusClick={handleStatusClick}
            filteredStudents={filteredStudents}
            loading={loading}
            onAutoGradeZero={handleAutoGradeZero}
            onPublishGrades={handlePublishGrades}
          />
        )}

        <PublishGradesModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmPublish}
          loading={loading.publishing}
        />

        <AutoGradeZeroModal
          isOpen={showAutoGradeModal}
          onClose={() => setShowAutoGradeModal(false)}
          onConfirm={confirmAutoGradeZero}
          loading={loading.autoGrading}
          notSubmittedCount={assignmentInfo?.notSubmitted}
        />
      </div>
    </div>
  );
};

export default InstructorPublishMark;