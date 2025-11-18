import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getCourseInstanceById,
  getCourseStudentsByCourseInstance,
  getCourseInstructorsByCourseInstance,
  createCourseInstructor,
  updateMainInstructor,
  deleteCourseInstructor,
  createCourseStudent,
  deleteCourseStudent,
  importStudentsFromExcel,
} from "../../service/adminService";

export default function AdminClassDetailsManagement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classInfo, setClassInfo] = useState(null);
  const [users, setUsers] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    userId: "",
    studentCode: "",
    status: "Active",
    finalGrade: 0,
    isPassed: true,
  });

  const [showAddInstructor, setShowAddInstructor] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    userId: "",
    isMainInstructor: false,
  });

  const [file, setFile] = useState(null);
  const changedByUserId = 1;

  const fetchInstructors = async () => {
    try {
      const res = await getCourseInstructorsByCourseInstance(id);
      setInstructors(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error loading instructors:", err);
      toast.error("Failed to load instructors");
    }
  };

  const refreshData = async () => {
    try {
      const [studentRes, instructorRes] = await Promise.all([
        getCourseStudentsByCourseInstance(id),
        getCourseInstructorsByCourseInstance(id),
      ]);

      setUsers(Array.isArray(studentRes?.data) ? studentRes.data : []);
      setInstructors(Array.isArray(instructorRes?.data) ? instructorRes.data : []);
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

        const studentData = await getCourseStudentsByCourseInstance(id);
        setUsers(Array.isArray(studentData?.data) ? studentData.data : []);

        await fetchInstructors();
      } catch (err) {
        console.error("❌ Error loading class details:", err);
        toast.error("Failed to load class details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleAddUser = async () => {
    if (!newUser.userId || !newUser.studentCode)
      return toast.error("Please fill in all required fields");

    try {
      setLoading(true);
      const payload = {
        courseInstanceId: parseInt(id, 10),
        userId: parseInt(newUser.userId, 10),
        studentCode: newUser.studentCode,
        status: newUser.status,
        finalGrade: parseFloat(newUser.finalGrade),
        isPassed: newUser.isPassed,
        changedByUserId,
      };
      await createCourseStudent(payload);
      await refreshData();
      toast.success("Student added successfully!");

      setShowAddUser(false);
      setNewUser({ userId: "", studentCode: "", status: "Active", finalGrade: 0, isPassed: true });

    } catch (err) {
      console.error("❌ Error adding student:", err);
      toast.error("Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (u) => {
    if (!window.confirm(`Remove ${u.fullName || u.name}?`)) return;
    try {
      setLoading(true);
      await deleteCourseStudent(u.userId, id, u.courseStudentId);
      await refreshData();
      toast.success("Student removed successfully!");
    } catch (err) {
      console.error("❌ Error removing student:", err);
      toast.error("Failed to remove student");
    } finally {
      setLoading(false);
    }
  };

  const handleImportFile = async () => {
    if (!file) return toast.error("Please choose a file first!");
    try {
      setLoading(true);
      await importStudentsFromExcel(id, file, changedByUserId);
      await refreshData();
      toast.success("Import successful!");
      setFile(null);
      toast.success("✅ Import successful!");
    } catch (err) {
      console.error("❌ Error importing file:", err);
      toast.error("Import failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstructor = async () => {
    if (!newInstructor.userId) return toast.error("Please enter User ID");

    try {
      setLoading(true);
      await createCourseInstructor({
        courseInstanceId: parseInt(id, 10),
        userId: parseInt(newInstructor.userId, 10),
        isMainInstructor: newInstructor.isMainInstructor,
      });
      await refreshData();
      toast.success("Instructor added successfully!");
      setShowAddInstructor(false);
      setNewInstructor({ userId: "", isMainInstructor: false });
    } catch (err) {
      console.error("❌ Error adding instructor:", err);
      toast.error("Failed to add instructor");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMainInstructor = async (inst) => {
    try {
      setLoading(true);
      await updateMainInstructor(inst.courseInstanceId, inst.userId, {
        isMainInstructor: !inst.isMainInstructor,
      });
      await refreshData();
      toast.success("Updated instructor successfully!");
    } catch (err) {
      console.error("❌ Error updating instructor:", err);
      toast.error("Failed to update instructor");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveInstructor = async (inst) => {
    if (!window.confirm(`Remove ${inst.instructorName} from this class?`)) return;
    try {
      setLoading(true);
      await deleteCourseInstructor(inst.courseInstanceId, inst.userId);
      await refreshData();
      toast.success("Instructor removed successfully!");
    } catch (err) {
      console.error("❌ Error removing instructor:", err);
      toast.error("Failed to remove instructor");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (!classInfo) return <p className="p-6 text-gray-500">Class not found</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">📘 Class Detail</h2>

      {/* Thông tin lớp học */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-2">
        <p>
          <span className="font-semibold">Class Name:</span>{" "}
          {classInfo.className || classInfo.sectionCode}
        </p>
        <p>
          <span className="font-semibold">Course:</span> {classInfo.courseName}
        </p>
        <p>
          <span className="font-semibold">Major:</span> {classInfo.majorName}
        </p>
        <p>
          <span className="font-semibold">Semester:</span> {classInfo.semesterName}
        </p>
      </div>

      {/* Danh sách Student */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">👥 Class Members</h3>
          <div className="space-x-2">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              onClick={handleImportFile}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Import Excel
            </button>
            <button
              onClick={() => setShowAddUser(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              + Add Student
            </button>
            <button
              onClick={() => setShowAddInstructor(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add Instructor
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
              <th className="p-2 text-left">Major</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {!Array.isArray(users) || users.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No users found in this class
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.courseStudentId || u.userId}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-2">{u.studentName}</td>
                  <td className="p-2">{u.studentCode}</td>
                  <td className="p-2">{u.studentEmail}</td>
                  <td className="p-2">{u.roleName || "Student"}</td>
                  <td className="p-2">{u.majorName}</td>
                  <td
                    className={`p-2 font-medium ${u.status === "Active" ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    {u.status || "Active"}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleRemoveUser(u)}
                      className="text-red-500 hover:underline"
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

      {/* Danh sách Instructors */}
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
            {!Array.isArray(instructors) || instructors.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No instructors found
                </td>
              </tr>
            ) : (
              instructors.map((inst) => (
                <tr key={inst.userId} className="border-b hover:bg-gray-50">
                  <td className="p-2">{inst.instructorName}</td>
                  <td className="p-2">{inst.instructorEmail}</td>
                  <td className="p-2 text-center">
                    {inst.isMainInstructor ? (
                      <span className="text-green-600 font-bold">✔</span>
                    ) : (
                      <span className="text-red-500 font-bold">✖</span>
                    )}
                  </td>
                  <td className="p-2 text-center space-x-2">
                    <button
                      onClick={() => handleToggleMainInstructor(inst)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                    >
                      {inst.isMainInstructor ? "Unset Main" : "Set Main"}
                    </button>
                    <button
                      onClick={() => handleRemoveInstructor(inst)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
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

      {/* View Assignments */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate(`/admin/classes/${id}/assignments`)}
          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          📄 View Assignments
        </button>
      </div>

      {/* Modal Add Student */}
      {showAddUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">
            <h3 className="text-lg font-semibold text-center">➕ Add Student to Class</h3>

            <input
              type="number"
              placeholder="User ID"
              className="border rounded w-full p-2"
              value={newUser.userId}
              onChange={(e) => setNewUser({ ...newUser, userId: e.target.value })}
            />
            <input
              type="text"
              placeholder="Student Code"
              className="border rounded w-full p-2"
              value={newUser.studentCode}
              onChange={(e) =>
                setNewUser({ ...newUser, studentCode: e.target.value })
              }
            />
            <select
              className="border rounded w-full p-2"
              value={newUser.status}
              onChange={(e) =>
                setNewUser({ ...newUser, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <input
              type="number"
              placeholder="Final Grade"
              className="border rounded w-full p-2"
              value={newUser.finalGrade}
              onChange={(e) =>
                setNewUser({ ...newUser, finalGrade: e.target.value })
              }
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newUser.isPassed}
                onChange={(e) =>
                  setNewUser({ ...newUser, isPassed: e.target.checked })
                }
              />
              <label className="text-sm text-gray-700">Passed</label>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Instructor */}
      {showAddInstructor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">
            <h3 className="text-lg font-semibold text-center">➕ Add Instructor to Class</h3>

            <input
              type="number"
              placeholder="User ID"
              className="border rounded w-full p-2"
              value={newInstructor.userId}
              onChange={(e) =>
                setNewInstructor({ ...newInstructor, userId: e.target.value })
              }
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newInstructor.isMainInstructor}
                onChange={(e) =>
                  setNewInstructor({ ...newInstructor, isMainInstructor: e.target.checked })
                }
              />
              <label className="text-sm text-gray-700">Main Instructor</label>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddInstructor(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInstructor}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
