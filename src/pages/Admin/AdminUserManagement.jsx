import React, { useState } from "react";

export default function AdminUserManagement() {
  // Mock data (later will be fetched from API)
  const [users] = useState([
    {
      id: 1,
      role: "student",
      name: "Nguyen Van A",
      studentId: "SE12345",
      major: "Software Engineering",
      campus: "Hanoi",
      status: "active",
      email: "a@student.fpt.edu.vn",
    },
    {
      id: 2,
      role: "instructor",
      name: "Tran Thi B",
      campus: "HCM",
      status: "active",
      email: "b@fpt.edu.vn",
    },
    {
      id: 3,
      role: "student",
      name: "Le Van C",
      studentId: "AI67890",
      major: "AI",
      campus: "Da Nang",
      status: "deactive",
      email: "c@student.fpt.edu.vn",
    },
  ]);

  const [filters, setFilters] = useState({
    role: "",
    campus: "",
    status: "",
    search: "",
  });

  const [selectedUser, setSelectedUser] = useState(null);

  // Check if any filter/search is applied
  const isFiltering =
    filters.role || filters.campus || filters.status || filters.search;

  // Apply filters
  const filteredUsers = isFiltering
    ? users.filter((u) => {
        return (
          (filters.role ? u.role === filters.role : true) &&
          (filters.campus ? u.campus === filters.campus : true) &&
          (filters.status ? u.status === filters.status : true) &&
          (filters.search
            ? u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
              (u.email &&
                u.email.toLowerCase().includes(filters.search.toLowerCase())) ||
              (u.studentId &&
                u.studentId
                  .toLowerCase()
                  .includes(filters.search.toLowerCase()))
            : true)
        );
      })
    : [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">👥 User Management</h2>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4">
        <select
          className="border rounded p-2"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">Role</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>

        <select
          className="border rounded p-2"
          value={filters.campus}
          onChange={(e) => setFilters({ ...filters, campus: e.target.value })}
        >
          <option value="">Campus</option>
          <option value="Hanoi">Hanoi</option>
          <option value="HCM">HCM</option>
          <option value="Da Nang">Da Nang</option>
        </select>

        <select
          className="border rounded p-2"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Status</option>
          <option value="active">Active</option>
          <option value="deactive">Deactive</option>
        </select>

        <input
          type="text"
          placeholder="Search by name, email, studentId..."
          className="border rounded p-2 flex-1"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        {isFiltering ? (
          <table className="w-full text-sm">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Student ID</th>
                <th className="p-2 text-left">Major</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Campus</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2 capitalize">{u.role}</td>
                    <td className="p-2">
                      {u.role === "student" ? u.studentId : "-"}
                    </td>
                    <td className="p-2">
                      {u.role === "student" ? u.major : "-"}
                    </td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.campus}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          u.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="text-orange-500 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-gray-500 text-center">
            Please apply filter or search to display users
          </p>
        )}
      </div>

      {/* Modal Edit */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">Edit User</h3>
            <input
              type="text"
              className="border rounded w-full p-2"
              value={selectedUser.name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, name: e.target.value })
              }
            />
            {selectedUser.role === "student" && (
              <>
                <input
                  type="text"
                  className="border rounded w-full p-2"
                  value={selectedUser.studentId}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      studentId: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  className="border rounded w-full p-2"
                  value={selectedUser.major}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      major: e.target.value,
                    })
                  }
                />
              </>
            )}
            <select
              className="border rounded w-full p-2"
              value={selectedUser.status}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="deactive">Deactive</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: call API update user
                  console.log("Update user:", selectedUser);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
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
