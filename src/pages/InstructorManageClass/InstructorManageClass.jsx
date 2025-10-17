import React, { useState, useEffect } from 'react';
import { Search, Users, Trash2, Plus, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getCurrentAccount } from '../../utils/accountUtils';
import { getStudentsInCourse, removeStudentFromCourse, addStudentToCourse } from '../../service/courseService';
import { toast } from 'react-toastify';

const InstructorManageClass = () => {
  const { id: courseInstanceId } = useParams();
  const currentUser = getCurrentAccount();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentCode, setStudentCode] = useState('');
  const [modalError, setModalError] = useState('');
  const [addingStudent, setAddingStudent] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const bgColors = [
    'bg-blue-100 text-blue-800',
    'bg-yellow-100 text-yellow-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-red-100 text-red-800',
    'bg-indigo-100 text-indigo-800'
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      if (!courseInstanceId) {
        console.error('No courseInstanceId provided');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getStudentsInCourse(courseInstanceId);

        const mappedStudents = response.map((student, index) => ({
          id: student.studentName
            ? student.studentName.substring(0, 2).toUpperCase()
            : 'ST',
          code: student.studentCode,
          name: student.studentName,
          email: student.studentEmail,
          bgColor: bgColors[index % bgColors.length],
          enrolledAt: student.enrolledAt,
          courseStudentId: student.courseStudentId,
          userId: student.userId,
          courseInstanceId: student.courseInstanceId
        }));

        setStudents(mappedStudents);

        if (response.length > 0) {
          setCourseInfo({
            courseCode: response[0].courseCode,
            className: response[0].courseInstanceName
          });
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseInstanceId]);

  const filteredStudents = students.filter((student) => {
    return (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!studentCode.trim()) {
      setModalError('Please enter a student code');
      return;
    }

    try {
      setAddingStudent(true);
      await addStudentToCourse(courseInstanceId, studentCode.trim(), currentUser.id); 

      const response = await getStudentsInCourse(courseInstanceId);
      const mappedStudents = response.map((student, index) => ({
        id: student.studentName
          ? student.studentName.substring(0, 2).toUpperCase()
          : 'ST',
        code: student.studentCode,
        name: student.studentName,
        email: student.studentEmail,
        bgColor: bgColors[index % bgColors.length],
        enrolledAt: student.enrolledAt,
        courseStudentId: student.courseStudentId,
        userId: student.userId,
        courseInstanceId: student.courseInstanceId
      }));
      setStudents(mappedStudents);

      setStudentCode('');
      setIsAddModalOpen(false);
      toast.success('Student added successfully!');
    } catch (error) {
      console.error('Failed to add student:', error);
      toast.error('Failed to add student. Please try again.');
    } finally {
      setAddingStudent(false);
    }
  };

  const handleCloseModal = () => {
    setStudentCode('');
    setModalError('');
    setIsAddModalOpen(false);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setConfirmDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      setDeleting(true);
      await removeStudentFromCourse(
        studentToDelete.userId,
        studentToDelete.courseInstanceId,
        studentToDelete.courseStudentId
      );
      setStudents(students.filter(s => s.courseStudentId !== studentToDelete.courseStudentId));
      setConfirmDeleteModal(false);
      setStudentToDelete(null);
      toast.success('Student removed successfully!');
    } catch (error) {
      console.error('Failed to remove student:', error);
      toast.error('Failed to remove student. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteModal(false);
    setStudentToDelete(null);
  };

  if (!courseInstanceId) {
    return <div className="p-4 text-red-500">Invalid class ID. Please navigate from the class list.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student List</h2>
          <div className="flex items-center mt-2 space-x-4">
            {courseInfo && (
              <>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {courseInfo.courseCode}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {courseInfo.className}
                </span>
              </>
            )}
            <span className="text-gray-500 text-sm flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {students.length} students
            </span>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>

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
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading students...</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 text-sm font-medium text-gray-700">
              <div>Image</div>
              <div>Member</div>
              <div>Full Name</div>
              <div>Email</div>
              <div>Action</div>
            </div>

            {filteredStudents.map((student) => (
              <div
                key={student.code}
                className="grid grid-cols-5 gap-4 px-6 py-4 border-t border-gray-100 hover:bg-gray-50 items-center"
              >
                <div
                  className={`w-10 h-10 ${student.bgColor} rounded-full flex items-center justify-center font-semibold`}
                >
                  {student.id}
                </div>
                <div className="font-medium text-gray-900">{student.code}</div>
                <div className="text-gray-900">{student.name}</div>
                <div className="text-gray-600">{student.email}</div>
                <div>
                  <button
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    onClick={() => handleDeleteClick(student)}
                    disabled={deleting}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            {!loading && filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search keywords
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Student</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Code
                </label>
                <input
                  type="text"
                  value={studentCode}
                  onChange={(e) => {
                    setStudentCode(e.target.value);
                    setModalError('');
                  }}
                  placeholder="Enter student code (e.g., SE123456)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  disabled={addingStudent}
                  autoFocus
                />
                {modalError && (
                  <p className="text-red-500 text-sm mt-2">{modalError}</p>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  disabled={addingStudent}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                  disabled={addingStudent}
                >
                  <Plus className="w-4 h-4" />
                  {addingStudent ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteModal && studentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Remove Student</h2>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to remove <span className="font-semibold">{studentToDelete.name}</span> from this class?
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                disabled={deleting}
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorManageClass;