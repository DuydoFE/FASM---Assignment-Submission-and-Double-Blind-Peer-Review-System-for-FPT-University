import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, BookOpen, Users } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Table, Button } from 'antd';
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

  const handleViewDetails = (student) => {
    if (!student.hasDetail) return;
    navigate(`/instructor/submission-detail/${student.submissionId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-700';
      case 'Graded':
        return 'bg-green-100 text-green-700';
      case 'Not Submitted':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  const columns = [
    {
      title: 'Student Code',
      dataIndex: 'mssv',
      key: 'mssv',
      width: '20%',
    },
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (name) => <span className="text-gray-800">{name}</span>,
    },
    {
      title: (
        <div
          onClick={handleStatusClick}
          className="cursor-pointer select-none hover:text-orange-600 transition flex items-center gap-1"
        >
          Submission Status
          <ChevronDown size={16} />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      render: (status, record) => (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${record.statusColor}`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Submission Time',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: '20%',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_, student) =>
        student.status !== "Not Submitted" ? (
          <Button
            onClick={() => handleViewDetails(student)}
            type="primary"
            className="bg-blue-500 hover:!bg-blue-600"
          >
            View Detail
          </Button>
        ) : null,
    },
  ];

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
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="w-5 h-5" />}
            className="inline-flex items-center gap-2"
          >
            Back
          </Button>
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
      </motion.div>

      {/* Course and Class Info */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
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
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Manage Submissions
      </motion.h2>

      {/* Statistics */}
      <motion.div
        className="grid grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
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
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Table
        columns={columns}
        dataSource={filteredStudents}
        rowKey={(record, index) => index}
        loading={loading}
        pagination={false}
          className="bg-white rounded-lg border border-gray-200"
        />
      </motion.div>
    </div>
  );
};

export default InstructorManageSubmission;