import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Link, ChevronDown } from 'lucide-react';
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

      // FIX: Lấy data từ response.data.submissions thay vì response
      const submissionsData = response?.data?.submissions || [];

      // Map the API response to the component's data structure
      const mappedSubmissions = submissionsData.map(submission => ({
        name: submission.user?.fullName || 'N/A',  // FIX: Lấy từ user.fullName
        mssv: submission.user?.studentId || 'N/A', // FIX: Lấy từ user.studentId
        status: getSubmissionStatus(submission),
        statusColor: getStatusColor(submission),
        submitTime: submission.submittedAt
          ? new Date(submission.submittedAt).toLocaleString('vi-VN')
          : '--',
        file: submission.fileUrl || submission.fileName || '--',
        fileType: submission.fileUrl ? (submission.fileUrl.startsWith('http') ? 'link' : 'file') : null,
        hasDetail: submission.submissionId != null,
        submissionId: submission.submissionId,
        keywords: submission.keywords || ''
      }));

      setSubmissions(mappedSubmissions);

      // Set assignment info từ nested assignment object
      if (submissionsData.length > 0 && submissionsData[0].assignment) {
        setAssignmentInfo({
          title: submissionsData[0].assignment.title,
          deadline: submissionsData[0].assignment.deadline
        });
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionStatus = (submission) => {
    if (!submission.submittedAt) return 'Not Submitted';

    const submitDate = new Date(submission.submittedAt);
    const deadline = new Date(submission.deadline);

    if (submitDate > deadline) return 'Late Submission';
    return 'Submitted';
  };

  const getStatusColor = (submission) => {
    const status = getSubmissionStatus(submission);
    switch (status) {
      case 'Submitted':
        return 'bg-green-100 text-green-800';
      case 'Late Submission':
        return 'bg-red-100 text-red-800';
      case 'Not Submitted':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusClick = () => {
    if (statusFilter === 'All') setStatusFilter('Submitted');
    else if (statusFilter === 'Submitted') setStatusFilter('Not Submitted');
    else if (statusFilter === 'Not Submitted') setStatusFilter('Late Submission');
    else setStatusFilter('All');
  };

  const filteredStudents = submissions.filter(student =>
    statusFilter === 'All' || student.status === statusFilter
  );

  const totalStudents = submissions.length;
  const submittedCount = submissions.filter(s => s.status === 'Submitted').length;
  const notSubmittedCount = submissions.filter(s => s.status === 'Not Submitted').length;
  const lateSubmissionCount = submissions.filter(s => s.status === 'Late Submission').length;

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
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

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Submissions</h2>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Students</p>
          <p className="text-3xl font-bold text-gray-800">{totalStudents}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Submitted</p>
          <p className="text-3xl font-bold text-green-600">{submittedCount}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Not Submitted</p>
          <p className="text-3xl font-bold text-yellow-600">{notSubmittedCount}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Late Submissions</p>
          <p className="text-3xl font-bold text-red-600">{lateSubmissionCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Member</th>
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
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">File/Link Submitted</th>
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
                  {student.file !== "--" && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      {student.fileType === "file" ? (
                        <FileText className="w-4 h-4" />
                      ) : (
                        <Link className="w-4 h-4" />
                      )}
                      <span className="truncate max-w-xs">{student.file}</span>
                    </div>
                  )}
                  {student.file === "--" && (
                    <span className="text-sm text-gray-400">--</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {student.hasDetail ? (
                    <button
                      onClick={() => {
                        // Navigate to submission detail page
                        navigate(`/instructor/submission-detail/${student.submissionId}`);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-gray-100 text-gray-400 text-sm rounded-lg cursor-not-allowed">
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