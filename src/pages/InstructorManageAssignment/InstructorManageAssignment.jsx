import React, { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  Calendar,
  Trash2,
  Edit,
  MoreVertical,
  Upload,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Dropdown } from "antd";
import {
  getAssignmentsByCourseInstanceId,
  createAssignment,
  deleteAssignment,
  updateAssignment,
  assignmentService,
} from "../../service/assignmentService";
import { submissionService } from "../../service/submissionService";
import { getCourseInstanceById } from "../../service/courseInstanceService";
import CreateAssignmentModal from "../../component/Assignment/CreateAssignmentModal";
import EditAssignmentModal from "../../component/Assignment/EditAssignmentModal";
import DeleteAssignmentModal from "../../component/Assignment/DeleteAssignmentModal";
import PublishAssignmentModal from "../../component/Assignment/PublishAssignmentModal";
import ExportExcelModal from "../../component/Assignment/ExportExcelModal";
import UpdateDeadlineModal from "../../component/Assignment/UpdateDeadlineModal";

const InstructorManageAssignment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const courseInstanceId = params.courseInstanceId || location?.state?.courseInstanceId || sessionStorage.getItem("currentCourseInstanceId");

  const [assignments, setAssignments] = useState([]);
  const [courseInstanceData, setCourseInstanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateDeadlineModal, setShowUpdateDeadlineModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "GradesPublished":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-800";
      case "InReview":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await getAssignmentsByCourseInstanceId(courseInstanceId);

      const mappedAssignments = response.map((assignment) => ({
        id: assignment.assignmentId,
        assignmentId: assignment.assignmentId,
        title: assignment.title,
        description: assignment.description,
        guidelines: assignment.guidelines,
        deadline: new Date(assignment.deadline).toLocaleDateString(),
        reviewDeadline: new Date(
          assignment.reviewDeadline
        ).toLocaleDateString(),
        finalDeadline: new Date(assignment.finalDeadline).toLocaleDateString(),
        time: new Date(assignment.deadline).toLocaleTimeString(),
        submitted: assignment.reviewCount,
        total: assignment.submissionCount,
        courseCode: assignment.courseCode,
        sectionCode: assignment.sectionCode,
        status: assignment.status,
        statusColor: getStatusColor(assignment.status),
        originalData: assignment,
      }));

      setAssignments(mappedAssignments);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseInstanceData = async () => {
    try {
      const response = await getCourseInstanceById(courseInstanceId);
      console.log("Course Instance API Response:", response);
      // API might return { data: {...} } or directly the data
      const data = response.data || response;
      console.log("Course Instance Data:", data);
      setCourseInstanceData(data);
    } catch (error) {
      console.error("Failed to fetch course instance data:", error);
    }
  };

  useEffect(() => {
    if (courseInstanceId) {
      fetchAssignments();
      fetchCourseInstanceData();
    }
  }, [courseInstanceId]);

  const handleUpdateDeadlineClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowUpdateDeadlineModal(true);
  };

  const handleSaveDeadline = async (newDeadline, newTime) => {
    try {
      const [year, month, day] = newDeadline.split("-");
      const [hours, minutes] = newTime.split(":");
      const deadlineDate = new Date(year, month - 1, day, hours, minutes);

      await assignmentService.extendDeadline(
        selectedAssignment.id,
        deadlineDate.toISOString()
      );

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id
            ? {
                ...a,
                deadline: deadlineDate.toLocaleDateString(),
                time: deadlineDate.toLocaleTimeString(),
              }
            : a
        )
      );
      toast.success("Deadline extended successfully!");
      setShowUpdateDeadlineModal(false);
      setSelectedAssignment(null);
    } catch (error) {
      console.error("Failed to extend deadline:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to extend deadline. Please try again."
      );
    }
  };

  const handleCloseDeadlineModal = () => {
    setShowUpdateDeadlineModal(false);
    setSelectedAssignment(null);
  };

  const handleDeleteClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (assignmentId) => {
    try {
      await deleteAssignment(assignmentId);
      toast.success("Assignment deleted successfully!");
      setShowDeleteModal(false);
      setSelectedAssignment(null);
      await fetchAssignments();
    } catch (error) {
      console.error("Failed to delete assignment:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete assignment. Please try again."
      );
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedAssignment(null);
  };

  const handleEditClick = async (assignment) => {
    try {
      const fullDetails = await assignmentService.getAssignmentDetailsById(
        assignment.assignmentId
      );
      setEditingAssignment(fullDetails);
      setShowEditModal(true);
    } catch (error) {
      console.error("Failed to fetch assignment details:", error);
      toast.error("Failed to load assignment details. Please try again.");
    }
  };

  const handleUpdateAssignment = async (updatedData, file) => {
    try {
      const response = await updateAssignment(updatedData, file);
      if (response) {
        toast.success("Assignment updated successfully!");
        setShowEditModal(false);
        setEditingAssignment(null);
        await fetchAssignments();
        return true; // Return true on success
      } else {
        throw new Error("Failed to update assignment");
      }
    } catch (error) {
      console.error("Failed to update assignment:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update assignment. Please try again."
      );
      return false; // Return false on error to keep modal open
    }
  };

  const handleCreateAssignment = async (assignmentData, file) => {
    try {
      await createAssignment(assignmentData, file);
      await fetchAssignments();
      toast.success("Assignment created successfully!");
      setShowModal(false);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create assignment";
      toast.error(message);
      // Don't close modal on error - let user fix the issue and retry
      throw error; // Re-throw to prevent modal from closing
    }
  };

  const handleViewSubmissions = (assignment) => {
    navigate(`/instructor/manage-submission/${assignment.assignmentId}`);
  };

  const handlePublishClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowPublishModal(true);
  };

  const handlePublishConfirm = async (assignmentId) => {
    try {
      await assignmentService.publishAssignment(assignmentId);
      toast.success("Assignment published successfully!");
      setShowPublishModal(false);
      setSelectedAssignment(null);
      await fetchAssignments();
    } catch (error) {
      console.error("Failed to publish assignment:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to publish assignment. Please try again."
      );
    }
  };

  const handleClosePublishModal = () => {
    setShowPublishModal(false);
    setSelectedAssignment(null);
  };

  const getDropdownItems = (assignment) => [
    ...(assignment.status === "Draft"
      ? [
          {
            label: (
              <div className="flex items-center gap-2 px-2 py-1">
                <Upload className="w-4 h-4 text-yellow-600" />
                <span>Publish Assignment</span>
              </div>
            ),
            onClick: () => handlePublishClick(assignment),
          },
        ]
      : []),
    ...(assignment.status === "Active"
      ? [
          {
            label: (
              <div className="flex items-center gap-2 px-2 py-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Extend Deadline</span>
              </div>
            ),
            onClick: () => handleUpdateDeadlineClick(assignment),
          },
        ]
      : []),
    ...(assignment.status === "Draft" || assignment.status === "Upcoming"
      ? [
          {
            label: (
              <div className="flex items-center gap-2 px-2 py-1">
                <Edit className="w-4 h-4 text-green-600" />
                <span>Edit Assignment</span>
              </div>
            ),
            onClick: () => handleEditClick(assignment),
          },
        ]
      : []),
    {
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <FileText className="w-4 h-4 text-gray-600" />
          <span>View Submissions</span>
        </div>
      ),
      onClick: () => handleViewSubmissions(assignment),
    },
    ...(assignment.status === "Draft" || assignment.status === "Upcoming"
      ? [
          {
            type: "divider",
          },
          {
            label: (
              <div className="flex items-center gap-2 px-2 py-1">
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Delete Assignment</span>
              </div>
            ),
            onClick: () => handleDeleteClick(assignment),
          },
        ]
      : []),
  ];

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
    const deadlineDate = new Date(deadline.split("/").reverse().join("-"));
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-500";
    if (diffDays <= 3) return "text-orange-500";
    return "text-gray-900";
  };

  const courseInfo = courseInstanceData
    ? {
        courseCode: courseInstanceData.courseCode,
        sectionCode: courseInstanceData.courseInstanceName,
        totalStudents: 35, // You can get this from API if available
      }
    : assignments.length > 0
    ? {
        courseCode: assignments[0].courseCode,
        sectionCode: assignments[0].sectionCode,
        totalStudents: 35,
      }
    : null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assignment Management
          </h1>
          <div className="flex items-center space-x-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Course:{" "}
              {courseInstanceData?.courseCode || "N/A"}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Class:{" "}
              {courseInstanceData?.sectionCode || "N/A"}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            disabled={assignments.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-5 h-5" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Total Assignments
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {assignments.length}
              </p>
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
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 items-center transition-colors relative"
          >
            <div className="col-span-3 space-y-1">
              <h3 className="font-semibold text-gray-900 text-base truncate">
                {assignment.title}
              </h3>
            </div>
            <div className="col-span-2 text-center space-y-1">
              <div
                className={`font-medium text-base ${getDeadlineColor(
                  assignment.deadline
                )}`}
              >
                {assignment.deadline}
              </div>
              <div className="text-sm text-gray-500">{assignment.time}</div>
            </div>
            <div className="col-span-2 text-center space-y-1">
              <div
                className={`font-medium text-base ${getDeadlineColor(
                  assignment.reviewDeadline
                )}`}
              >
                {assignment.reviewDeadline}
              </div>
              <div className="text-sm text-gray-500">{assignment.time}</div>
            </div>
            <div className="col-span-2 flex justify-center">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${assignment.statusColor}`}
              >
                <span>{assignment.status}</span>
              </span>
            </div>
            <div className="col-span-2 flex justify-center items-center">
              <Dropdown
                menu={{ items: getDropdownItems(assignment) }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </Dropdown>
            </div>
          </div>
        ))}
      </div>

      {/* Update Deadline Modal */}
      <UpdateDeadlineModal
        isOpen={showUpdateDeadlineModal}
        onClose={handleCloseDeadlineModal}
        onSave={handleSaveDeadline}
        assignment={selectedAssignment}
      />

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

      {/* Export Excel Modal */}
      <ExportExcelModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        courseInfo={courseInfo}
        assignments={assignments}
        classId={courseInstanceId}
      />

      {/* Publish Assignment Modal */}
      <PublishAssignmentModal
        isOpen={showPublishModal}
        onClose={handleClosePublishModal}
        onConfirm={handlePublishConfirm}
        assignment={selectedAssignment}
      />
    </div>
  );
};

export default InstructorManageAssignment;
