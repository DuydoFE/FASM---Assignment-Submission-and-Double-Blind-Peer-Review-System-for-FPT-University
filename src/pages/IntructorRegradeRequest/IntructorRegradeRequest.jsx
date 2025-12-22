import React, { useState, useEffect } from 'react';
import { Search, Eye, Loader2, MoreVertical, RefreshCw, CheckCircle, FileEdit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Dropdown, Input, Button, Pagination, Table } from 'antd';
import { motion } from 'framer-motion';
import { getRegradeRequestsForInstructor } from '../../service/regradeService';
import { getCurrentAccount } from '../../utils/accountUtils';
import SolveRegradeRequestModal from '../../component/RegradeRequest/SolveRegradeRequestModal';
import CompleteRegradeRequestModal from '../../component/RegradeRequest/CompleteRegradeRequestModal';
import OverrideFinalScoreModal from '../../component/RegradeRequest/OverrideFinalScoreModal';

const InstructorRegradeRequest = () => {
    const navigate = useNavigate();
    const currentUser = getCurrentAccount();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [reviewRequests, setReviewRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
    const [selectedRequestForComplete, setSelectedRequestForComplete] = useState(null);
    const [selectedRequestForOverride, setSelectedRequestForOverride] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchRegradeRequests();
    }, []);

    const fetchRegradeRequests = async () => {
        try {
            setLoading(true);
            const response = await getRegradeRequestsForInstructor(currentUser?.id);

            const transformedData = response.data.requests.map(req => ({
                id: req.requestId,
                requestId: req.requestId,
                submissionId: req.submissionId,
                name: req.requestedByStudent.fullName,
                mssv: req.requestedByStudent.studentCode,
                email: req.requestedByStudent.email,
                class: req.className || 'N/A',
                courseName: req.courseName || 'N/A',
                className: req.className || 'N/A',
                file: req.submission.fileName,
                currentGrade: req.gradeInfo?.instructorScore || 'N/A',
                instructorScore: req.gradeInfo?.instructorScore || 'N/A',
                oldScore: req.submission?.oldScore,
                finalScore: req.submission?.finalScore,
                reason: req.reason,
                requestTime: new Date(req.requestedAt).toLocaleString('vi-VN'),
                status: req.status,
                reviewedByInstructorId: req.reviewedByInstructorId,
                resolutionNotes: req.resolutionNotes,
                submittedAt: req.submission.submittedAt,
                submissionStatus: req.submission.status,
                assignmentTitle: req.assignment.title,
            }));

            setReviewRequests(transformedData);
            setError(null);
        } catch (err) {
            console.error('Error fetching regrade requests:', err);
            setError('Cannot load regrade request list');
        } finally {
            setLoading(false);
        }
    };

    const totalRequests = reviewRequests.length;
    const pendingRequests = reviewRequests.filter(req => req.status === 'Pending').length;
    const approvedRequests = reviewRequests.filter(req => req.status === 'Approved').length;
    const completedRequests = reviewRequests.filter(req => req.status === 'Completed').length;
    const rejectedRequests = reviewRequests.filter(req => req.status === 'Rejected').length;

    const getStatusStyle = (status) => {
        if (status === 'Approved') {
            return 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium';
        } else if (status === 'Rejected') {
            return 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium';
        } else if (status === 'Pending') {
            return 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium';
        } else if (status === 'Completed') {
            return 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium';
        }
        return 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium';
    };

    const handleSolveClick = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    const handleModalSubmit = (decision, feedback) => {
        console.log('Decision:', decision, 'Feedback:', feedback);

        setReviewRequests(prev => prev.map(req =>
            req.requestId === selectedRequest.requestId
                ? { ...req, status: decision === 'approve' ? 'Approved' : 'Rejected', resolutionNotes: feedback }
                : req
        ));

        handleModalClose();
    };

    const handleRegradeClick = (request) => {
        if (request.submissionStatus === 'Not Submitted') {
            toast.warning('Cannot regrade a submission that has not been submitted');
            return;
        }

        navigate(`/instructor/grading-detail/${request.submissionId}`, {
            state: {
                regradeRequestId: request.requestId,
                studentName: request.name,
                originalReason: request.reason,
                assignmentTitle: request.assignmentTitle,
                fromRegradeRequest: true,
                returnState: {
                    returnPath: '/instructor/regrade-request'
                }
            }
        });
    };

    const handleMarkAsComplete = (request) => {
        setSelectedRequestForComplete(request);
        setIsCompleteModalOpen(true);
    };

    const handleOverrideFinalScore = (request) => {
        setSelectedRequestForOverride(request);
        setIsOverrideModalOpen(true);
    };

    const handleCompleteModalClose = () => {
        setIsCompleteModalOpen(false);
        setSelectedRequestForComplete(null);
    };

    const handleCompleteModalSubmit = (completionReason) => {
        if (selectedRequestForComplete) {
            setReviewRequests(prev => prev.map(req =>
                req.requestId === selectedRequestForComplete.requestId
                    ? { ...req, status: 'Completed', resolutionNotes: completionReason }
                    : req
            ));
            toast.success('Marked as complete successfully');
        }
        handleCompleteModalClose();
    };

    const handleOverrideModalClose = () => {
        setIsOverrideModalOpen(false);
        setSelectedRequestForOverride(null);
    };

    const handleOverrideModalSubmit = async (data) => {
        try {
            // TODO: Implement API call to override final score
            console.log('Override data:', data);
            
            // Update local state temporarily
            if (selectedRequestForOverride) {
                setReviewRequests(prev => prev.map(req =>
                    req.requestId === selectedRequestForOverride.requestId
                        ? { ...req, finalScore: data.overrideScore, status: 'Completed' }
                        : req
                ));
                
                // Refetch data to get updated list
                fetchRegradeRequests();
            }
            handleOverrideModalClose();
        } catch (error) {
            console.error('Error overriding score:', error);
            toast.error('Failed to override score. Please try again.');
        }
    };

    const getDropdownItems = (request) => [
        {
            label: (
                <div className="flex items-center gap-2 px-2 py-1">
                    <RefreshCw className="w-4 h-4 text-orange-500" />
                    <span>Re-Grade</span>
                </div>
            ),
            children: [
                {
                    label: (
                        <div className="flex items-center gap-2 px-2 py-1">
                            <RefreshCw className="w-4 h-4 text-blue-500" />
                            <span>Re-Grade Instructor Score</span>
                        </div>
                    ),
                    onClick: () => handleRegradeClick(request)
                },
                {
                    label: (
                        <div className="flex items-center gap-2 px-2 py-1">
                            <FileEdit className="w-4 h-4 text-purple-500" />
                            <span>Override Final Score</span>
                        </div>
                    ),
                    onClick: () => handleOverrideFinalScore(request)
                }
            ]
        },
        {
            label: (
                <div className="flex items-center gap-2 px-2 py-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Mark As Complete</span>
                </div>
            ),
            onClick: () => handleMarkAsComplete(request)
        }
    ];

    const filteredRequests = reviewRequests.filter(req => {
        const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.mssv.includes(searchTerm) ||
            req.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || req.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            title: 'Student',
            key: 'student',
            width: '15%',
            render: (_, request) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{request.name}</span>
                    <span className="text-xs text-gray-500">{request.mssv}</span>
                    <span className="text-xs text-gray-400">{request.email}</span>
                </div>
            ),
        },
        {
            title: 'Course',
            dataIndex: 'courseName',
            key: 'courseName',
            width: '12%',
            render: (text) => <span className="text-sm text-gray-900">{text}</span>,
        },
        {
            title: 'Class',
            dataIndex: 'className',
            key: 'className',
            width: '10%',
            render: (text) => <span className="text-sm text-gray-900">{text}</span>,
        },
        {
            title: 'Assignment',
            dataIndex: 'assignmentTitle',
            key: 'assignmentTitle',
            width: '15%',
            render: (text) => (
                <span
                    className="text-sm text-gray-900 max-w-xs truncate block"
                    title={text?.length > 25 ? text : undefined}
                >
                    {text?.length > 25 ? `${text.substring(0, 25)}...` : text}
                </span>
            ),
        },
        {
            title: 'Old Score',
            dataIndex: 'oldScore',
            key: 'oldScore',
            width: '10%',
            align: 'center',
            render: (score) => (
                <span className="text-sm font-semibold text-gray-600">
                    {score !== null && score !== undefined ? `${score}/10` : '--'}
                </span>
            ),
        },
        {
            title: 'New Score',
            dataIndex: 'finalScore',
            key: 'finalScore',
            width: '10%',
            align: 'center',
            render: (score) => (
                <span className="text-sm font-semibold text-indigo-600">
                    {score !== null && score !== undefined ? `${score}/10` : 'N/A'}
                </span>
            ),
        },
        {
            title: 'Request Time',
            dataIndex: 'requestTime',
            key: 'requestTime',
            width: '12%',
            align: 'center',
            render: (time) => (
                <span className="text-sm text-gray-600 whitespace-nowrap">{time}</span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            align: 'center',
            render: (status) => (
                <span className={getStatusStyle(status)}>{status}</span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '10%',
            align: 'center',
            render: (_, request) => {
                if (request.status === "Pending") {
                    return (
                        <Button
                            onClick={() => handleSolveClick(request)}
                            type="primary"
                            className="bg-blue-600 hover:!bg-blue-700"
                        >
                            Solve
                        </Button>
                    );
                } else if (request.status === "Approved") {
                    return (
                        <Dropdown
                            menu={{ items: getDropdownItems(request) }}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                        </Dropdown>
                    );
                }
                return null;
            },
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchRegradeRequests}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-between items-center mb-6"
                >
                    <h1 className="text-2xl font-bold text-gray-900">Regrade Requests</h1>
                    <Input
                        placeholder="Search by name, email..."
                        prefix={<Search className="w-5 h-5 text-gray-400" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="large"
                        className="w-80"
                        style={{
                            borderRadius: '8px',
                            fontSize: '16px',
                        }}
                    />
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-6"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="bg-blue-50 rounded-lg shadow-sm p-6 border-blue-500"
                        >
                            <div className="text-sm text-gray-600 mb-1">Total Requests</div>
                            <div className="text-3xl font-bold text-gray-900">{totalRequests}</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="bg-yellow-50 rounded-lg shadow-sm p-6 border-yellow-500"
                        >
                            <div className="text-sm text-yellow-700 mb-1">Pending</div>
                            <div className="text-3xl font-bold text-yellow-800">{pendingRequests}</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="bg-blue-50 rounded-lg shadow-sm p-6 border-blue-500"
                        >
                            <div className="text-sm text-blue-700 mb-1">Approved</div>
                            <div className="text-3xl font-bold text-blue-800">{approvedRequests}</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            className="bg-green-50 rounded-lg shadow-sm p-6 border-green-500"
                        >
                            <div className="text-sm text-green-700 mb-1">Completed</div>
                            <div className="text-3xl font-bold text-green-800">{completedRequests}</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                            className="bg-red-50 rounded-lg shadow-sm p-6 border-red-500"
                        >
                            <div className="text-sm text-red-700 mb-1">Rejected</div>
                            <div className="text-3xl font-bold text-red-800">{rejectedRequests}</div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Review Requests Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <Table
                    columns={columns}
                    dataSource={filteredRequests}
                    rowKey="requestId"
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize: itemsPerPage,
                        total: filteredRequests.length,
                        onChange: (page) => setCurrentPage(page),
                        showSizeChanger: false,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} requests`,
                    }}
                        className="bg-white rounded-xl shadow-sm"
                    />

                    {/* Empty State */}
                    {filteredRequests.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-12"
                        >
                            <div className="text-gray-500 text-lg mb-2">No requests found</div>
                            <div className="text-gray-400">Try adjusting the filter or search keywords</div>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedRequest && (
                <SolveRegradeRequestModal
                    request={selectedRequest}
                    onClose={handleModalClose}
                    onSubmit={handleModalSubmit}
                />
            )}

            {/* Complete Modal */}
            {isCompleteModalOpen && selectedRequestForComplete && (
                <CompleteRegradeRequestModal
                    request={selectedRequestForComplete}
                    onClose={handleCompleteModalClose}
                    onSubmit={handleCompleteModalSubmit}
                />
            )}

            {/* Override Final Score Modal */}
            {isOverrideModalOpen && selectedRequestForOverride && (
                <OverrideFinalScoreModal
                    isOpen={isOverrideModalOpen}
                    onClose={handleOverrideModalClose}
                    request={selectedRequestForOverride}
                    onSubmit={handleOverrideModalSubmit}
                />
            )}
        </div>
    );
};

export default InstructorRegradeRequest;