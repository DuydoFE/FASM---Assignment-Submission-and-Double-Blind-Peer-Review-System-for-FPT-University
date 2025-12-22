import React, { useState, useEffect } from "react";
import {
  Plus,
  FileSpreadsheet,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  getAssignmentsByCourseInstanceId,
  createAssignment,
  deleteAssignment,
  updateAssignment,
  assignmentService,
} from "../../service/assignmentService";
import { getCourseInstanceById } from "../../service/courseInstanceService";
import CreateAssignmentModal from "../../component/Assignment/CreateAssignmentModal";
import EditAssignmentModal from "../../component/Assignment/EditAssignmentModal";
import DeleteAssignmentModal from "../../component/Assignment/DeleteAssignmentModal";
import PublishAssignmentModal from "../../component/Assignment/PublishAssignmentModal";
import ExportExcelModal from "../../component/Assignment/ExportExcelModal";
import UpdateDeadlineModal from "../../component/Assignment/UpdateDeadlineModal";
import InstructorAssignmentStatsCards from "../../component/Assignment/InstructorAssignmentStatsCards";
import InstructorManageAssignmentTable from "../../component/Assignment/InstructorManageAssignmentTable";

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
      case "Active":
        return "bg-green-100 text-green-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Draft":
        return "bg-white text-gray-800 border border-gray-300";
      case "GradesPublished":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
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
        deadline: assignment.deadline,
        reviewDeadline: assignment.reviewDeadline,
        finalDeadline: assignment.finalDeadline,
        time: assignment.deadline,
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
      console.log("Course Instance Data:", response);
      setCourseInstanceData(response);
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
      
      const seconds = "00";
      const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

      await assignmentService.extendDeadline(
        selectedAssignment.id,
        localDateTimeString
      );

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id
            ? {
                ...a,
                deadline: localDateTimeString,
                time: localDateTimeString,
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
        return true;
      } else {
        throw new Error("Failed to update assignment");
      }
    } catch (error) {
      console.error("Failed to update assignment:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update assignment. Please try again."
      );
      return false;
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
      throw error;
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

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading assignments...</p>
      </div>
    );
  }

  const courseInfo = courseInstanceData
    ? {
        courseCode: courseInstanceData.courseCode,
        courseName: courseInstanceData.courseName,
        sectionCode: courseInstanceData.sectionCode,
        campusName: courseInstanceData.campusName,
        totalStudents: 35,
      }
    : assignments.length > 0
    ? {
        courseCode: assignments[0].courseCode,
        courseName: assignments[0].courseName || "",
        sectionCode: assignments[0].sectionCode,
        campusName: "",
        totalStudents: 35,
      }
    : null;

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Assignment</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <InstructorAssignmentStatsCards assignments={assignments} />
      </motion.div>

      {/* Assignment Table Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <InstructorManageAssignmentTable
        assignments={assignments}
        loading={loading}
        onUpdateDeadline={handleUpdateDeadlineClick}
        onDelete={handleDeleteClick}
        onEdit={handleEditClick}
        onViewSubmissions={handleViewSubmissions}
          onPublish={handlePublishClick}
        />
      </motion.div>

      {/* Modals */}
      <UpdateDeadlineModal
        isOpen={showUpdateDeadlineModal}
        onClose={handleCloseDeadlineModal}
        onSave={handleSaveDeadline}
        assignment={selectedAssignment}
      />

      <DeleteAssignmentModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        assignment={selectedAssignment}
      />

      <CreateAssignmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateAssignment}
        courseInstanceId={courseInstanceId}
      />

      <EditAssignmentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingAssignment(null);
        }}
        onSubmit={handleUpdateAssignment}
        assignment={editingAssignment}
        courseInstanceId={courseInstanceId}
      />

      <ExportExcelModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        courseInfo={courseInfo}
        assignments={assignments}
        classId={courseInstanceId}
      />

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