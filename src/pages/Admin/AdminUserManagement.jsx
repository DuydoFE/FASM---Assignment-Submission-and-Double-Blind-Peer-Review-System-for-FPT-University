import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  getUsersByCampus,
  getAllUsers,
  updateUser,
  createUser,
  activateUser,
  deactivateUser,
  getMajorById,
  getAllCampuses,
  assignUserRoles,
} from "../../service/adminService";
import toast from "react-hot-toast";

export default function AdminUserManagement() {
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({ campus: "", major: "", search: "" });
  const [majors, setMajors] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    id: "",
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    campusId: "",
    majorId: "",
    studentCode: "",
    isActive: true,
    roles: [], // 👈 thêm dòng này
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Load campus danh sách
  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const res = await getAllCampuses();
        // 🧠 Đảm bảo dữ liệu luôn là mảng
        const data = Array.isArray(res) ? res : res.data || [];
        setCampuses(data);
      } catch (err) {
        console.error("Error fetching campuses:", err);
        setCampuses([]); // fallback an toàn
      }
    };
    fetchCampuses();
  }, []);

  // ✅ Load users khi chọn campus filter (dropdown phía trên)
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      if (selectedCampus) {
        const res = await getUsersByCampus(selectedCampus);
        const usersArray = Array.isArray(res) ? res : res.data || [];

        const majorCache = {};
        const formattedUsers = await Promise.all(
          usersArray.map(async (u) => {
            let majorName = "Không xác định";
            if (u.majorId && u.majorId !== 0) {
              if (!majorCache[u.majorId]) {
                try {
                  const res = await getMajorById(u.majorId);
                  majorCache[u.majorId] =
                    res.majorName || res.data?.majorName || "Không rõ";
                } catch {
                  majorCache[u.majorId] = "Không xác định";
                }
              }
              majorName = majorCache[u.majorId];
            }

            return {
              id: u.id || u.userId,
              studentCode: u.studentCode || "-",
              firstName: u.firstName || "",
              lastName: u.lastName || "",
              username: u.username || "",
              email: u.email || "-",
              roles: Array.isArray(u.roles)
                ? u.roles
                : [u.roleName || "Student"],
              campusId: u.campusId || 0,
              campusName:
                u.campus?.campusName ||
                (u.campusId === 1 ? "Hồ Chí Minh" : "Hà Nội"),
              majorId: u.majorId || 0,
              majorName,
              isActive:
                typeof u.isActive === "boolean"
                  ? u.isActive
                  : u.status?.toLowerCase() === "active",
            };
          })
        );

        setUsers(formattedUsers);
        const majorsSet = [
          ...new Set(formattedUsers.map((u) => u.majorName).filter(Boolean)),
        ];
        setMajors(majorsSet);
      } else {
        const res = await getAllUsers();
        setUsers(res);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedCampus]);

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
          u.firstName.toLowerCase().includes(keyword) ||
          u.lastName.toLowerCase().includes(keyword) ||
          u.email.toLowerCase().includes(keyword) ||
          u.studentCode.toLowerCase().includes(keyword)
      );
    }
    setFilteredUsers(result);
  }, [filters, users]);

  // ✅ Bật/tắt tài khoản
  const toggleUserStatus = async (user) => {
    try {
      if (user.isActive) await deactivateUser(user.id);
      else await activateUser(user.id);
      toast.success(
        `${user.isActive ? "Deactivated" : "Activated"} successfully!`
      );
      setSelectedCampus(selectedCampus); // reload user list
    } catch (err) {
      console.error("❌ Update status failed:", err);
      toast.error("Không thể thay đổi trạng thái user.");
    }
  };

  // ✅ Lưu user
  const handleSaveUser = async () => {
    if (!selectedUser) return;

    const userId = Number(selectedUser.id);
    const payload = {
      userId,
      username:
        selectedUser.username ||
        selectedUser.email?.split("@")[0] ||
        "unknown",
      email: selectedUser.email || "",
      firstName: selectedUser.firstName || "",
      lastName: selectedUser.lastName || "",
      studentCode: selectedUser.studentCode || "",
      avatarUrl: selectedUser.avatarUrl || "",
      campusId: selectedUser.campusId || 0,
      majorId: selectedUser.majorId || 0,
      isActive:
        typeof selectedUser.isActive === "boolean"
          ? selectedUser.isActive
          : true,
    };

    try {
      setIsUpdating(true);
      await updateUser(userId, payload);

      // 🧩 Update role riêng
      if (selectedUser.roles && selectedUser.roles.length > 0) {
        console.log("🛰 Sending role update:", {
          userId,
          roles: selectedUser.roles,
        });
        await assignUserRoles(userId, selectedUser.roles);
      }

      toast.success("✅ Cập nhật user thành công!");
      setSelectedUser(null);
      await fetchUsers(); // ✅ reload lại danh sách sau khi lưu thành công
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error("Cập nhật thất bại!");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">👥 User Management</h2>

      {/* 🔍 Bộ lọc Campus */}
      <div className="flex justify-between items-center mb-4">
        <select
          className="border p-2 rounded"
          value={selectedCampus}
          onChange={(e) => setSelectedCampus(e.target.value)}
        >
          <option value="">Tất cả campus</option>
          {campuses.map((c) => (
            <option key={c.campusId || c.id} value={c.campusId || c.id}>
              {c.campusName || c.name}
            </option>
          ))}
        </select>

        {selectedCampus && majors.length > 0 && (
          <select
            className="border p-2 rounded"
            value={filters.major}
            onChange={(e) => setFilters({ ...filters, major: e.target.value })}
          >
            <option value="">Tất cả chuyên ngành</option>
            {majors.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}

        {selectedCampus && (
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border p-2 rounded flex-1 ml-4"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
        )}
      </div>

      {/* 🧾 Bảng user */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        {isLoading ? (
          <p className="p-4 text-center text-gray-500">Loading...</p>
        ) : selectedCampus ? (
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
                    <td className="p-2">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="p-2">{u.studentCode}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2 capitalize">{u.roles.join(", ")}</td>
                    <td className="p-2">{u.campusName}</td>
                    <td className="p-2">{u.majorName || "Chưa có"}</td>
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
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="text-orange-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleUserStatus(u)}
                        className="text-blue-500 hover:underline"
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 text-center text-gray-500">Không có user nào</p>
          )
        ) : (
          <p className="p-4 text-center text-gray-500">
            Hãy chọn campus để xem user
          </p>
        )}
      </div>

      {/* 🧩 Modal Edit User */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold text-orange-500">Edit User</h3>

            <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="First Name"
              value={selectedUser.firstName || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, firstName: e.target.value })
              }
            />

            <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="Last Name"
              value={selectedUser.lastName || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, lastName: e.target.value })
              }
            />

            <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="Student Code"
              value={selectedUser.studentCode || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  studentCode: e.target.value,
                })
              }
            />

            <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="Email"
              value={selectedUser.email || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />

            {/* 🏫 Campus */}
            <select
              className="border rounded w-full p-2"
              value={selectedUser.campusId || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  campusId: parseInt(e.target.value),
                })
              }
            >
              <option value="">Chọn campus</option>
              {campuses.map((c) => (
                <option
                  key={c.campusId || c.id}
                  value={c.campusId || c.id}
                >
                  {c.campusName || c.name}
                </option>
              ))}
            </select>

            {/* 🎓 Major */}
            <select
              className="border rounded w-full p-2"
              value={selectedUser.majorId || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  majorId: parseInt(e.target.value),
                })
              }
            >
              <option value="">Chọn chuyên ngành</option>
              {majors.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>

            {/* 🧩 Role */}
            <select
              className="border rounded w-full p-2"
              value={selectedUser.roles?.[0] || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, roles: [e.target.value] })
              }
            >
              <option value="">Chọn role</option>
              <option value="Student">Student</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Admin">Admin</option>
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
