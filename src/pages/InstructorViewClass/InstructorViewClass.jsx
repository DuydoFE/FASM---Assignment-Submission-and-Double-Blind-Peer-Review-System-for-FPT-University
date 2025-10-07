import React, { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, Play, CheckCircle, Clock, MoreHorizontal, ChevronDown } from 'lucide-react';
import { getCurrentAccount } from '../../utils/accountUtils';
import { useNavigate } from 'react-router-dom';
import { getInstructorCourses } from '../../service/courseInstructor';

const InstructorViewClass = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentAccount();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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
          classId: course.courseInstanceName,
          students: course.studentCount,
          status: course.isMainInstructor ? 'active' : 'completed',
          statusText: course.isMainInstructor ? 'Ongoing' : 'Completed'
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

  const handleStatusClick = () => {
    if (statusFilter === 'All') setStatusFilter('active');
    else if (statusFilter === 'active') setStatusFilter('completed');
    else setStatusFilter('All');
  };

  const filteredClasses = useMemo(() => {
    return classes.filter(cls =>
      (cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       cls.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'All' || cls.status === statusFilter)
    );
  }, [classes, searchTerm, statusFilter]);

  const totalClasses = classes.length;
  const activeClasses = classes.filter(cls => cls.status === 'active').length;
  const completedClasses = classes.filter(cls => cls.status === 'completed').length;
  const upcomingClasses = classes.filter(cls => cls.status === 'upcoming').length;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'completed':
        return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'upcoming':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'completed':
        return <div className="w-2 h-2 bg-orange-500 rounded-full"></div>;
      case 'upcoming':
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
            All Classes - FALL2025
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
                <p className="text-3xl font-bold text-green-700">{activeClasses} courses</p>
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
                      Course Information
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
                      onClick={() => navigate(`/instructor/manage-class/${cls.id}`)}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {cls.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{cls.code}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-gray-900">{cls.classId}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900">{cls.students}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(cls.status)}`}>
                          {getStatusIcon(cls.status)}
                          {cls.statusText}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="text-gray-400" size={16} />
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
    </div>
  );
};

export default InstructorViewClass;