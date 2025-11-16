import React, { useState, useEffect } from 'react';
import { Search, Eye, MoreVertical, Loader2, Check, X, CheckCircle } from 'lucide-react';
import { Dropdown } from 'antd';
import { getRegradeRequestsForInstructor } from '../../service/regradeService';
import { getCurrentAccount } from '../../utils/accountUtils';


const InstructorRegradeRequest = () => {
    const currentUser = getCurrentAccount();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [reviewRequests, setReviewRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                mssv: req.requestedByStudent.userId.toString(),
                email: req.requestedByStudent.email,
                class: 'N/A',
                assignment: req.submission.fileName,
                currentGrade: 'N/A',
                reason: req.reason,
                requestTime: new Date(req.requestedAt).toLocaleString('vi-VN'),
                status: req.status,
                reviewedByInstructorId: req.reviewedByInstructorId,
                resolutionNotes: req.resolutionNotes,
                submittedAt: req.submission.submittedAt,
                submissionStatus: req.submission.status
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
    const processedRequests = reviewRequests.filter(req => req.status === 'Processed').length;

    const handleStatusClick = () => {
        if (statusFilter === 'All') setStatusFilter('Pending');
        else if (statusFilter === 'Pending') setStatusFilter('Processed');
        else setStatusFilter('All');
    };

    const getStatusStyle = (status) => {
        if (status === 'Processed') {
            return 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium';
        } else if (status === 'Approved') {
            return 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium';
        } else {
            return 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium';
        }
    };

    const handleActionSelect = async (requestId, action) => {
        // TODO: Call API to update with specific action
        console.log(`Action ${action} selected for request ${requestId}`);
        
        // Update local state based on action
        setReviewRequests(prev => prev.map(req =>
            req.requestId === requestId
                ? { ...req, status: action === 'Complete' ? 'Processed' : req.status }
                : req
        ));
    };

    const getMenuItems = (requestId, status) => {
        if (status === 'Pending') {
            return [
                {
                    label: (
                        <span className="flex items-center gap-2 text-green-600">
                            <Check className="w-4 h-4" />
                            Approve
                        </span>
                    ),
                    onClick: () => handleActionSelect(requestId, 'Approve'),
                },
                {
                    label: (
                        <span className="flex items-center gap-2 text-red-600">
                            <X className="w-4 h-4" />
                            Reject
                        </span>
                    ),
                    onClick: () => handleActionSelect(requestId, 'Reject'),
                },
            ];
        }
        else if (status === 'Approved') {
            return [
                {
                    label: (
                        <span className="flex items-center gap-2 text-blue-600">
                            <CheckCircle className="w-4 h-4" />
                            Complete
                        </span>
                    ),
                    onClick: () => handleActionSelect(requestId, 'Complete'),
                },
            ];
        }
        return [];
    };

    const filteredRequests = reviewRequests.filter(req => {
        const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.mssv.includes(searchTerm) ||
            req.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || req.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-blue-50 rounded-lg shadow-sm p-6 border-blue-500">
                            <div className="text-sm text-gray-600 mb-1">Total Requests</div>
                            <div className="text-3xl font-bold text-gray-900">{totalRequests}</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg shadow-sm p-6 border-yellow-500">
                            <div className="text-sm text-yellow-700 mb-1">Pending</div>
                            <div className="text-3xl font-bold text-yellow-800">{pendingRequests}</div>
                        </div>
                        <div className="bg-blue-100 rounded-lg shadow-sm p-6 border-blue-600">
                            <div className="text-sm text-blue-700 mb-1">Approved</div>
                            <div className="text-3xl font-bold text-blue-800">{approvedRequests}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg shadow-sm p-6 border-green-500">
                            <div className="text-sm text-green-700 mb-1">Processed</div>
                            <div className="text-3xl font-bold text-green-800">{processedRequests}</div>
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
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assignment</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Request Time</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredRequests.map((request) => (
                                    <tr key={request.requestId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{request.name}</span>
                                                <span className="text-xs text-gray-500">{request.mssv}</span>
                                                <span className="text-xs text-gray-400">{request.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-900 max-w-xs truncate block">
                                                {request.assignment}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600 max-w-xs truncate">
                                                    {request.reason.length > 40
                                                        ? request.reason.substring(0, 40) + "..."
                                                        : request.reason}
                                                </span>
                                                <button className="flex-shrink-0 text-blue-600 hover:text-blue-700 transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
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
                                            {request.status === 'Processed' ? (
                                                <button 
                                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed" 
                                                    disabled
                                                >
                                                    View
                                                </button>
                                            ) : (
                                                <Dropdown
                                                    menu={{ items: getMenuItems(request.requestId, request.status) }}
                                                    trigger={['click']}
                                                    placement="bottomRight"
                                                >
                                                    <button className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
                                                        <MoreVertical className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                </Dropdown>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State */}
                {filteredRequests.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-2">No requests found</div>
                        <div className="text-gray-400">Try adjusting the filter or search keywords</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorRegradeRequest;