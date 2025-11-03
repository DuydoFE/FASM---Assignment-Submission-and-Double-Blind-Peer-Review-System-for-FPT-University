import React, { useState } from 'react';
import { ArrowLeft, FileText, Link, ChevronDown } from 'lucide-react';

const InstructorManageSubmission = () => {
  const [statusFilter, setStatusFilter] = useState('All');

  const students = [
    {
      name: "Nguyen Van An",
      mssv: "SE171488",
      status: "Submitted",
      statusColor: "bg-green-100 text-green-800",
      submitTime: "12/23/2024 14:30",
      file: "wireframe-design.fig",
      fileType: "file",
      hasDetail: true
    },
    {
      name: "Tran Thi Binh",
      mssv: "SE171488",
      status: "Not Submitted",
      statusColor: "bg-yellow-100 text-yellow-800",
      submitTime: "--",
      file: "--",
      fileType: null,
      hasDetail: false
    },
    {
      name: "Le Minh Cuong",
      mssv: "SE171488",
      status: "Late Submission",
      statusColor: "bg-red-100 text-red-800",
      submitTime: "12/26/2024 08:15",
      file: "figma.com/design/abc...",
      fileType: "link",
      hasDetail: true
    },
    {
      name: "Pham Thu Duyen",
      mssv: "SE171488",
      status: "Submitted",
      statusColor: "bg-green-100 text-green-800",
      submitTime: "12/24/2024 20:45",
      file: "lab1-wireframe.pdf",
      fileType: "file",
      hasDetail: true
    },
    {
      name: "Hoang Viet Em",
      mssv: "SE171488",
      status: "Not Submitted",
      statusColor: "bg-yellow-100 text-yellow-800",
      submitTime: "--",
      file: "--",
      fileType: null,
      hasDetail: false
    }
  ];

  // Toggle cycle All → Submitted → Not Submitted → Late Submission → All
  const handleStatusClick = () => {
    if (statusFilter === 'All') setStatusFilter('Submitted');
    else if (statusFilter === 'Submitted') setStatusFilter('Not Submitted');
    else if (statusFilter === 'Not Submitted') setStatusFilter('Late Submission');
    else setStatusFilter('All');
  };

  const filteredStudents = students.filter(student =>
    statusFilter === 'All' || student.status === statusFilter
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-gray-600">Back</span>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-semibold text-gray-800">Lab 1: Figma Basics</h1>
          <p className="text-sm text-gray-500">Deadline: 12/25/2024 - 23:59</p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Submissions</h2>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Students</p>
          <p className="text-3xl font-bold text-gray-800">35</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Submitted</p>
          <p className="text-3xl font-bold text-green-600">28</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Not Submitted</p>
          <p className="text-3xl font-bold text-yellow-600">5</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Late Submissions</p>
          <p className="text-3xl font-bold text-red-600">2</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Member</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Full Name</th>
              {/* Clickable STATUS header */}
              <th
                onClick={handleStatusClick}
                className="px-6 py-4 text-left text-sm font-medium text-gray-600 cursor-pointer select-none hover:text-orange-600 transition flex items-center gap-1"
              >
                Submission Status
                <ChevronDown size={16} />
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
                    <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
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
