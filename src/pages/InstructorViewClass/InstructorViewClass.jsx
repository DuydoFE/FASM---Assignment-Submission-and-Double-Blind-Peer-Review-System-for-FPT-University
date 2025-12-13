import React, { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, Play, CheckCircle, Clock, ChevronDown, Key, X, Eye, EyeOff } from 'lucide-react';
import { getCurrentAccount } from '../../utils/accountUtils';
import { useNavigate } from 'react-router-dom';
import { getInstructorCourses } from '../../service/courseInstructorService';
import { updateEnrollKey } from '../../service/courseInstanceService';
import { toast } from 'react-toastify';

const InstructorViewClass = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentAccount();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (!currentUser?.id) {
          console.error('No user ID found');
          return;
        }

        const coursesData = await getInstructorCourses(currentUser?.id);

        const formattedClasses = coursesData.map(course => ({
          id: course.id,
          name: course.courseInstanceName,
          code: course.courseCode,
          className: course.courseInstanceName,
          studentCount: course.studentCount,
          status: course.courseInstanceStatus,
          statusText: course.courseInstanceStatus, 
          semester: course.semesterName,
          enrollmentKey: course.enrollmentKey || ''
        }));

        setClasses(formattedClasses);
      } catch (error) {
        console.error('Failed to fetch instructor courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, [currentUser]);

  const handleKeyClick = (e, cls) => {
    e.stopPropagation();
    setSelectedClass(cls);
    setPassword(cls.enrollmentKey || '');
    setShowKeyModal(true);
  };

  const handleEditPassword = async () => {
    try {
      await updateEnrollKey(selectedClass.id, password, currentUser.id);
      toast.success("Updated enroll key successfully!");
      
      // Update local state
      setClasses(prevClasses =>
        prevClasses.map(cls =>
          cls.id === selectedClass.id
            ? { ...cls, enrollmentKey: password }
            : cls
        )
      );
      setShowKeyModal(false);
      setPassword('');
    } catch (error) {
      toast.error("Failed to update enroll key. Please try again.");
      setShowKeyModal(false);
      setPassword('');
    }
  };

  const handleStatusClick = () => {
    if (statusFilter === 'All') setStatusFilter('Ongoing');
    else if (statusFilter === 'Ongoing') setStatusFilter('Completed');
    else if (statusFilter === 'Completed') setStatusFilter('Upcoming');
    else setStatusFilter('All');
  };

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLowercase && hasUppercase && hasNumber;

  const filteredClasses = useMemo(() => {
    return classes.filter(cls =>
      (cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'All' || cls.status === statusFilter)
    );
  }, [classes, searchTerm, statusFilter]);

  const totalClasses = classes.length;
  const ongoingClasses = classes.filter(cls => cls.status === 'Ongoing').length;
  const completedClasses = classes.filter(cls => cls.status === 'Completed').length;
  const upcomingClasses = classes.filter(cls => cls.status === 'Upcoming').length;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'Completed':
        return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'Upcoming':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ongoing':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'Completed':
        return <div className="w-2 h-2 bg-orange-500 rounded-full"></div>;
      case 'Upcoming':
        return <div className="w-2 h-2 bg-purple-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Classes 
          </h1>
          <p className="text-gray-600">
            Manage and track your teaching progress
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by course name or code..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-blue-700">{totalClasses} courses</p>
              </div>
              <div className="bg-blue-500 rounded-lg p-3">
                <BookOpen className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium mb-1">Ongoing</p>
                <p className="text-3xl font-bold text-green-700">{ongoingClasses} courses</p>
              </div>
              <div className="bg-green-500 rounded-lg p-3">
                <Play className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium mb-1">Completed</p>
                <p className="text-3xl font-bold text-orange-700">{completedClasses} courses</p>
              </div>
              <div className="bg-orange-500 rounded-lg p-3">
                <CheckCircle className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-purple-700">{upcomingClasses} courses</p>
              </div>
              <div className="bg-purple-500 rounded-lg p-3">
                <Clock className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Classes Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Course
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Semester
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Class
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Students
                    </th>
                    <th
                      onClick={handleStatusClick}
                      className="text-left py-4 px-6 font-medium text-gray-700 cursor-pointer select-none hover:text-orange-600 transition flex items-center gap-1"
                    >
                      Status
                      <ChevronDown size={16} />
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClasses.map((cls) => (
                    <tr
                      key={cls.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        try { sessionStorage.setItem('currentCourseInstanceId', String(cls.courseInstanceId)); } catch (e) { /* ignore */ }
                        navigate(`/instructor/class-statistic/${cls.courseInstanceId}`);
                      }}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{cls.code}</h3>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900 mb-1">{cls.semester}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900 mb-1">{cls.className}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900 mb-1">{cls.studentCount}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(cls.status)}`}>
                          {getStatusIcon(cls.status)}
                          {cls.statusText}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={(e) => handleKeyClick(e, cls)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Key className="text-gray-400" size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!isLoading && filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No results found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search keywords or status filter
            </p>
          </div>
        )}
      </div>

      {/* Password Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex overflow-hidden">
            {/* Left Side - Class Info */}
            <div className="w-2/5 bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex flex-col">
              <div className="mb-6">
                <div className="text-blue-600 text-sm font-semibold mb-2">{selectedClass?.code}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Class {selectedClass?.name}
                </h2>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mt-auto">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1">Class Security</h3>
                    <p className="text-sm text-yellow-800 leading-relaxed">
                      This password will be used to protect class information. Only students who have the password will be able to access the class.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Password Form */}
            <div className="w-3/5 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Update Class Password</h2>
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Please change a strong password to secure your class information
              </p>

              {/* Password Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Class Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter password..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Password Requirements:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <svg
                      className={`w-5 h-5 ${hasMinLength ? 'text-green-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm ${hasMinLength ? 'text-gray-700' : 'text-gray-500'}`}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      className={`w-5 h-5 ${hasUppercase ? 'text-green-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm ${hasLowercase ? 'text-gray-700' : 'text-gray-500'}`}>
                      Contains at least 1 lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      className={`w-5 h-5 ${hasUppercase ? 'text-green-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm ${hasUppercase ? 'text-gray-700' : 'text-gray-500'}`}>
                      Contains at least 1 uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      className={`w-5 h-5 ${hasNumber ? 'text-green-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm ${hasNumber ? 'text-gray-700' : 'text-gray-500'}`}>
                      Contains at least 1 number
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowKeyModal(false);
                    setPassword('');
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditPassword}
                  disabled={!isPasswordValid}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${isPasswordValid
                    ? 'bg-orange-500 text-white hover:bg-orange-500'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorViewClass;