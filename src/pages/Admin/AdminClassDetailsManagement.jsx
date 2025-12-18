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
  const [newStudent, setNewStudent] = useState({ studentCode: "" });
  const getApiMessage = (res, fallback = "") => {
    return res?.data?.message || res?.message || fallback;
  };

  const [addInstructorModal, setAddInstructorModal] = useState({ show: false });
  const [newInstructor, setNewInstructor] = useState({ userName: "" });
  const hasInstructor = instructors.length > 0;

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
      const res = confirmModal.type === "student"
        ? await deleteCourseStudent(
          confirmModal.user.userId,
          id,
          confirmModal.user.courseStudentId
        )
        : await deleteCourseInstructor(
          confirmModal.user.courseInstructorId,
          confirmModal.user.courseInstanceId,
          confirmModal.user.instructorId || confirmModal.user.userId
        );

      toast.success(`✅ ${getApiMessage(res, "Removed successfully!")}`);

      await refreshData();
      setConfirmModal({ show: false, user: null, type: "student" });
    } catch (err) {
      console.error(err);
      toast.error(`❌ ${err?.response?.data?.message || err?.message || "Remove failed!"}`);
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
      const res = await importStudentsFromExcel(id, file, changedByUserId);
      toast.success(`✅ ${getApiMessage(res, "Import students successful!")}`);
      setFile(null);
      await refreshData();
    } catch (err) {
      console.error(err);
      toast.error(`❌ ${err?.response?.data?.message || err?.message || "Import failed!"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (classInfo?.isActive) {
      toast.error("⚠️ Cannot add students while the class is Active.");
      return;
    }

    try {
      setLoading(true);
      const res = await createCourseStudent({
        courseInstanceId: id,
        userId: 0,
        studentCode: newStudent.studentCode,
        status: "Enrolled",
        changedByUserId,
      });
      toast.success(`✅ ${getApiMessage(res, "Student added successfully!")}`);
      setAddStudentModal({ show: false });
      setNewStudent({ userId: "", studentCode: "" });
      await refreshData();
    } catch (err) {
      console.error(err);
      toast.error(`❌ ${err?.response?.data?.message || err?.message || "Failed to add student!"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstructor = async () => {
    if (instructors.length > 0) {
      toast.warn("⚠️ This class already has an instructor!");
      return;
    }
    if (classInfo?.isActive) {
      toast.error("⚠️ Cannot add instructors while the class is Active.");
      return;
    }

    try {
      setLoading(true);
      const res = await createCourseInstructor({
        courseInstanceId: id,
        userName: newInstructor.userName,
        isMainInstructor: true,
      });
      ;
      toast.success(`✅ ${getApiMessage(res, "Instructor added successfully!")}`);
      setAddInstructorModal({ show: false });
      setNewInstructor({ userName: "" });
      await refreshData();
    } catch (err) {
      console.error(err);
      toast.error(`❌ ${err?.response?.data?.message || err?.message || "Failed to add instructor!"}`);
    } finally {
      setLoading(false);
    }
  };

  const openAddStudentModal = () => {
    setAddStudentModal({ show: true });
  };

  const openAddInstructorModal = () => {
    setAddInstructorModal({ show: true });
  };

  if (loading && !classInfo) return <p className="p-6 text-gray-500">Loading details...</p>;
  if (!classInfo) return <p className="p-6 text-gray-500">Class not found</p>;

  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen relative">
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
        className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
      >
        ← Back
      </button>

      <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
        Class Detail
      </h2>
      <p className="text-gray-500 -mt-4">
        View class information, students and instructors
      </p>

      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
        <p><strong>Class Name:</strong> {classInfo.className || classInfo.sectionCode}</p>
        <p><strong>Course:</strong> {classInfo.courseCode}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold
    ${classInfo.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {classInfo.isActive ? "Active" : "Inactive"}
          </span>
        </p>
        <p><strong>Semester:</strong> {classInfo.semesterName}</p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={openAddStudentModal}
          disabled={isClassActive}
          className={`
px-5 py-2.5 rounded-xl font-semibold transition-all
${isClassActive
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-600 text-white shadow-md shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5"
            }`}
        >
          Add Student
        </button>

        <button
          onClick={openAddInstructorModal}
          disabled={isClassActive || hasInstructor}
          className={`
px-5 py-2.5 rounded-xl font-semibold transition-all
${isClassActive || hasInstructor
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5"
            }`}
        >
          Add Instructor
        </button>
      </div>

      {hasInstructor && (
        <p className="text-sm text-red-500 mt-1">
          ⚠️ This class already has an instructor.
        </p>
      )}

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
              className={`
px-5 py-2.5 rounded-xl font-semibold transition-all
${isClassActive
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 text-white shadow-md shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5"
                }`}
            >
              Import Excel
            </button>
          </div>
        </div>

        <table className="w-full text-sm border-collapse table-fixed">
          <thead className="bg-[#FFF3EB] text-[#F36F21] text-sm uppercase font-semibold border-b-2 border-[#F36F21]">
            <tr>
              <th className="p-3 text-left align-middle">Name</th>
              <th className="p-3 text-left align-middle">Student ID</th>
              <th className="p-3 text-left align-middle">Email</th>
              <th className="p-3 text-left align-middle">Role</th>
              <th className="p-3 text-left align-middle">Status</th>
              <th className="p-3 text-left align-middle">Action</th>
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
                  <td className="p-3 text-left align-middle">{u.studentName}</td>
                  <td className="p-3 text-left align-middle">{u.studentCode}</td>
                  <td className="p-3 text-left align-middle">{u.studentEmail}</td>
                  <td className="p-3 text-left align-middle">{u.roleName || "Student"}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold${u.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-left align-middle">
                    <button
                      onClick={() => setConfirmModal({ show: true, user: u, type: "student" })}
                      disabled={isClassActive}
                      className={`
px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
${isClassActive
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                        }`}
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
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
        <h3 className="text-lg font-semibold">👨‍🏫 Instructors</h3>

        <table className="w-full text-sm border-collapse table-fixed">
          <thead className="bg-[#FFF3EB] text-[#F36F21] text-sm uppercase font-semibold border-b-2 border-[#F36F21]">
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
                      disabled={isClassActive}
                      className={`
px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
${isClassActive
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                        }`}
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
          className="px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold shadow-md shadow-orange-200 hover:bg-orange-700 hover:-translate-y-0.5 transition-all"
        >
          📄 View Assignments
        </button>
      </div>

      {/* CONFIRM REMOVE MODAL */}
      {confirmModal.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl space-y-5 animate-[fadeIn_0.15s_ease-out]">
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
                className="w-full p-3 rounded-xl border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
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

            <input
              type="text"
              placeholder="Instructor username"
              value={newInstructor.userName}
              onChange={(e) =>
                setNewInstructor({ userName: e.target.value.trim() })
              }
              className="w-full p-2 border rounded focus:border-blue-500 outline-none"
            />

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
                disabled={loading || !newInstructor.userName}
                className={`px-4 py-2 rounded shadow text-white ${loading || !newInstructor.userName
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
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