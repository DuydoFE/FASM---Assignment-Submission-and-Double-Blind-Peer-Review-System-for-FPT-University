import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText, Eye, Download, Expand, Maximize2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { submissionService } from '../../service/submissionService';

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

  const getSubmissionStatusInfo = () => {
    if (!submissionData?.submittedAt) {
      return {
        status: 'Not Submitted',
        color: 'bg-yellow-100 text-yellow-800',
        message: 'Not yet submitted'
      };
    }

    const submitDate = new Date(submissionData.submittedAt);
    const deadline = new Date(submissionData.assignment?.deadline);
    const diffTime = deadline - submitDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (submitDate > deadline) {
      return {
        status: 'Late Submission',
        color: 'bg-red-100 text-red-800',
        message: `${Math.abs(diffDays)} days after deadline`
      };
    }

    return {
      status: 'Submitted',
      color: 'bg-green-100 text-green-800',
      message: diffDays > 0 ? `${diffDays} days before deadline` : 'On deadline'
    };
  };

  const handleDownload = () => {
    if (submissionData?.fileUrl) {
      window.open(submissionData.fileUrl, '_blank');
    }
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
  const studentInitials = submissionData.user?.fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'NA';

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Class List</span>
        <ChevronRight className="w-4 h-4" />
        <span>{submissionData.assignment?.courseCode || 'Course'}</span>
        <ChevronRight className="w-4 h-4" />
        <span>{submissionData.assignment?.title || 'Assignment'}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">
          {submissionData.user?.fullName || 'Student'}
        </span>
      </nav>

      {/* Student Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {studentInitials}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {submissionData.user?.fullName || 'N/A'}
            </h1>
            <p className="text-gray-500">
              Student ID: {submissionData.user?.studentId || 'N/A'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.status}
            </span>
          </div>
          {submissionData.submittedAt && (
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
          {submissionData.assignment?.title || 'Assignment'}
        </h2>
        <p className="text-gray-600">
          {submissionData.assignment?.description || 'No description available'}
        </p>
        {submissionData.keywords && (
          <div className="mt-3">
            <span className="text-sm font-medium text-gray-700">Keywords: </span>
            <span className="text-sm text-gray-600">{submissionData.keywords}</span>
          </div>
        )}
      </div>

      {/* Submitted File */}
      {submissionData.fileUrl && (
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
                    {submissionData.fileName || 'Submitted File'}
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
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button 
                  onClick={handleDownload}
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
      {submissionData.fileUrl && (
        <div className="mb-8">
          <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-20 mx-auto mb-4 border-2 border-gray-300 rounded-lg bg-white flex items-center justify-center">
                <FileText className="w-8 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-600 mb-2">File Preview</h4>
              <p className="text-sm text-gray-500 mb-6">Click download to view the file</p>
              
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  Open File
                </button>
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
        <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          Grade
        </button>
      </div>
    </div>
  );
};

export default InstructorSubmissionDetail;