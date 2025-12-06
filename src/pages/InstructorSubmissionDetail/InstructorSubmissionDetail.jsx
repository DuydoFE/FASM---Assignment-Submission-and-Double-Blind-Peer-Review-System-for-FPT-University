import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText, Eye, Download, ArrowLeft, BookOpen, Users } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { submissionService } from '../../service/submissionService';
import { downloadFile } from '../../utils/fileDownload';

const InstructorSubmissionDetail = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState(null);

  useEffect(() => {
    fetchSubmissionDetails();
  }, [submissionId]);

  const fetchSubmissionDetails = async () => {
    try {
      setLoading(true);
      const response = await submissionService.getSubmissionDetails(submissionId);

      const data = response?.data || response;
      setSubmissionData(data);
    } catch (error) {
      console.error('Failed to fetch submission details:', error);
      toast.error('Failed to load submission details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      await downloadFile(fileUrl, fileName);
      toast.success('File downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file. Please try again.');
    }
  };

  const getSubmissionStatusInfo = () => {
    const status = submissionData?.status?.toLowerCase();
    const submittedAt = submissionData?.submittedAt;
    const deadline = submissionData?.assignment?.deadline;

    if (status === "not submitted" || status === "notsubmitted" || !submittedAt) {
      return {
        status: "Not Submitted",
        color: "bg-gray-100 text-gray-800",
        message: "Student has not submitted yet"
      };
    }

    if (status === "submitted") {
      if (!deadline) {
        return {
          status: "Submitted",
          color: "bg-blue-100 text-blue-800",
          message: "Awaiting grading"
        };
      }

      const submitDate = new Date(submittedAt);
      const deadlineDate = new Date(deadline);
      const diffTime = deadlineDate - submitDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (submitDate > deadlineDate) {
        return {
          status: "Late Submission",
          color: "bg-red-100 text-red-800",
          message: `${Math.abs(diffDays)} days after deadline`
        };
      }

      return {
        status: "Submitted",
        color: "bg-blue-100 text-blue-800",
        message: diffDays > 0 ? `${diffDays} days before deadline` : "On deadline"
      };
    }

    if (status === "graded") {
      return {
        status: "Graded",
        color: "bg-green-100 text-green-800",
        message: "Grading completed"
      };
    }

    return {
      status: "Unknown",
      color: "bg-gray-100 text-gray-800",
      message: "Status not recognized"
    };
  };



  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (!submissionData) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">No submission data found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getSubmissionStatusInfo();

  const studentInitials = submissionData?.studentName
    ?.split(' ')
    .slice(-2)
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'NA';

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      {/* Breadcrumb & Back Button */}
      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <span>Class List</span>
          <ChevronRight className="w-4 h-4" />
          <span>{submissionData?.courseName || 'Course'}</span>
          <ChevronRight className="w-4 h-4" />
          <span>{submissionData?.assignment?.title || 'Assignment'}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium">
            {submissionData?.studentName || 'Student'}
          </span>
        </nav>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
          <span className="text-gray-600">Back</span>
        </button>
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
                {submissionData?.courseName || 'N/A'}
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
                {submissionData?.className || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {studentInitials}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {submissionData?.studentName || 'N/A'}
            </h1>
            <p className="text-gray-500">
              Student ID: {submissionData?.studentCode || 'N/A'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.status}
            </span>
          </div>
          {submissionData?.submittedAt && (
            <>
              <p className="text-sm text-gray-800 font-medium">
                Submitted on: {new Date(submissionData.submittedAt).toLocaleString('vi-VN')}
              </p>
              <p className={`text-sm ${statusInfo.status === 'Late Submission' ? 'text-red-600' : 'text-green-600'}`}>
                {statusInfo.message}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Assignment Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          {submissionData?.assignment?.title || 'Assignment'}
        </h2>
        <p className="text-gray-600">
          {submissionData?.assignment?.description || 'No description available'}
        </p>

      </div>

      {/* Grading Info */}
      {submissionData?.status === 'Graded' && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Grading Information</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Instructor Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {submissionData.instructorScore || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Peer Average Score</p>
              <p className="text-2xl font-bold text-green-600">
                {submissionData.peerAverageScore || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Final Score</p>
              <p className="text-2xl font-bold text-orange-600">
                {submissionData.finalScore || 0}
              </p>
            </div>
          </div>
          {submissionData?.feedback && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Feedback:</p>
              <p className="text-sm text-gray-600 mt-1">{submissionData.feedback}</p>
            </div>
          )}
          {submissionData?.gradedAt && (
            <p className="text-xs text-gray-500 mt-2">
              Graded on: {new Date(submissionData.gradedAt).toLocaleString('vi-VN')}
            </p>
          )}
        </div>
      )}

      {/* Submitted File */}
      {submissionData?.fileUrl && submissionData.fileUrl !== 'Not Submitted' && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Submitted File</h3>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {submissionData.fileName || submissionData.originalFileName || 'Submitted File'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {submissionData.submittedAt && (
                      <span>🕒 Updated: {new Date(submissionData.submittedAt).toLocaleString('vi-VN')}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(submissionData.fileUrl, submissionData.fileName || submissionData.originalFileName || 'submission-file')}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Placeholder */}
      {submissionData?.fileUrl && submissionData.fileUrl !== 'Not Submitted' && (
        <div className="mb-8">
          <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-20 mx-auto mb-4 border-2 border-gray-300 rounded-lg bg-white flex items-center justify-center">
                <FileText className="w-8 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-600 mb-2">File Preview</h4>
              <p className="text-sm text-gray-500 mb-6">
                {submissionData.originalFileName || 'Click download to view the file'}
              </p>

              <div className="flex items-center justify-center gap-4">
                <a
                  href={submissionData.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  Open File
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to List
        </button>
        {submissionData?.status !== 'Graded' && (
          <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Grade Submission
          </button>
        )}
      </div>
    </div>
  );
};

export default InstructorSubmissionDetail;