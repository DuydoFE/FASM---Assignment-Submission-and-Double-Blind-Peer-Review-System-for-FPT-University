import React, { useState } from 'react';
import { Search, Eye, ChevronDown } from 'lucide-react';

const IntructorRegradeRequest = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');

    const [reviewRequests, setReviewRequests] = useState([
        {
            id: 1,
            name: 'Nguyễn Văn An',
            mssv: '2021001',
            class: 'IT01',
            assignment: 'Lab 1: Figma Basics',
            currentGrade: 7.5,
            reason: 'Thiếu tiêu chí đánh giá UI...',
            submissionTime: '22/12/2024 09:15',
            status: 'Chờ xử lý'
        },
        {
            id: 2,
            name: 'Trần Thị Bình',
            mssv: '2021002',
            class: 'IT02',
            assignment: 'Assignment 1: Prototype',
            currentGrade: 8.0,
            reason: 'Prototype hoạt động tốt hơn...',
            submissionTime: '21/12/2024 16:30',
            status: 'Đã xử lý'
        },
        {
            id: 3,
            name: 'Lê Minh Cường',
            mssv: '2021003',
            class: 'IT01',
            assignment: 'Lab 2: User Research',
            currentGrade: 6.5,
            reason: 'Persona đã bao gồm đầy đủ...',
            submissionTime: '20/12/2024 14:20',
            status: 'Chờ xử lý'
        },
        {
            id: 4,
            name: 'Phạm Thu Duyên',
            mssv: '2021004',
            class: 'IT03',
            assignment: 'Final Project',
            currentGrade: 8.5,
            reason: 'App design rất sáng tạo và...',
            submissionTime: '19/12/2024 11:45',
            status: 'Đã xử lý'
        },
        {
            id: 5,
            name: 'Hoàng Việt Em',
            mssv: '2021005',
            class: 'IT02',
            assignment: 'Lab 1: Figma Basics',
            currentGrade: 7.0,
            reason: 'Wireframe có nhiều chi tiết...',
            submissionTime: '18/12/2024 08:30',
            status: 'Chờ xử lý'
        }
    ]);

    const totalRequests = reviewRequests.length;
    const pendingRequests = reviewRequests.filter(req => req.status === 'Chờ xử lý').length;
    const processedRequests = reviewRequests.filter(req => req.status === 'Đã xử lý').length;

    const getGradeColor = (grade) => {
        if (grade >= 8.5) return 'text-green-600 font-semibold';
        if (grade >= 7.0) return 'text-yellow-600 font-semibold';
        return 'text-red-600 font-semibold';
    };

    const getStatusStyle = (status) => {
        return status === 'Đã xử lý'
            ? 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'
            : 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium';
    };

    const getActionButtonStyle = (status) => {
        return status === 'Đã xử lý'
            ? 'bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200';
    };

    const handleStatusUpdate = (requestId, newStatus) => {
        setReviewRequests(prev => prev.map(req =>
            req.id === requestId
                ? { ...req, status: newStatus }
                : req
        ));
    };

    const filteredRequests = reviewRequests.filter(req => {
        const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.mssv.includes(searchTerm) ||
            req.class.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'Tất cả trạng thái' || req.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Yêu cầu chấm lại điểm</h1>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
                            >
                                <option value="Tất cả trạng thái">Tất cả trạng thái</option>
                                <option value="Chờ xử lý">Chờ xử lý</option>
                                <option value="Đã xử lý">Đã xử lý</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, lớp..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 rounded-lg shadow-sm p-6 border-blue-500">
                            <div className="text-sm text-gray-600 mb-1">Tổng yêu cầu</div>
                            <div className="text-3xl font-bold text-gray-900">{totalRequests}</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg shadow-sm p-6 border-yellow-500">
                            <div className="text-sm text-yellow-700 mb-1">Đang chờ xử lý</div>
                            <div className="text-3xl font-bold text-yellow-800">{pendingRequests}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg shadow-sm p-6 border-green-500">
                            <div className="text-sm text-green-700 mb-1">Đã xử lý</div>
                            <div className="text-3xl font-bold text-green-800">{processedRequests}</div>
                        </div>
                    </div>
                </div>

                {/* Review Requests Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Họ và tên</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">MSSV</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Lớp</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Assignment</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Điểm hiện tại</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Lý do</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Thời gian gửi</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Trạng thái</th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{request.mssv}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{request.class}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{request.assignment}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-sm ${getGradeColor(request.currentGrade)}`}>
                                                {request.currentGrade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <span>
                                                    {request.reason.length > 25
                                                        ? request.reason.substring(0, 25) + "..."
                                                        : request.reason}
                                                </span>
                                                <Eye className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700 flex-shrink-0" />
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600 text-center whitespace-nowrap">
                                            {request.submissionTime}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={getStatusStyle(request.status)}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {request.status === 'Đã xử lý' ? (
                                                <button className={getActionButtonStyle(request.status)} disabled>
                                                    Xem
                                                </button>
                                            ) : (
                                                <button
                                                    className={getActionButtonStyle(request.status)}
                                                    onClick={() => handleStatusUpdate(request.id, 'Đã xử lý')}
                                                >
                                                    Xử lý
                                                </button>
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
                        <div className="text-gray-500 text-lg mb-2">Không tìm thấy yêu cầu nào</div>
                        <div className="text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IntructorRegradeRequest;