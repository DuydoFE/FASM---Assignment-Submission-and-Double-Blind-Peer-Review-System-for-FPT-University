import React, { useState, useEffect, useRef } from 'react';
import { Plus, FileText, Calendar, X, Trash2, Edit, MoreVertical, Upload } from 'lucide-react';
import { toast } from "react-toastify";
import { useNavigate, useLocation } from 'react-router-dom';
import { getAssignmentsByCourseInstanceId, createAssignment, deleteAssignment, updateAssignment, assignmentService } from '../../service/assignmentService';
import { submissionService } from '../../service/submissionService';
import CreateAssignmentModal from '../../component/Assignment/CreateAssignmentModal';
import EditAssignmentModal from '../../component/Assignment/EditAssignmentModal';
import DeleteAssignmentModal from '../../component/Assignment/DeleteAssignmentModal';

const InstructorManageAssignment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [courseInstanceId, setCourseInstanceId] = useState(() => {
    try {
      const fromState = location?.state?.courseInstanceId;
      const fromStorage = sessionStorage.getItem('currentCourseInstanceId');
      if (fromState !== undefined && fromState !== null) return String(fromState);
      if (fromStorage) return String(fromStorage);
      return null;
    } catch (e) {
      return location?.state?.courseInstanceId ? String(location.state.courseInstanceId) : null;
    }
  });

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateDeadlineModal, setShowUpdateDeadlineModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newDeadline, setNewDeadline] = useState('');
  const [newTime, setNewTime] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await getAssignmentsByCourseInstanceId(courseInstanceId);

      const mappedAssignments = response.map(assignment => ({
        id: assignment.assignmentId,
        assignmentId: assignment.assignmentId,
        title: assignment.title,
        description: assignment.description,
        guidelines: assignment.guidelines,
        deadline: new Date(assignment.deadline).toLocaleDateString(),
        reviewDeadline: new Date(assignment.reviewDeadline).toLocaleDateString(),
        finalDeadline: new Date(assignment.finalDeadline).toLocaleDateString(),
        time: new Date(assignment.deadline).toLocaleTimeString(),
        submitted: assignment.reviewCount,
        total: assignment.submissionCount,
        courseCode: assignment.courseCode,
        sectionCode: assignment.sectionCode,
        status: assignment.status || 'Open',
        statusColor: (assignment.status || 'Open') === 'Open'
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800",
        originalData: assignment
      }));

      setAssignments(mappedAssignments);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseInstanceId) {
      fetchAssignments();
    }
  }, [courseInstanceId]);



  const handleUpdateDeadlineClick = (assignment) => {
    setSelectedAssignment(assignment);

    const [day, month, year] = assignment.deadline.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    setNewDeadline(formattedDate);

    const timeArr = assignment.time.split(':');
    const formattedTime = `${timeArr[0].padStart(2, '0')}:${timeArr[1].padStart(2, '0')}`;
    setNewTime(formattedTime);

    setShowUpdateDeadlineModal(true);
    setOpenDropdownId(null);
  };

  const handleSaveDeadline = async () => {
    if (!newDeadline || !newTime) {
      alert('Please enter both date and time');
      return;
    }

    try {
      const [year, month, day] = newDeadline.split('-');
      const [hours, minutes] = newTime.split(':');
      const deadlineDate = new Date(year, month - 1, day, hours, minutes);

      await assignmentService.extendDeadline(selectedAssignment.id, deadlineDate.toISOString());

      setAssignments(prev =>
        prev.map(a =>
          a.id === selectedAssignment.id
            ? {
              ...a,
              deadline: deadlineDate.toLocaleDateString(),
              time: deadlineDate.toLocaleTimeString()
            }
            : a
        )
      );
      toast.success('Deadline extended successfully!');
      setShowUpdateDeadlineModal(false);
      setNewDeadline('');
      setNewTime('');
      setSelectedAssignment(null);
    } catch (error) {
      console.error('Failed to extend deadline:', error);
      toast.error('Failed to extend deadline. Please try again.');
    }
  };

  const handleCloseDeadlineModal = () => {
    setShowUpdateDeadlineModal(false);
    setSelectedAssignment(null);
    setNewDeadline('');
    setNewTime('');
  };

  const handleDeleteClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDeleteModal(true);
    setOpenDropdownId(null);
  };

  const handleDeleteConfirm = async (assignmentId) => {
    try {
      await deleteAssignment(assignmentId);
      toast.success('Assignment deleted successfully!');
      setShowDeleteModal(false);
      setSelectedAssignment(null);
      await fetchAssignments();
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete assignment. Please try again.');
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedAssignment(null);
  };

  const handleEditClick = async (assignment) => {
    try {
      const fullDetails = await assignmentService.getAssignmentDetailsById(assignment.assignmentId);
      setEditingAssignment(fullDetails);
      setShowEditModal(true);
      setOpenDropdownId(null);
    } catch (error) {
      console.error('Failed to fetch assignment details:', error);
      toast.error('Failed to load assignment details. Please try again.');
    }
  };

  const handleUpdateAssignment = async (updatedData, file) => {
    try {
      const response = await updateAssignment(updatedData, file);
      if (response) {
        toast.success('Assignment updated successfully!');
        setShowEditModal(false);
        setEditingAssignment(null);
        await fetchAssignments();
      } else {
        throw new Error('Failed to update assignment');
      }
    } catch (error) {
      console.error('Failed to update assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to update assignment. Please try again.');
    }
  };

  const handleCreateAssignment = async (assignmentData, file) => {
    try {
      await createAssignment(assignmentData, file);
      await fetchAssignments();
      toast.success('Assignment created successfully!');
      setShowModal(false);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to create assignment';
      toast.error(message);
    }
  };


  const handleViewSubmissions = async (assignment) => {
    try {
      await submissionService.getSubmissionsByAssignment(assignment.assignmentId);
      navigate(`/instructor/manage-submission/${assignment.assignmentId}`);
      setOpenDropdownId(null);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      toast.error('Failed to load submissions. Please try again.');
    }
  };

  const handlePublishAssignment = async (assignment) => {
    try {
      // Use the id property (assignment.assignmentId) as other handlers do
      await assignmentService.publishAssignment(assignment.id || assignment.assignmentId);
      toast.success('Assignment published successfully!');
      setOpenDropdownId(null);
      // Refresh the list to reflect new status
      await fetchAssignments();
    } catch (error) {
      console.error('Failed to publish assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to publish assignment. Please try again.');
    }
  };

  const toggleDropdown = (assignmentId) => {
    setOpenDropdownId(openDropdownId === assignmentId ? null : assignmentId);
  };

  const filteredAssignments = assignments;

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading assignments...</p>
      </div>
    );
  }

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
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignment Management</h1>
          <div className="flex items-center space-x-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Course: {assignments.length > 0 ? assignments[0].courseCode : 'N/A'}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Class: {assignments.length > 0 ? assignments[0].sectionCode : 'N/A'}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Assignments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{assignments.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-visible">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="col-span-3">Assignment Name</div>
          <div className="col-span-2 text-center">Deadline</div>
          <div className="col-span-2 text-center">Review Deadline</div>
          <div className="col-span-2 text-center">Submissions</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>

        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 items-center transition-colors relative"
          >
            <div className="col-span-3 space-y-1">
              <h3 className="font-semibold text-gray-900 text-base truncate">{assignment.title}</h3>
            </div>
            <div className="col-span-2 text-center space-y-1">
              <div className={`font-medium text-base ${getDeadlineColor(assignment.deadline)}`}>
                {assignment.deadline}
              </div>
              <div className="text-sm text-gray-500">{assignment.time}</div>
            </div>
            <div className="col-span-2 text-center space-y-1">
              <div className={`font-medium text-base ${getDeadlineColor(assignment.reviewDeadline)}`}>
                {assignment.reviewDeadline}
              </div>
              <div className="text-sm text-gray-500">{assignment.time}</div>
            </div>
            <div className="col-span-2 text-center">
              <div className="font-bold text-lg text-gray-900">
                {assignment.submitted}/{assignment.total}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((assignment.submitted / assignment.total) * 100)}% completed
              </div>
            </div>
            <div className="col-span-2 flex justify-center">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${assignment.statusColor}`}
              >
                <span>{assignment.status}</span>
              </span>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              <div className="relative" ref={openDropdownId === assignment.id ? dropdownRef : null}>
                <button
                  onClick={() => toggleDropdown(assignment.id)}
                  className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="More actions"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {openDropdownId === assignment.id && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-2xl border border-gray-200 z-[100] overflow-hidden">
                    {(assignment.status === 'Draft') && (
                      <button
                        onClick={() => handlePublishAssignment(assignment)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 transition-colors text-left"
                      >
                        <Upload className="w-4 h-4 text-yellow-600" />
                        <span>Publish Assignment</span>
                      </button>
                    )}
                    {(assignment.status === 'Active') && (
                      <button
                        onClick={() => handleUpdateDeadlineClick(assignment)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors text-left"
                      >
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Extend Deadline</span>
                      </button>
                    )}
                    {(assignment.status === 'Draft' || assignment.status === 'Upcoming') && (
                      <button
                        onClick={() => handleEditClick(assignment)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors text-left"
                      >
                        <Edit className="w-4 h-4 text-green-600" />
                        <span>Edit Assignment</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleViewSubmissions(assignment)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span>View Submissions</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    {(assignment.status === 'Draft' || assignment.status === 'Upcoming') && (
                      <button
                        onClick={() => handleDeleteClick(assignment)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Assignment</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Update Deadline Modal */}
      {showUpdateDeadlineModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Extend Deadline</h2>
              <button
                onClick={handleCloseDeadlineModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment: <span className="font-semibold text-gray-900">{selectedAssignment.title}</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Current deadline:</span> {selectedAssignment.deadline} at {selectedAssignment.time}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseDeadlineModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDeadline}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Extend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Assignment Modal */}
      <DeleteAssignmentModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        assignment={selectedAssignment}
      />

      {/* Create Assignment Modal */}
      <CreateAssignmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateAssignment}
        courseInstanceId={courseInstanceId}
      />

      {/* Edit Assignment Modal */}
      <EditAssignmentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingAssignment(null);
        }}
        onSubmit={handleUpdateAssignment}
        assignment={editingAssignment}
      />
    </div>
  );
};

export default InstructorManageAssignment;