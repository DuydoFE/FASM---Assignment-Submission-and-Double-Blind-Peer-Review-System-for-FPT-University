import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getCourseInstanceById,
  getCourseStudentsByCourseInstance,
  createCourseStudent,
  deleteCourseStudent,
  importStudentsFromExcel,
} from "../../service/adminService";

export default function AdminClassDetailsManagement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classInfo, setClassInfo] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    userId: "",
    name: "",
    studentId: "",
    email: "",
  });

  const [file, setFile] = useState(null);
  const changedByUserId = 1; // ✅ tạm hardcode userId admin

  // 📌 Load thông tin lớp & danh sách user khi vào trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);


        const classData = await getCourseInstanceById(id);
        setClassInfo(classData?.data || classData);

        const studentData = await getCourseStudentsByCourseInstance(id);
        const userArray = Array.isArray(studentData?.data?.data)
          ? studentData.data.data
          : [];
        setUsers(userArray);
      } catch (err) {
        console.error("❌ Error loading class details:", err);
        toast.error("Failed to load class details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();


  }, [id]);

  // 📌 Thêm user vào lớp
  const handleAddUser = async () => {
    if (!newUser.userId) return toast.error("Please enter a valid user ID");
    try {
      setLoading(true);
      const payload = {
        userId: newUser.userId,
        courseInstanceId: id,
        changedByUserId,
      };
      await createCourseStudent(payload);


      const updated = await getCourseStudentsByCourseInstance(id);
      setUsers(Array.isArray(updated?.data?.data) ? updated.data.data : []);

      toast.success("✅ User added successfully!");
      setShowAddUser(false);
      setNewUser({ userId: "", name: "", studentId: "", email: "" });
    } catch (err) {
      console.error("❌ Error adding user:", err);
      toast.error("Failed to add user");
    } finally {
      setLoading(false);
    }


  };

  // 📌 Xoá user khỏi lớp
  const handleRemoveUser = async (u) => {
    if (!window.confirm(`Remove ${u.fullName || u.name}?`)) return;
    try {
      setLoading(true);
      await deleteCourseStudent(u.userId, id, u.courseStudentId);


      const updated = await getCourseStudentsByCourseInstance(id);
      setUsers(Array.isArray(updated?.data?.data) ? updated.data.data : []);
      toast.success("🗑️ User removed successfully!");
    } catch (err) {
      console.error("❌ Error removing user:", err);
      toast.error("Failed to remove user");
    } finally {
      setLoading(false);
    }


  };

  // 📌 Import file Excel
  const handleImportFile = async () => {
    if (!file) return toast.error("Please choose a file first!");
    try {
      setLoading(true);
      await importStudentsFromExcel(id, file, changedByUserId);


      const updated = await getCourseStudentsByCourseInstance(id);
      setUsers(Array.isArray(updated?.data?.data) ? updated.data.data : []);

      setFile(null);
      toast.success("✅ Import successful!");
    } catch (err) {
      console.error("❌ Error importing file:", err);
      toast.error("Import failed!");
    } finally {
      setLoading(false);
    }


  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (!classInfo) return <p className="p-6 text-gray-500">Class not found</p>;

  return (<div className="space-y-6"> <h2 className="text-2xl font-bold text-orange-500">📘 Class Detail</h2>

    ```
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
        <span className="font-semibold">Semester:</span>{" "}
        {classInfo.semesterName}
      </p>
    </div>

    {/* Danh sách User */}
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
            + Add User
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

    {/* View Assignments */}
    <div className="flex justify-end">
      <button
        onClick={() => navigate(`/admin/classes/${id}/assignments`)}
        className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        📄 View Assignments
      </button>
    </div>

    {/* Modal Add User */}
    {showAddUser && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">
          <h3 className="text-lg font-semibold">Add User</h3>
          <input
            type="text"
            placeholder="User ID"
            className="border rounded w-full p-2"
            value={newUser.userId}
            onChange={(e) =>
              setNewUser({ ...newUser, userId: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Full Name"
            className="border rounded w-full p-2"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Student ID"
            className="border rounded w-full p-2"
            value={newUser.studentId}
            onChange={(e) =>
              setNewUser({ ...newUser, studentId: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            className="border rounded w-full p-2"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
          />
          <div className="flex justify-end space-x-2">
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
  </div>
  );
}
