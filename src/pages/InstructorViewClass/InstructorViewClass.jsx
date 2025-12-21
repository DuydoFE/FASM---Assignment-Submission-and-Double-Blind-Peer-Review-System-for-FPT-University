import React, { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, Play, CheckCircle, Clock, ChevronDown, Key } from 'lucide-react';
import { Input, Table, Select } from 'antd';
import { motion } from 'framer-motion';
import { getCurrentAccount } from '../../utils/accountUtils';
import { useNavigate } from 'react-router-dom';
import { getInstructorCourses } from '../../service/courseInstructorService';
import { updateEnrollKey } from '../../service/courseInstanceService';
import { toast } from 'react-toastify';
import ClassPasswordModal from '../../component/InstructorClass/ClassPasswordModal';

const InstructorViewClass = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentAccount();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

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
          courseInstanceId: course.courseInstanceId,
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
    setShowKeyModal(true);
  };

  const handleSavePassword = async (password) => {
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
    } catch (error) {
      toast.error("Failed to update enroll key. Please try again.");
    }
  };

  const handleStatusClick = () => {
    if (statusFilter === 'All') setStatusFilter('Ongoing');
    else if (statusFilter === 'Ongoing') setStatusFilter('Completed');
    else if (statusFilter === 'Completed') setStatusFilter('Upcoming');
    else setStatusFilter('All');
  };

  // Get unique semesters for filter dropdown
  const uniqueSemesters = useMemo(() => {
    const semesters = [...new Set(classes.map(cls => cls.semester))].filter(Boolean);
    return semesters.sort();
  }, [classes]);

  const filteredClasses = useMemo(() => {
    return classes.filter(cls =>
      (cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'All' || cls.status === statusFilter) &&
      (semesterFilter === 'All' || cls.semester === semesterFilter)
    );
  }, [classes, searchTerm, statusFilter, semesterFilter]);

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
        return 'bg-blue-100 text-blue-700 border border-blue-200';
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
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const columns = [
    {
      title: 'Course',
      dataIndex: 'code',
      key: 'code',
      width: '20%',
      render: (code) => (
        <h3 className="font-semibold text-gray-900">{code}</h3>
      ),
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      width: '15%',
      render: (semester) => (
        <span className="font-semibold text-gray-900">{semester}</span>
      ),
    },
    {
      title: 'Class',
      dataIndex: 'className',
      key: 'className',
      width: '25%',
      render: (className) => (
        <span className="font-semibold text-gray-900">{className}</span>
      ),
    },
    {
      title: 'Students',
      dataIndex: 'studentCount',
      key: 'studentCount',
      width: '10%',
      render: (count) => (
        <span className="font-semibold text-gray-900">{count}</span>
      ),
    },
    {
      title: (
        <div
          onClick={handleStatusClick}
          className="cursor-pointer select-none hover:text-orange-600 transition flex items-center gap-1"
        >
          Status
          <ChevronDown size={16} />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      render: (status, record) => (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(status)}`}>
          {getStatusIcon(status)}
          {record.statusText}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleKeyClick(e, record);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Key className="text-gray-400" size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Classes
          </h1>
          <p className="text-gray-600">
            Manage and track your teaching progress
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex gap-4 flex-wrap"
        >
          <Input
            placeholder="Search by course name or code..."
            prefix={<Search className="w-5 h-5 text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
            className="max-w-md"
            style={{
              borderRadius: '8px',
              fontSize: '18px',
            }}
          />
          <Select
            value={semesterFilter}
            onChange={setSemesterFilter}
            size="large"
            style={{ width: 200, borderRadius: '8px' }}
            options={[
              { value: 'All', label: 'All Semesters' },
              ...uniqueSemesters.map(semester => ({
                value: semester,
                label: semester
              }))
            ]}
          />
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium mb-1">Total Courses</p>
                  <p className="text-3xl font-bold text-gray-700">{totalClasses} courses</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium mb-1">Ongoing</p>
                  <p className="text-3xl font-bold text-green-700">{ongoingClasses} courses</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 font-medium mb-1">Completed</p>
                  <p className="text-3xl font-bold text-orange-700">{completedClasses} courses</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium mb-1">Upcoming</p>
                  <p className="text-3xl font-bold text-blue-700">{upcomingClasses} courses</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Classes Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Table
          columns={columns}
          dataSource={filteredClasses}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} classes`,
          }}
          onRow={(record) => ({
            onClick: () => {
              if (record.status === 'Upcoming') return;
              try {
                sessionStorage.setItem('currentCourseInstanceId', String(record.courseInstanceId));
              } catch (e) {
                /* ignore */
              }
              navigate(`/instructor/class-statistic/${record.courseInstanceId}`);
            },
            className: record.status !== 'Upcoming' ? 'cursor-pointer' : 'cursor-not-allowed opacity-60',
          })}
          locale={{
            emptyText: (
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
            ),
          }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          />
        </motion.div>
      </div>

      {/* Password Modal */}
      <ClassPasswordModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        selectedClass={selectedClass}
        initialPassword={selectedClass?.enrollmentKey || ''}
        onSave={handleSavePassword}
      />
    </div>
  );
};

export default InstructorViewClass;