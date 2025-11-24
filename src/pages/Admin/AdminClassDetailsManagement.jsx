import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getCourseInstanceById,
  getCourseStudentsByCourseInstance,
  getCourseInstructorsByCourseInstance,
  updateMainInstructor,
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

  const [confirmModal, setConfirmModal] = useState({ show: false, user: null, type: "student" });

  // Add Student Modal
  const [addStudentModal, setAddStudentModal] = useState({ show: false });
  const [studentList, setStudentList] = useState([]);
  const [newStudent, setNewStudent] = useState({ userId: "", studentCode: "" });

  // Add Instructor Modal
  const [addInstructorModal, setAddInstructorModal] = useState({ show: false });
  const [instructorList, setInstructorList] = useState([]);
  const [newInstructor, setNewInstructor] = useState({ userId: "" });

  const refreshData = async () => {
    try {
      const [studentRes, instructorRes] = await Promise.all([
        getCourseStudentsByCourseInstance(id),
        getCourseInstructorsByCourseInstance(id),
      ]);
      setUsers(Array.isArray(studentRes?.data) ? studentRes.data : []);
      // Lưu cả courseInstructorId
      setInstructors(
        Array.isArray(instructorRes?.data)
          ? instructorRes.data.map(inst => ({
            ...inst,
            courseInstructorId: inst.courseInstructorId, // đảm bảo có ID
          }))
          : []
      );
    } catch (err) {
      console.error("❌ Error refreshing data:", err);
      toast.error("Failed to refresh class data!");
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

  const handleToggleMainInstructor = async (inst) => {
    try {
      setLoading(true);
      await updateMainInstructor(inst.courseInstanceId, inst.userId, { isMainInstructor: !inst.isMainInstructor });
      await refreshData();
      toast.success(`✅ ${inst.instructorName} is now ${!inst.isMainInstructor ? "Main Instructor" : "Unset as Main"}`);
    } catch (err) {
      console.error(err);
      const errorMsg = err?.response?.data?.message || "Failed to update instructor!";
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRemove = async () => {
    if (!confirmModal.user) return;

    setLoading(true);
    try {
      if (confirmModal.type === "student") {
        await deleteCourseStudent(confirmModal.user.userId, id, confirmModal.user.courseStudentId);
        toast.success(`✅ ${confirmModal.user.studentName} has been removed!`);
      } else {
        // Chỉ truyền courseInstructorId
        await deleteCourseInstructor(confirmModal.user.courseInstructorId);
        toast.success(`✅ ${confirmModal.user.instructorName} has been removed!`);
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
    if (!file) {
      toast.error("❌ Please choose a file first!");
      return;
    }
    try {
      setLoading(true);
      await importStudentsFromExcel(id, file, changedByUserId);
      toast.success("✅ Import successful!");
      setFile(null);
      await refreshData();
    } catch (err) {
      console.error(err);
      const errorMsg = err?.response?.data?.message || "Import failed due to invalid data!";
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users by role
  const fetchUsersByRole = async (role) => {
    try {
      const res = await getUsersByRole(role);
      return Array.isArray(res?.data) ? res.data : [];
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load users!");
      return [];
    }
  };

  // Handle Add Student
  const handleAddStudent = async () => {
    if (!newStudent.userId && !newStudent.studentCode) {
      return toast.error("❌ Please select a student or enter student code!");
    }
    try {
      setLoading(true);
      await createCourseStudent({
        courseInstanceId: id,
        userId: newStudent.userId ? parseInt(newStudent.userId) : 0, // nếu nhập code, userId = 0
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

  // Handle Add Instructor
  const handleAddInstructor = async () => {
    if (!newInstructor.userId) return toast.error("❌ Please select an instructor!");
    try {
      setLoading(true);
      await createCourseInstructor({
        courseInstanceId: id,
        userId: parseInt(newInstructor.userId),
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

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (!classInfo) return <p className="p-6 text-gray-500">Class not found</p>;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button onClick={() => navigate("/admin/classes")} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-orange-500">📘 Class Detail</h2>

      {/* Class Info */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-2">
        <p><span className="font-semibold">Class Name:</span> {classInfo.className || classInfo.sectionCode}</p>
        <p><span className="font-semibold">Course:</span> {classInfo.courseName}</p>
        <p><span className="font-semibold">Major:</span> {classInfo.majorName}</p>
        <p><span className="font-semibold">Semester:</span> {classInfo.semesterName}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button onClick={openAddStudentModal} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Add Student</button>
        <button onClick={openAddInstructorModal} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Instructor</button>
      </div>

      {/* Students Table */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">👥 Class Members</h3>
          <div className="space-x-2">
            <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files[0])} />
            <button
              onClick={handleImportFile}
              className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
              disabled={loading}
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
            {(!users || users.length === 0) ? (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">No users found in this class</td></tr>
            ) : users.map((u) => (
              <tr key={u.courseStudentId || u.userId} className="border-b hover:bg-gray-50">
                <td className="p-2">{u.studentName}</td>
                <td className="p-2">{u.studentCode}</td>
                <td className="p-2">{u.studentEmail}</td>
                <td className="p-2">{u.roleName || "Student"}</td>
                <td className={`p-2 font-medium ${u.status === "Active" ? "text-green-600" : "text-red-500"}`}>{u.status || "Active"}</td>
                <td className="p-2">
                  <button onClick={() => setConfirmModal({ show: true, user: u, type: "student" })} className="text-red-500 hover:underline" disabled={loading}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Instructors Table */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
        <h3 className="text-lg font-semibold">👨‍🏫 Instructors</h3>
        <table className="w-full text-sm border">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-center">Main Instructor</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!instructors || instructors.length === 0) ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">No instructors found</td></tr>
            ) : instructors.map((inst) => (
              <tr key={inst.userId} className="border-b hover:bg-gray-50">
                <td className="p-2">{inst.instructorName}</td>
                <td className="p-2">{inst.instructorEmail}</td>
                <td className="p-2 text-center">{inst.isMainInstructor ? <span className="text-green-600 font-bold">✔</span> : <span className="text-red-500 font-bold">✖</span>}</td>
                <td className="p-2 text-center space-x-2">
                  <button onClick={() => handleToggleMainInstructor(inst)} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs" disabled={loading}>
                    {inst.isMainInstructor ? "Unset Main" : "Set Main"}
                  </button>
                  <button onClick={() => setConfirmModal({ show: true, user: inst, type: "instructor" })} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs" disabled={loading}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Assignments */}
      <div className="flex justify-end">
        <button onClick={() => navigate(`/admin/classes/${id}/assignments`)} className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" disabled={loading}>
          📄 View Assignments
        </button>
      </div>

      {/* Confirm Remove Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg text-center space-y-4">
            <h3 className="text-lg font-bold text-red-600">⚠ Confirm Removal</h3>
            <p>Are you sure you want to remove <strong>{confirmModal.user.studentName || confirmModal.user.instructorName}</strong>?</p>
            <div className="flex justify-center space-x-4 pt-2">
              <button onClick={() => setConfirmModal({ show: false, user: null, type: "student" })} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" disabled={loading}>Cancel</button>
              <button onClick={handleConfirmRemove} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" disabled={loading}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {addStudentModal.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg text-center space-y-4">
            <h3 className="text-lg font-bold text-green-600">➕ Add Student</h3>
            <div className="space-y-2">
              <select value={newStudent.userId} onChange={(e) => setNewStudent({ ...newStudent, userId: e.target.value })} className="w-full p-2 border rounded">
                <option value="">Select Student</option>
                {studentList.map((s) => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName} - {s.email}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Student Code"
                value={newStudent.studentCode}
                onChange={(e) => setNewStudent({ ...newStudent, studentCode: e.target.value.trim(), userId: "" })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-center space-x-4 pt-2">
              <button onClick={() => setAddStudentModal
                ({ show: false })} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" disabled={loading}>Cancel</button>
              <button onClick={handleAddStudent} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" disabled={loading}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Instructor Modal */}
      {addInstructorModal.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg text-center space-y-4">
            <h3 className="text-lg font-bold text-blue-600">➕ Add Instructor</h3>
            <div className="space-y-2">
              <select value={newInstructor.userId} onChange={(e) => setNewInstructor({ ...newInstructor, userId: e.target.value })} className="w-full p-2 border rounded">
                <option value="">Select Instructor</option>
                {instructorList.map((i) => (
                  <option key={i.id} value={i.id}>{i.firstName} {i.lastName} - {i.email}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-center space-x-4 pt-2">
              <button onClick={() => setAddInstructorModal({ show: false })} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" disabled={loading}>Cancel</button>
              <button onClick={handleAddInstructor} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={loading}>Add</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
