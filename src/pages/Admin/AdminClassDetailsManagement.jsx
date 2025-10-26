import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminClassDetailsManagement() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fake data cho demo (sau này thay bằng API thật)
  const fakeClasses = [
    {
      id: 1,
      name: "SE101 - Group A",
      course: "Software Engineering Fundamentals",
      major: "Software Engineering",
      semester: "Fall 2025",
    },
    {
      id: 2,
      name: "AI202 - Group B",
      course: "Introduction to Artificial Intelligence",
      major: "Artificial Intelligence",
      semester: "Spring 2025",
    },
  ];

  const [classInfo, setClassInfo] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyen Van A",
      studentId: "SE12345",
      email: "a@student.fpt.edu.vn",
      role: "Student",
      major: "Software Engineering",
      status: "Active",
    },
    {
      id: 2,
      name: "Tran Thi B",
      studentId: "SE00001",
      email: "b@fpt.edu.vn",
      role: "Instructor",
      major: "Software Engineering",
      status: "Active",
    },
    {
      id: 3,
      name: "Le Van C",
      studentId: "SE12346",
      email: "c@student.fpt.edu.vn",
      role: "Student",
      major: "Software Engineering",
      status: "Deactive",
    },
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    studentId: "",
    email: "",
    role: "Student",
    major: "",
    status: "Active",
  });

  // Load thông tin lớp học khi id thay đổi
  useEffect(() => {
    const found = fakeClasses.find((c) => c.id.toString() === id);
    if (found) setClassInfo(found);
  }, [id]);

  if (!classInfo) {
    return <p className="p-6 text-gray-500">Class not found</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">📘 Class Detail</h2>

      {/* Thông tin lớp học */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-2">
        <p>
          <span className="font-semibold">Class Name:</span> {classInfo.name}
        </p>
        <p>
          <span className="font-semibold">Course:</span> {classInfo.course}
        </p>
        <p>
          <span className="font-semibold">Major:</span> {classInfo.major}
        </p>
        <p>
          <span className="font-semibold">Semester:</span> {classInfo.semester}
        </p>
      </div>

      {/* Danh sách User */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">👥 Class Members</h3>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Import from File
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
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No users found in this class
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.studentId}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">{u.major}</td>
                  <td
                    className={`p-2 font-medium ${
                      u.status === "Active" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {u.status}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => setUsers(users.filter((usr) => usr.id !== u.id))}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">
            <h3 className="text-lg font-semibold">Add User</h3>

            <input
              type="text"
              placeholder="Full Name"
              className="border rounded w-full p-2"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Student ID"
              className="border rounded w-full p-2"
              value={newUser.studentId}
              onChange={(e) => setNewUser({ ...newUser, studentId: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded w-full p-2"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <select
              className="border rounded w-full p-2"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option>Student</option>
              <option>Instructor</option>
            </select>
            <input
              type="text"
              placeholder="Major"
              className="border rounded w-full p-2"
              value={newUser.major}
              onChange={(e) => setNewUser({ ...newUser, major: e.target.value })}
            />
            <select
              className="border rounded w-full p-2"
              value={newUser.status}
              onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
            >
              <option>Active</option>
              <option>Deactive</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setUsers([...users, { id: Date.now(), ...newUser }]);
                  setNewUser({
                    name: "",
                    studentId: "",
                    email: "",
                    role: "Student",
                    major: "",
                    status: "Active",
                  });
                  setShowAddUser(false);
                }}
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
