import React, { useState } from 'react';
import { Edit3, Eye, ChevronDown } from 'lucide-react';

const InstructorPublishMark = () => {
  const [selectedClass, setSelectedClass] = useState('SE1718');
  const [selectedSubject, setSelectedSubject] = useState('WDU391 - UI/UX Design');
  const [selectedAssignment, setSelectedAssignment] = useState('Lab 1: Figma Basics');
  const [statusFilter, setStatusFilter] = useState('All'); // Toggle filter

  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Nguyen Van An',
      mssv: '2021001234',
      peerReview: 8.5,
      instructorGrade: 8.2,
      finalGrade: 8.35,
      status: 'Published'
    },
    {
      id: 2,
      name: 'Tran Thi Binh',
      mssv: '2021001235',
      peerReview: 7.8,
      instructorGrade: 7.5,
      finalGrade: 7.65,
      status: 'Draft'
    },
    {
      id: 3,
      name: 'Le Minh Cuong',
      mssv: '2021001236',
      peerReview: 9.2,
      instructorGrade: 8.8,
      finalGrade: 9.0,
      status: 'Published'
    },
    {
      id: 4,
      name: 'Pham Thu Dung',
      mssv: '2021001237',
      peerReview: 6.5,
      instructorGrade: 7.0,
      finalGrade: 6.75,
      status: 'Draft'
    },
    {
      id: 5,
      name: 'Nguyen Van An',
      mssv: '2021001234',
      peerReview: 8.5,
      instructorGrade: 8.2,
      finalGrade: 8.35,
      status: 'Published'
    },
    {
      id: 6,
      name: 'Tran Thi Binh',
      mssv: '2021001235',
      peerReview: 7.8,
      instructorGrade: 7.5,
      finalGrade: 7.65,
      status: 'Draft'
    },
    {
      id: 7,
      name: 'Le Minh Cuong',
      mssv: '2021001236',
      peerReview: 9.2,
      instructorGrade: 8.8,
      finalGrade: 9.0,
      status: 'Published'
    },
    {
      id: 8,
      name: 'Pham Thu Dung',
      mssv: '2021001237',
      peerReview: 6.5,
      instructorGrade: 7.0,
      finalGrade: 6.75,
      status: 'Draft'
    },
    {
      id: 9,
      name: 'Nguyen Van An',
      mssv: '2021001234',
      peerReview: 8.5,
      instructorGrade: 8.2,
      finalGrade: 8.35,
      status: 'Published'
    },
    {
      id: 10,
      name: 'Tran Thi Binh',
      mssv: '2021001235',
      peerReview: 7.8,
      instructorGrade: 7.5,
      finalGrade: 7.65,
      status: 'Draft'
    },
    {
      id: 11,
      name: 'Le Minh Cuong',
      mssv: '2021001236',
      peerReview: 9.2,
      instructorGrade: 8.8,
      finalGrade: 9.0,
      status: 'Published'
    },
    {
      id: 12,
      name: 'Pham Thu Dung',
      mssv: '2021001237',
      peerReview: 6.5,
      instructorGrade: 7.0,
      finalGrade: 6.75,
      status: 'Draft'
    }
  ]);

  // Toggle cycle All -> Published -> Draft -> All
  const handleStatusClick = () => {
    if (statusFilter === 'All') setStatusFilter('Published');
    else if (statusFilter === 'Published') setStatusFilter('Draft');
    else setStatusFilter('All');
  };

  const filteredStudents = students.filter(student =>
    statusFilter === 'All' || student.status === statusFilter
  );

  const handleGradeEdit = (studentId, field, value) => {
    setStudents(prev => prev.map(student =>
      student.id === studentId
        ? { ...student, [field]: parseFloat(value) || 0 }
        : student
    ));
  };

  const getGradeColor = (grade) => {
    if (grade >= 8.5) return 'text-green-600 bg-green-50';
    if (grade >= 7.0) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusStyle = (status) => {
    return status === 'Published'
      ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
      : 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium';
  };

  return (
    <div className="min-h-screen bg-white-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Official Grade Table</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="SE1718">SE1718</option>
                  <option value="SE1719">SE1719</option>
                  <option value="SE1720">SE1720</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="WDU391 - UI/UX Design">WDU391 - UI/UX Design</option>
                  <option value="PRF192 - Programming Fundamentals">PRF192 - Programming Fundamentals</option>
                  <option value="MAD101 - Mobile App Development">MAD101 - Mobile App Development</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Assignment</label>
              <div className="relative">
                <select
                  value={selectedAssignment}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="Lab 1: Figma Basics">Lab 1: Figma Basics</option>
                  <option value="Lab 2: Prototyping">Lab 2: Prototyping</option>
                  <option value="Assignment 1: UI Design">Assignment 1: UI Design</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium">
                <Eye className="inline w-4 h-4 mr-2" />
                View Grades
              </button>
            </div>
          </div>
        </div>

        {/* Grade Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Average Peer Review</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor Grade</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Final Grade</th>
                  <th
                    onClick={handleStatusClick}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-orange-600 transition flex items-center gap-1 justify-center"
                  >
                    Status
                    <ChevronDown size={16} />
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.mssv}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(student.peerReview)}`}>
                        {student.peerReview}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(student.instructorGrade)}`}>
                        {student.instructorGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(student.finalGrade)}`}>
                        {student.finalGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={getStatusStyle(student.status)}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 font-medium">
            Save Draft
          </button>
          <button className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors duration-200 font-medium">
            Publish Grades
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorPublishMark;