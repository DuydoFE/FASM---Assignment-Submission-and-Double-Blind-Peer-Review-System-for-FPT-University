import React, { useState } from "react";
import * as XLSX from "xlsx";
import { getUsersByCampus } from "../../service/adminService";

export default function AdminUserManagement() {
  // ✅ Không còn mock data nữa
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    role: "",
    campus: "",
    status: "",
    search: "",
  });

  const [selectedUser, setSelectedUser] = useState(null);

  const isFiltering =
    filters.role || filters.campus || filters.status || filters.search;

  // ✅ Khi chọn Campus → gọi API thật
  const handleCampusChange = async (e) => {
    const campusId = e.target.value;
    setFilters({ ...filters, campus: campusId });

    if (!campusId) {
      setUsers([]);
      return;
    }

    try {
      const res = await getUsersByCampus(campusId);

      if (!res?.data) {
        setUsers([]);
        return;
      }

      const formattedUsers = res.data.map((u) => ({
        id: u.id,
        fullName:
          u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        email: u.email || "-",

        // ✅ Nếu roles là mảng [{roleName: ...}] hoặc ["Admin"]
        roleName: Array.isArray(u.roles)
          ? u.roles
            .map((r) =>
              typeof r === "object"
                ? r.roleName || r.name || "-"
                : r.toString()
            )
            .join(", ")
          : u.roleName || u.role || "-",

        // ✅ Nếu campus chỉ là id → map tay thành tên
        campusName:
          u.campus?.campusName ||
          (u.campusId === 1
            ? "Hồ Chí Minh"
            : u.campusId === 2
              ? "Hà Nội"
              : `Campus ${u.campusId || "-"}`),

        isActive:
          typeof u.isActive === "boolean"
            ? u.isActive
            : u.status?.toLowerCase() === "active",
      }));

      console.log("✅ Formatted users:", formattedUsers);
      console.log("📋 Raw users from API:", res.data);

      setUsers(formattedUsers);
    } catch (error) {
      console.error("❌ Failed to fetch users:", error);
      setUsers([]);
    }
  };


  // ✅ Áp dụng filter như cũ
  const filteredUsers = isFiltering
    ? users.filter((u) => {
      return (
        (filters.role
          ? u.roleName?.toLowerCase().includes(filters.role.toLowerCase())
          : true) &&
        (filters.status
          ? u.isActive === (filters.status === "active")
          : true) &&
        (filters.search
          ? (u.fullName &&
            u.fullName
              .toLowerCase()
              .includes(filters.search.toLowerCase())) ||
          (u.email &&
            u.email.toLowerCase().includes(filters.search.toLowerCase())) ||
          (u.studentId &&
            u.studentId
              .toLowerCase()
              .includes(filters.search.toLowerCase()))
          : true)
      );
    })
    : users;

  // 👉 Hàm xử lý import file (giữ nguyên)
  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      const importedUsers = worksheet.map((row, index) => ({
        id: Date.now() + index,
        name: row.name || "",
        roleName: row.role?.toLowerCase() || "student",
        email: row.email || "",
        campusName: row.campus || "",
        isActive: row.status?.toLowerCase() === "active",
        studentId: row.studentId || "",
        major: row.major || "",
      }));
      setUsers((prev) => [...prev, ...importedUsers]);
      alert(`✅ Imported ${importedUsers.length} users successfully`);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">👥 User Management</h2>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center">
        <select
          className="border rounded p-2"
          value={filters.campus}
          onChange={handleCampusChange}
        >
          <option value="">Select Campus</option>
          <option value="1">Hồ Chí Minh</option>
          <option value="2">Hà Nội</option>
        </select>

        {filters.campus && (
          <>
            <select
              className="border rounded p-2"
              value={filters.role}
              onChange={(e) =>
                setFilters({ ...filters, role: e.target.value })
              }
            >
              <option value="">Role</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>

            <select
              className="border rounded p-2"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
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
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </>
        )}

        {/* ✅ Nút Import file */}
        <label className="ml-auto px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 cursor-pointer">
          📁 Import Users
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleImportFile}
            className="hidden"
          />
        </label>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        {users.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Role</th>
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
                    <td className="p-2">
                      {u.fullName || `${u.firstName} ${u.lastName}`}
                    </td>
                    <td className="p-2 capitalize">{u.roleName}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.campusName}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${u.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {u.isActive ? "active" : "deactive"}
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
            Please select a campus to view users
          </p>
        )}
      </div>

      {/* Modal Edit giữ nguyên */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">Edit User</h3>
            <input
              type="text"
              className="border rounded w-full p-2"
              value={selectedUser.fullName}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, fullName: e.target.value })
              }
            />
            <select
              className="border rounded w-full p-2"
              value={selectedUser.isActive ? "active" : "deactive"}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  isActive: e.target.value === "active",
                })
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
