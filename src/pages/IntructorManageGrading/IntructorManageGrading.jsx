import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const IntructorManageGrading = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn An',
      mssv: '2021001',
      score: 8.5,
      feedback: 'Thiết kế rất tốt, cần cải thiện màu sắc...',
      submittedAt: '23/12/2024 14:30',
      status: 'graded',
      action: 'Đã chấm'
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      mssv: '2021002',
      score: null,
      feedback: 'Chưa có phản hồi',
      submittedAt: '24/12/2024 09:15',
      status: 'submitted',
      action: 'Chấm điểm'
    },
    {
      id: 3,
      name: 'Lê Minh Cường',
      mssv: '2021003',
      score: 7.0,
      feedback: 'Bài làm khá tốt, cần chú ý typography...',
      submittedAt: '22/12/2024 20:45',
      status: 'graded',
      action: 'Đã chấm'
    },
    {
      id: 4,
      name: 'Phạm Thu Duyên',
      mssv: '2021004',
      score: null,
      feedback: 'Chưa có phản hồi',
      submittedAt: null,
      status: 'not-submitted',
      action: 'Chấm điểm'
    },
    {
      id: 5,
      name: 'Hoàng Việt Em',
      mssv: '2021005',
      score: 5.5,
      feedback: 'Cần cải thiện nhiều về layout và color...',
      submittedAt: '26/12/2024 08:15',
      status: 'late',
      action: 'Đã chấm'
    }
  ]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.mssv.includes(searchTerm)
  );

  const getScoreStyle = (score) => {
    if (!score) return 'border-gray-300 text-gray-400';
    if (score >= 8) return 'border-green-500 text-green-600';
    if (score >= 6.5) return 'border-green-400 text-green-500';
    return 'border-red-400 text-red-500';
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'graded':
        return 'bg-green-100 text-green-700';
      case 'submitted':
        return 'bg-green-100 text-green-700';
      case 'late':
        return 'bg-red-100 text-red-600';
      case 'not-submitted':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'graded':
        return 'Đã nộp';
      case 'submitted':
        return 'Đã nộp';
      case 'late':
        return 'Nộp muộn';
      case 'not-submitted':
        return 'Chưa nộp';
      default:
        return '';
    }
  };

  const getSubmissionTimeStyle = (status) => {
    return status === 'late' ? 'text-red-500' : 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Chấm điểm bài tập</h1>

        {/* Filters */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Chọn lớp</label>
            <div className="relative">
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>SE1718</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Chọn môn</label>
            <div className="relative">
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>WDU391 - Thiết kế UI/UX</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Chọn assignment</label>
            <div className="relative">
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Lab 1: Figma Basics</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>SE1718</span>
          <span>›</span>
          <span>WDU391 - Thiết kế UI/UX</span>
          <span>›</span>
          <span className="text-gray-700">Lab 1: Figma Basics</span>
        </div>

        {/* Assignment Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Lab 1: Figma Basics</h2>
              <p className="text-gray-600">Tạo wireframe cho trang web bán hàng</p>
            </div>
            <div className="text-right">
              <p className="text-red-600 font-medium mb-1">Deadline: 25/12/2024 - 23:59</p>
              <p className="text-gray-600 text-sm">Điểm tối đa: 10</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium">✓ 28/35 đã nộp</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 font-medium">⭐ 15/28 đã chấm</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Họ và tên</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">MSSV</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Điểm hiện tại</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Feedback</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Thời gian nộp</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Trạng thái nộp</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.mssv}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-16 h-10 border-2 rounded-lg font-semibold ${getScoreStyle(student.score)}`}>
                      {student.score || '--'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {student.feedback}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {student.submittedAt ? (
                      <div className={getSubmissionTimeStyle(student.status)}>
                        {student.submittedAt.split(' ')[0]}<br />
                        {student.submittedAt.split(' ')[1]}
                      </div>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(student.status)}`}>
                      {getStatusText(student.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {student.action === 'Đã chấm' ? (
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                        Đã chấm
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                        Chấm điểm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IntructorManageGrading;