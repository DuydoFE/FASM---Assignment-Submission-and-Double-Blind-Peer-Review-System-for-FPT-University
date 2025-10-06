import React, { useState } from 'react';
import { Search, Users, ChevronDown } from 'lucide-react';

const InstructorManageClass = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // toggle filter

  const students = [
    { id: 'AN', code: 'SE171488', name: 'Tran Quang Loc', email: 'lociqse171488@fpt.edu.vn', status: 'Joined', bgColor: 'bg-blue-100 text-blue-800' },
    { id: 'BT', code: 'SE171155', name: 'Nguyen Chinh Khuong Duy', email: 'duynck171155@fpt.edu.vn', status: 'Joined', bgColor: 'bg-yellow-100 text-yellow-800' },
    { id: 'CD', code: 'SE17234', name: 'Le Minh Cuong', email: 'cuonglmse17234@fpt.edu.vn', status: 'Joined', bgColor: 'bg-blue-100 text-blue-800' },
    { id: 'DH', code: 'SE201012', name: 'Pham Thuy Dung', email: 'phamthuydung@email.com', status: 'Not Joined', bgColor: 'bg-purple-100 text-purple-800' },
    { id: 'EV', code: 'SE190510', name: 'Hoang Van Em', email: 'hoangvanem@email.com', status: 'Not Joined', bgColor: 'bg-red-100 text-red-800' }
  ];

  // Toggle cycle All -> Joined -> Not Joined -> All
  const handleStatusClick = () => {
    if (statusFilter === 'All') setStatusFilter('Joined');
    else if (statusFilter === 'Joined') setStatusFilter('Not Joined');
    else setStatusFilter('All');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student List</h2>
          <div className="flex items-center mt-2 space-x-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              WDU391
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              SE17TB
            </span>
            <span className="text-gray-500 text-sm flex items-center">
              <Users className="w-4 h-4 mr-1" />
              35 students
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div>Image</div>
          <div>Member</div>
          <div>Full Name</div>
          <div>Email</div>
          {/* STATUS header clickable with icon */}
          <div
            onClick={handleStatusClick}
            className="cursor-pointer select-none hover:text-orange-600 transition flex items-center gap-1"
          >
            STATUS
            <ChevronDown size={16} />
          </div>
          <div>Action</div>
        </div>

        {filteredStudents.map((student) => (
          <div
            key={student.code}
            className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 items-center"
          >
            <div className={`w-10 h-10 ${student.bgColor} rounded-full flex items-center justify-center font-semibold`}>
              {student.id}
            </div>
            <div className="font-medium text-gray-900">{student.code}</div>
            <div className="text-gray-900">{student.name}</div>
            <div className="text-gray-600">{student.email}</div>
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  student.status === 'Joined'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {student.status}
              </span>
            </div>
            <div>
              <button className="text-red-500 hover:text-red-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorManageClass;
