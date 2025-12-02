import React, { useState, useEffect } from 'react';
import { Search, Eye, Loader2, MoreVertical, RefreshCw, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Dropdown } from 'antd';
import { getRegradeRequestsForInstructor } from '../../service/regradeService';
import { getCurrentAccount } from '../../utils/accountUtils';
import SolveRegradeRequestModal from '../../component/RegradeRequest/SolveRegradeRequestModal';
import CompleteRegradeRequestModal from '../../component/RegradeRequest/CompleteRegradeRequestModal';

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
    const [selectedRequestForComplete, setSelectedRequestForComplete] = useState(null);
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
            setError('Không thể tải danh sách yêu cầu chấm lại');
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
                assignmentTitle: request.assignmentTitle
            }
        });
    };

    const handleMarkAsComplete = (request) => {
        setSelectedRequestForComplete(request);
        setIsCompleteModalOpen(true);
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

    const getDropdownItems = (request) => [
        {
            label: (
                <div className="flex items-center gap-2 px-2 py-1">
                    <RefreshCw className="w-4 h-4 text-orange-500" />
                    <span>Re-grade</span>
                </div>
            ),
            onClick: () => handleRegradeClick(request)
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

    // Pagination
    const indexOfLastRequest = currentPage * itemsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
    const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
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
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Regrade Requests</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="bg-blue-50 rounded-lg shadow-sm p-6 border-blue-500">
                            <div className="text-sm text-gray-600 mb-1">Total Requests</div>
                            <div className="text-3xl font-bold text-gray-900">{totalRequests}</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg shadow-sm p-6 border-yellow-500">
                            <div className="text-sm text-yellow-700 mb-1">Pending</div>
                            <div className="text-3xl font-bold text-yellow-800">{pendingRequests}</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg shadow-sm p-6 border-blue-500">
                            <div className="text-sm text-blue-700 mb-1">Approved</div>
                            <div className="text-3xl font-bold text-blue-800">{approvedRequests}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg shadow-sm p-6 border-green-500">
                            <div className="text-sm text-green-700 mb-1">Completed</div>
                            <div className="text-3xl font-bold text-green-800">{completedRequests}</div>
                        </div>
                        <div className="bg-red-50 rounded-lg shadow-sm p-6 border-red-500">
                            <div className="text-sm text-red-700 mb-1">Rejected</div>
                            <div className="text-3xl font-bold text-red-800">{rejectedRequests}</div>
                        </div>
                    </div>
                </div>

                {/* Review Requests Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assignment</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Score</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Request Time</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentRequests.map((request) => (
                                    <tr key={request.requestId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{request.name}</span>
                                                <span className="text-xs text-gray-500">{request.mssv}</span>
                                                <span className="text-xs text-gray-400">{request.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-900">
                                                {request.courseName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-900">
                                                {request.className}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="text-sm text-gray-900 max-w-xs truncate block"
                                                title={request.assignmentTitle?.length > 25 ? request.assignmentTitle : undefined}
                                            >
                                                {request.assignmentTitle?.length > 25
                                                    ? `${request.assignmentTitle.substring(0, 25)}...`
                                                    : request.assignmentTitle}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-semibold text-indigo-600">
                                                {request.instructorScore !== 'N/A' ? `${request.instructorScore}/10` : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm text-gray-600 whitespace-nowrap">
                                                {request.requestTime}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={getStatusStyle(request.status)}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {request.status === "Pending" ? (
                                                <button
                                                    onClick={() => handleSolveClick(request)}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                                                >
                                                    Solve
                                                </button>
                                            ) : request.status === "Approved" ? (
                                                <Dropdown
                                                    menu={{ items: getDropdownItems(request) }}
                                                    trigger={['click']}
                                                    placement="bottomRight"
                                                >
                                                    <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                                                        <MoreVertical className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                </Dropdown>
                                            ) : (
                                                null
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredRequests.length > itemsPerPage && (
                        <div className="mt-6 flex items-center justify-between px-6">
                            <div className="text-sm text-gray-600">
                                Showing {indexOfFirstRequest + 1}-{Math.min(indexOfLastRequest, filteredRequests.length)} of {filteredRequests.length} requests
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, idx) => (
                                    <button
                                        key={idx + 1}
                                        onClick={() => setCurrentPage(idx + 1)}
                                        className={`px-4 py-2 rounded-lg transition ${currentPage === idx + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {filteredRequests.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-2">No requests found</div>
                        <div className="text-gray-400">Try adjusting the filter or search keywords</div>
                    </div>
                )}
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
        </div>
    );
};

export default InstructorRegradeRequest;