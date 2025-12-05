import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import {
  getCourseInstanceById,
  getCourseStudentsByCourseInstance,
  getCourseInstructorsByCourseInstance,
  deleteCourseInstructor,
  deleteCourseStudent,
  importStudentsFromExcel,
  createCourseStudent,
  createCourseInstructor,
  getUsersByRole,
} from "../../service/adminService";

export default function AdminClassDetailsManagement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classInfo, setClassInfo] = useState(null);
  const [users, setUsers] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const changedByUserId = 1;
  const isClassActive = !!classInfo?.isActive;
  const [confirmModal, setConfirmModal] = useState({ show: false, user: null, type: "student" });
  const isActive = classInfo?.status === "Active";
  const [addStudentModal, setAddStudentModal] = useState({ show: false });
  const [studentList, setStudentList] = useState([]);
  const [newStudent, setNewStudent] = useState({ userId: "", studentCode: "" });

  const [addInstructorModal, setAddInstructorModal] = useState({ show: false });
  const [instructorList, setInstructorList] = useState([]);
  const [newInstructor, setNewInstructor] = useState({ userId: "" });

  const contextClass = {
    success: "bg-green-50 text-green-600 border border-green-200",
    error: "bg-red-50 text-red-600 border border-red-200",
    info: "bg-blue-50 text-blue-600 border border-blue-200",
    warning: "bg-orange-50 text-orange-600 border border-orange-200",
    default: "bg-white text-gray-600 border border-gray-200",
  };

  const refreshData = async () => {
    try {
      const [studentRes, instructorRes] = await Promise.all([
        getCourseStudentsByCourseInstance(id),
        getCourseInstructorsByCourseInstance(id),
      ]);

      setUsers(Array.isArray(studentRes?.data) ? studentRes.data : []);

      setInstructors(
        Array.isArray(instructorRes?.data)
          ? instructorRes.data.map((inst) => ({
            courseInstructorId: inst.id,
            courseInstanceId: inst.courseInstanceId,
            userId: inst.userId,
            instructorName: inst.instructorName,
            instructorEmail: inst.instructorEmail,
          }))
          : []
      );
    } catch (err) {
      console.error("❌ Error refreshing data:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const classData = await getCourseInstanceById(id);
        setClassInfo(classData?.data || classData);
        await refreshData();
      } catch (err) {
        console.error("❌ Error loading class details:", err);
        toast.error("Failed to load class details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleConfirmRemove = async () => {
    if (!confirmModal.user) return;

    setLoading(true);
    try {
      if (confirmModal.type === "student") {
        await deleteCourseStudent(
          confirmModal.user.userId,
          id,
          confirmModal.user.courseStudentId
        );
        toast.success(`✅ Removed student: ${confirmModal.user.studentName}`);
      } else if (confirmModal.type === "instructor") {
        await deleteCourseInstructor(
          confirmModal.user.courseInstructorId,
          confirmModal.user.courseInstanceId,
          confirmModal.user.instructorId || confirmModal.user.userId
        );
        toast.success(`✅ Removed instructor: ${confirmModal.user.instructorName}`);
      }

      await refreshData();
      setConfirmModal({ show: false, user: null, type: "student" });
    } catch (err) {
      console.error(err);
      const errorMsg = err?.response?.data?.message || "Remove failed!";
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImportFile = async () => {
    if (classInfo?.isActive) {
      toast.error("⚠️ Cannot import while the class is Active.");
      return;
    }
    if (!file) return toast.warn("⚠️ Please choose a file first!");

    try {
      setLoading(true);
      await importStudentsFromExcel(id, file, changedByUserId);
      toast.success("✅ Import students successful!");
      setFile(null);
      await refreshData();
    } catch (err) {
      console.error(err);
      const errorMsg = err?.response?.data?.message || "Import failed!";
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersByRole = async (role) => {
    try {
      const res = await getUsersByRole(role);
      const users = Array.isArray(res?.data) ? res.data : [];
      return users.filter(u => u.campusId === classInfo?.campusId);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load users list!");
      return [];
    }
  };

  const handleAddStudent = async () => {
    if (classInfo?.isActive) {
      toast.error("⚠️ Cannot add students while the class is Active.");
      return;
    }

    if (!newStudent.userId && !newStudent.studentCode)
      return toast.warn("⚠️ Please select a student or enter student code!");

    try {
      setLoading(true);

      await createCourseStudent({
        courseInstanceId: id,
        userId: newStudent.userId ? Number(newStudent.userId) : 0,
        studentCode: newStudent.studentCode || "",
        status: "Enrolled",
        changedByUserId,
      });

      toast.success("✅ Student added successfully!");
      setAddStudentModal({ show: false });
      setNewStudent({ userId: "", studentCode: "" });

      await refreshData();
    } catch (err) {
      console.error(err);
      const errorMsg = err?.response?.data?.message || "Failed to add student!";
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstructor = async () => {
    if (classInfo?.isActive) {
      toast.error("⚠️ Cannot add instructors while the class is Active.");
      return;
    }
    if (!newInstructor.userId) return toast.warn("⚠️ Please select an instructor!");

    try {
      setLoading(true);

      await createCourseInstructor({
        courseInstanceId: id,
        userId: Number(newInstructor.userId),
        isMainInstructor: true,
      });

      toast.success("✅ Instructor added successfully!");

      setAddInstructorModal({ show: false });
      setNewInstructor({ userId: "" });

      await refreshData();
    } catch (err) {
      console.error(err);
      const errorMsg = err?.response?.data?.message || "Failed to add instructor!";
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const openAddStudentModal = async () => {
    const students = await fetchUsersByRole("Student");
    setStudentList(students);
    setAddStudentModal({ show: true });
  };

  const openAddInstructorModal = async () => {
    const instructors = await fetchUsersByRole("Instructor");
    setInstructorList(instructors);
    setAddInstructorModal({ show: true });
  };

  if (loading && !classInfo) return <p className="p-6 text-gray-500">Loading details...</p>;
  if (!classInfo) return <p className="p-6 text-gray-500">Class not found</p>;

  return (
    <div className="space-y-6 relative">
      <ToastContainer
        toastClassName={({ type }) =>
          `${contextClass[type || "default"]
          } relative flex p-3 min-h-[50px] rounded-lg justify-between overflow-hidden cursor-pointer shadow-lg mb-4 transform transition-all hover:scale-105 font-medium`
        }
        bodyClassName={() => "flex items-center text-sm px-2"}
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        closeButton={false}
      />

      <button
        onClick={() => navigate("/admin/classes")}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-orange-500">📘 Class Detail</h2>

      <div className="bg-white p-4 rounded-xl shadow-md space-y-2">
        <p><strong>Class Name:</strong> {classInfo.className || classInfo.sectionCode}</p>
        <p><strong>Course:</strong> {classInfo.courseName}</p>
        <p><strong>Status:</strong> {classInfo.isActive ? "Active" : "Deactive"}</p>
        <p><strong>Semester:</strong> {classInfo.semesterName}</p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={openAddStudentModal}
          disabled={isClassActive}
          className={`px-4 py-2 rounded ${isClassActive ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
        >
          Add Student
        </button>

        <button
          onClick={openAddInstructorModal}
          disabled={isClassActive}
          className={`px-4 py-2 rounded ${isClassActive ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        >
          Add Instructor
        </button>
      </div>

      {/* STUDENT LIST */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">👥 Class Members</h3>

          <div className="space-x-2 flex items-center">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            <button
              onClick={handleImportFile}
              disabled={isClassActive}
              className={`px-4 py-2 rounded ${isClassActive ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
            >
              Import Excel
            </button>
          </div>
        </div>

        <table className="w-full text-sm border">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Student ID</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {!users || users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">No users found</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.courseStudentId || u.userId} className="border-b hover:bg-gray-50">
                  <td className="p-2">{u.studentName}</td>
                  <td className="p-2">{u.studentCode}</td>
                  <td className="p-2">{u.studentEmail}</td>
                  <td className="p-2">{u.roleName || "Student"}</td>
                  <td className={`p-2 font-medium ${u.status === "Active" ? "text-green-600" : "text-red-500"}`}>{u.status}</td>
                  <td className="p-2">
                    <button
                      onClick={() => setConfirmModal({ show: true, user: u, type: "student" })}
                      className={`text-red-500 hover:underline font-medium ${isClassActive ? "cursor-not-allowed opacity-50" : ""
                        }`}
                      disabled={isClassActive}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* INSTRUCTOR LIST */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
        <h3 className="text-lg font-semibold">👨‍🏫 Instructors</h3>

        <table className="w-full text-sm border">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {instructors.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">No instructors found</td>
              </tr>
            ) : (
              instructors.map((inst) => (
                <tr key={inst.courseInstructorId} className="border-b hover:bg-gray-50">
                  <td className="p-2">{inst.instructorName}</td>
                  <td className="p-2">{inst.instructorEmail}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => setConfirmModal({ show: true, user: inst, type: "instructor" })}
                      className={`px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs shadow ${isClassActive ? "cursor-not-allowed opacity-50 hover:bg-red-500" : ""
                        }`}
                      disabled={isClassActive}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate(`/admin/classes/${id}/assignments`)}
          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 shadow-md"
        >
          📄 View Assignments
        </button>
      </div>

      {/* CONFIRM REMOVE MODAL */}
      {confirmModal.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg text-center space-y-4 animate-fade-in-down">
            <h3 className="text-lg font-bold text-red-600">⚠ Confirm Removal</h3>
            <p>
              Are you sure you want to remove{" "}
              <strong>{confirmModal.user.studentName || confirmModal.user.instructorName}</strong>?
            </p>

            <div className="flex justify-center space-x-4 pt-2">
              <button
                onClick={() => setConfirmModal({ show: false, user: null, type: "student" })}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow"
                disabled={loading}
              >
                {loading ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {addStudentModal.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg text-center space-y-4 animate-fade-in-down">
            <h3 className="text-lg font-bold text-green-600">➕ Add Student</h3>

            <div className="space-y-2">
              <select
                value={newStudent.userId}
                onChange={(e) => setNewStudent({ ...newStudent, userId: e.target.value })}
                className="w-full p-2 border rounded focus:border-green-500 outline-none"
              >
                <option value="">Select Student</option>
                {studentList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} - {s.email}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Student Code (Optional)"
                value={newStudent.studentCode}
                onChange={(e) =>
                  setNewStudent({
                    userId: "",
                    studentCode: e.target.value.trim(),
                  })
                }
                className="w-full p-2 border rounded focus:border-green-500 outline-none"
              />
            </div>

            <div className="flex justify-center space-x-4 pt-2">
              <button
                onClick={() => setAddStudentModal({ show: false })}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD INSTRUCTOR MODAL */}
      {addInstructorModal.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg text-center space-y-4 animate-fade-in-down">
            <h3 className="text-lg font-bold text-blue-600">➕ Add Instructor</h3>

            <select
              value={newInstructor.userId}
              onChange={(e) => setNewInstructor({ ...newInstructor, userId: e.target.value })}
              className="w-full p-2 border rounded focus:border-blue-500 outline-none"
            >
              <option value="">Select Instructor</option>
              {instructorList.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.firstName} {i.lastName} - {i.email}
                </option>
              ))}
            </select>

            <div className="flex justify-center space-x-4 pt-2">
              <button
                onClick={() => setAddInstructorModal({ show: false })}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddInstructor}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}