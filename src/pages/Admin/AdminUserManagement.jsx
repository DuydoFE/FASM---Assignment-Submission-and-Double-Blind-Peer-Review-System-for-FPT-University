import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { getUsersByCampus, updateUser } from "../../service/adminService";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    campus: "",
    major: "",
    search: "",
  });
  const [majors, setMajors] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ Khi chọn campus → load user và danh sách major
  const handleCampusChange = async (e) => {
    const campusId = e.target.value;
    setFilters({ campus: campusId, major: "", search: "" });

    if (!campusId) {
      setUsers([]);
      setMajors([]);
      return;
    }

    try {
      const res = await getUsersByCampus(campusId);
      const formattedUsers = res.data.map((u) => ({
        id: u.id,
        studentCode: u.studentCode || "-",
        fullName:
          u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        email: u.email || "-",
        roleName: Array.isArray(u.roles)
          ? u.roles.map((r) => r.roleName || r.name || "-").join(", ")
          : u.roleName || u.role || "-",
        campusName:
          u.campus?.campusName ||
          (u.campusId === 1 ? "Hồ Chí Minh" : "Hà Nội"),
        campusId: u.campusId || 0,
        majorName: u.major?.majorName || "Chưa có chuyên ngành",
        majorId: u.majorId || null,
        isActive:
          typeof u.isActive === "boolean"
            ? u.isActive
            : u.status?.toLowerCase() === "active",
      }));

      setUsers(formattedUsers);

      // Lấy danh sách chuyên ngành
      const majorsSet = [
        ...new Set(formattedUsers.map((u) => u.majorName).filter(Boolean)),
      ];
      setMajors(majorsSet);
    } catch (error) {
      console.error("❌ Fetch users failed:", error);
      setUsers([]);
      setMajors([]);
    }
  };

  // ✅ Lọc user theo major và search
  useEffect(() => {
    let result = users;
    if (filters.major) {
      result = result.filter((u) => u.majorName === filters.major);
    }
    if (filters.search) {
      const keyword = filters.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.fullName.toLowerCase().includes(keyword) ||
          u.email.toLowerCase().includes(keyword) ||
          u.campusName.toLowerCase().includes(keyword) ||
          u.majorName.toLowerCase().includes(keyword) ||
          (u.studentCode && u.studentCode.toLowerCase().includes(keyword))
      );
    }
    setFilteredUsers(result);
  }, [filters, users]);

  // ✅ Import file Excel
  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.SheetNames[0];
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

      const importedUsers = rows.map((r, i) => ({
        id: Date.now() + i,
        studentCode: r.studentCode || "-",
        fullName: r.fullName || r.name || "",
        email: r.email || "-",
        roleName: r.role || "student",
        campusName: r.campus || "Không rõ",
        majorName: r.major || "Không rõ",
        isActive: r.status?.toLowerCase() === "active",
      }));

      setUsers((prev) => [...prev, ...importedUsers]);
      alert(`✅ Imported ${importedUsers.length} users successfully`);
    };
    reader.readAsArrayBuffer(file);
  };

  // ✅ Thêm user thủ công
  const handleAddUser = () => {
    const newUser = {
      id: Date.now(),
      studentCode: "MSSV" + Math.floor(Math.random() * 99999),
      fullName: "New User",
      email: "newuser@example.com",
      roleName: "student",
      campusName:
        filters.campus === "1"
          ? "Hồ Chí Minh"
          : filters.campus === "2"
          ? "Hà Nội"
          : "Unknown",
      majorName: filters.major || "Chưa có chuyên ngành",
      isActive: true,
    };
    setUsers((prev) => [...prev, newUser]);
  };

  // ✅ Lưu user sau khi chỉnh sửa
  const handleSaveUser = async () => {
    try {
      setIsUpdating(true);
      const payload = {
        userId: selectedUser.id,
        email: selectedUser.email,
        fullName: selectedUser.fullName,
        studentCode: selectedUser.studentCode,
        roleName: selectedUser.roleName,
        campusId: selectedUser.campusId,
        majorId: selectedUser.majorId,
        isActive: selectedUser.isActive,
      };
      await updateUser(selectedUser.id, payload);

      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, ...selectedUser } : u))
      );
      alert("✅ User updated successfully!");
      setSelectedUser(null);
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("❌ Update failed, check console for details.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">👥 User Management</h2>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center">
        {/* Campus filter */}
        <select
          className="border rounded p-2"
          value={filters.campus}
          onChange={handleCampusChange}
        >
          <option value="">Select Campus</option>
          <option value="1">Hồ Chí Minh</option>
          <option value="2">Hà Nội</option>
        </select>

        {/* Major filter */}
        {filters.campus && majors.length > 0 && (
          <select
            className="border rounded p-2"
            value={filters.major}
            onChange={(e) =>
              setFilters({ ...filters, major: e.target.value })
            }
          >
            <option value="">All Majors</option>
            {majors.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}

        {/* Search */}
        {filters.campus && (
          <input
            type="text"
            placeholder="Search by name, email, MSSV..."
            className="border rounded p-2 flex-1"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
        )}

        {/* Actions */}
        {filters.campus && (
          <div className="ml-auto flex gap-2">
            <label className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 cursor-pointer">
              📁 Import
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              ➕ Add User
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        {filters.campus ? (
          filteredUsers.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="p-2 text-left">Tên</th>
                  <th className="p-2 text-left">MSSV</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Campus</th>
                  <th className="p-2 text-left">Chuyên ngành</th>
                  <th className="p-2 text-left">Trạng thái</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{u.fullName}</td>
                    <td className="p-2">{u.studentCode}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2 capitalize">{u.roleName}</td>
                    <td className="p-2">{u.campusName}</td>
                    <td className="p-2">{u.majorName}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          u.isActive
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
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 text-center text-gray-500">No users found</p>
          )
        ) : (
          <p className="p-4 text-center text-gray-500">
            Please select a campus to view users
          </p>
        )}
      </div>

      {/* Modal Edit */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold text-orange-500">Edit User</h3>

            <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="Full Name"
              value={selectedUser.fullName}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, fullName: e.target.value })
              }
            />

            <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="Student Code"
              value={selectedUser.studentCode}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, studentCode: e.target.value })
              }
            />

            <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="Email"
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />

            <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="Major"
              value={selectedUser.majorName}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, majorName: e.target.value })
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

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
