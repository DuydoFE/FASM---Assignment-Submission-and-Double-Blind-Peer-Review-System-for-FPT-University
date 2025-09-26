import React from 'react';
import { Plus, FileText, Clock, Lock, Calendar } from 'lucide-react';

const InstructorManageAssignment = () => {
  const assignments = [
    {
      id: 1,
      title: "Lab 1: Figma Basics",
      description: "Tạo wireframe cho trang web bán hàng",
      deadline: "25/12/2024",
      time: "23:59",
      submitted: 28,
      total: 35,
      status: "Đang mở",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      title: "Lab 2: User Research",
      description: "Phỏng vấn người dùng và tạo persona",
      deadline: "30/12/2024",
      time: "23:59",
      submitted: 15,
      total: 35,
      status: "Đang mở",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      title: "Assignment 1: Prototype",
      description: "Tạo prototype tương tác với Figma",
      deadline: "20/12/2024",
      time: "23:59",
      submitted: 35,
      total: 35,
      status: "Đã đóng",
      statusColor: "bg-red-100 text-red-800"
    },
    {
      id: 4,
      title: "Final Project",
      description: "Dự án cuối khóa - Thiết kế app hoàn chỉnh",
      deadline: "10/01/2025",
      time: "23:59",
      submitted: 2,
      total: 35,
      status: "Đang mở",
      statusColor: "bg-green-100 text-green-800"
    }
  ];



  const getDeadlineColor = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline.split('/').reverse().join('-'));
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-red-500";
    if (diffDays <= 3) return "text-orange-500";
    return "text-gray-900";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Assignment</h1>
          <div className="flex items-center space-x-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              WDU391
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              SE17TB
            </span>
          </div>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors">
          <Plus className="w-5 h-5" />
          <span>Tạo Assignment</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tổng Assignment</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">4</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Đang mở</p>
              <p className="text-3xl font-bold text-green-600 mt-1">3</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Đã đóng</p>
              <p className="text-3xl font-bold text-red-600 mt-1">1</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-6 px-8 py-5 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="col-span-4">Tên Assignment</div>
          <div className="col-span-2 text-center">Deadline</div>
          <div className="col-span-2 text-center">Nộp bài</div>
          <div className="col-span-2 text-center">Trạng thái</div>
          <div className="col-span-2 text-center">Thao tác</div>
        </div>

        {/* Table Body */}
        {assignments.map((assignment) => (
          <div key={assignment.id} className="grid grid-cols-12 gap-6 px-8 py-8 border-b border-gray-100 hover:bg-gray-50 items-center transition-colors">
            {/* Assignment Name & Description */}
            <div className="col-span-4 space-y-2">
              <h3 className="font-semibold text-gray-900 text-base">{assignment.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{assignment.description}</p>
            </div>

            {/* Deadline */}
            <div className="col-span-2 text-center space-y-1">
              <div className={`font-medium text-base ${getDeadlineColor(assignment.deadline)}`}>
                {assignment.deadline}
              </div>
              <div className="text-sm text-gray-500">{assignment.time}</div>
            </div>

            {/* Submission Count */}
            <div className="col-span-2 text-center">
              <div className="font-bold text-lg text-gray-900">
                {assignment.submitted}/{assignment.total}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((assignment.submitted / assignment.total) * 100)}% hoàn thành
              </div>
            </div>

            {/* Status */}
            <div className="col-span-2 flex justify-center">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${assignment.statusColor} flex items-center space-x-2`}>
                {assignment.status === "Đang mở" ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>{assignment.status}</span>
              </span>
            </div>

            {/* Actions */}
            <div className="col-span-2 flex justify-center items-center space-x-3">
              <button 
                className="text-blue-600 hover:text-blue-800 p-3 hover:bg-blue-50 rounded-lg transition-colors"
                title="Xem chi tiết"
              >
                <Calendar className="w-5 h-5" />
              </button>
              <button 
                className="text-green-600 hover:text-green-800 p-3 hover:bg-green-50 rounded-lg transition-colors"
                title="Chỉnh sửa"
              >
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (if no assignments) */}
      {assignments.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Chưa có Assignment nào</h3>
          <p className="text-gray-500 mb-6">Tạo assignment đầu tiên để bắt đầu quản lý bài tập cho lớp học</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors mx-auto">
            <Plus className="w-5 h-5" />
            <span>Tạo Assignment đầu tiên</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InstructorManageAssignment;