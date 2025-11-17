import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, BookOpen, Users } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { submissionService } from '../../service/submissionService';

const InstructorManageSubmission = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('All');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignmentInfo, setAssignmentInfo] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await submissionService.getSubmissionsByAssignment(assignmentId);

      const submissionsData = response?.data?.submissions || [];

      const mappedSubmissions = submissionsData.map(submission => ({
        name: submission.studentName,
        mssv: submission.studentCode,
        status: submission.status || 'Not Submitted',
        statusColor: getStatusColor(submission.status),
        submitTime: submission.submittedAt
          ? new Date(submission.submittedAt).toLocaleString('vi-VN')
          : '--',
        hasDetail: submission.submissionId != null,
        submissionId: submission.submissionId
      }));

      setSubmissions(mappedSubmissions);

      if (submissionsData.length > 0) {
        // Get course and class info from first submission
        const firstSubmission = submissionsData[0];
        setAssignmentInfo({
          title: firstSubmission.assignment?.title || 'N/A',
          deadline: firstSubmission.assignment?.deadline,
          courseName: firstSubmission.courseName || 'N/A',
          className: firstSubmission.className || 'N/A'
        });
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (student) => {
    if (!student.hasDetail) return;

    try {
      await submissionService.getSubmissionDetails(student.submissionId);
      navigate(`/instructor/submission-detail/${student.submissionId}`);
    } catch (error) {
      console.error('Failed to fetch submission details:', error);
      toast.error('Failed to load submission details. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Graded':
        return 'bg-green-100 text-green-800';
      case 'Not Submitted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusClick = () => {
    if (statusFilter === 'All') setStatusFilter('Submitted');
    else if (statusFilter === 'Submitted') setStatusFilter('Graded');
    else if (statusFilter === 'Graded') setStatusFilter('Not Submitted');
    else setStatusFilter('All');
  };

  const filteredStudents = submissions.filter(student =>
    statusFilter === 'All' || student.status === statusFilter
  );

  const totalStudents = submissions.length;
  const submittedCount = submissions.filter(s => s.status === 'Submitted').length;
  const gradedCount = submissions.filter(s => s.status === 'Graded').length;
  const notSubmittedCount = submissions.filter(s => s.status === 'Not Submitted').length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Back</span>
          </button>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-semibold text-gray-800">
            {assignmentInfo?.title || 'Assignment'}
          </h1>
          <p className="text-sm text-gray-500">
            Deadline: {assignmentInfo?.deadline
              ? new Date(assignmentInfo.deadline).toLocaleString('vi-VN')
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Course and Class Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Course</p>
              <p className="text-sm font-semibold text-gray-800">
                {assignmentInfo?.courseName || 'N/A'}
              </p>
            </div>
          </div>
          <div className="h-8 w-px bg-blue-300"></div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Class</p>
              <p className="text-sm font-semibold text-gray-800">
                {assignmentInfo?.className || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Submissions</h2>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Students</p>
          <p className="text-3xl font-bold text-gray-800">{totalStudents}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Submitted</p>
          <p className="text-3xl font-bold text-blue-600">{submittedCount}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Graded</p>
          <p className="text-3xl font-bold text-green-600">{gradedCount}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Not Submitted</p>
          <p className="text-3xl font-bold text-gray-600">{notSubmittedCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Student Code</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Full Name</th>
              <th
                onClick={handleStatusClick}
                className="px-6 py-4 text-left text-sm font-medium text-gray-600 cursor-pointer select-none hover:text-orange-600 transition"
              >
                <div className="flex items-center gap-1">
                  Submission Status
                  <ChevronDown size={16} />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Submission Time</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">{student.mssv}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{student.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${student.statusColor}`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.submitTime}</td>
                <td className="px-6 py-4">
                  {student.status !== "Not Submitted" && (
                    <button
                      onClick={() => handleViewDetails(student)}
                      className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorManageSubmission;