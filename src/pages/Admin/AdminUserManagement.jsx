import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  getUsersByCampus,
  updateUser,
  createUser,
  activateUser,
  deactivateUser,
  getMajorById,
  getAllCampuses
} from "../../service/adminService";

export default function AdminUserManagement() {
  const [campuses, setCampuses] = useState([]); // 🟢 THÊM DÒNG NÀY
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
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Load users theo campus (hiển thị tên ngành từ majorId)
  const handleCampusChange = async (e) => {
    const campusId = e.target.value;
    setFilters({ campus: campusId, major: "", search: "" });

    if (!campusId) {
      setUsers([]);
      setMajors([]);
      return;
    }

    try {
      setIsLoading(true);

      // 🟢 Gọi API lấy danh sách user theo campus
      const data = await getUsersByCampus(campusId);
      const usersArray = Array.isArray(data) ? data : data.data || [];

      // 🧠 Cache để tránh gọi trùng majorId
      const majorCache = {};

      // 🟢 Dùng Promise.all để xử lý song song và gắn majorName cho từng user
      const formattedUsers = await Promise.all(
        usersArray.map(async (u) => {
          let majorName = "Không xác định";

          if (u.majorId && u.majorId !== 0) {
            if (!majorCache[u.majorId]) {
              try {
                const res = await getMajorById(u.majorId);
                majorCache[u.majorId] =
                  res.majorName || res.data?.majorName || "Không rõ";
              } catch (err) {
                console.error(`⚠️ Lỗi lấy majorName cho ID ${u.majorId}:`, err);
                majorCache[u.majorId] = "Không xác định";
              }
            }
            majorName = majorCache[u.majorId];
          }

          return {
            id: u.id || u.userId,
            studentCode: u.studentCode || "-",
            fullName:
              u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
            email: u.email || "-",
            roleName: Array.isArray(u.roles)
              ? u.roles.join(", ")
              : u.roleName || u.role || "-",
            campusName:
              u.campus?.campusName ||
              (u.campusId === 1 ? "Hồ Chí Minh" : "Hà Nội"),
            campusId: u.campusId || 0,
            majorId: u.majorId || 0,
            majorName, // ✅ Gắn tên ngành vào đây
            isActive:
              typeof u.isActive === "boolean"
                ? u.isActive
                : u.status?.toLowerCase() === "active",
          };
        })
      );

      setUsers(formattedUsers);

      // 🟢 Danh sách majorName duy nhất để filter dropdown
      const majorsSet = [
        ...new Set(formattedUsers.map((u) => u.majorName).filter(Boolean)),
      ];
      setMajors(majorsSet);

      console.log("👥 formattedUsers sample:", formattedUsers.slice(0, 3));
    } catch (error) {
      console.error("❌ Fetch users failed:", error);
      alert("❌ Không thể tải danh sách user.");
      setUsers([]);
      setMajors([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Lọc theo major + search
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

  useEffect(() => {
  const fetchCampuses = async () => {
    try {
      const res = await getAllCampuses();
      // Nếu API trả về danh sách campus dạng { id, campusName }
      const formatted = Array.isArray(res)
        ? res.map((c) => ({
            id: c.id || c.campusId,
            name: c.campusName || c.name,
          }))
        : [];
      setCampuses(formatted);
    } catch (err) {
      console.error("❌ Lỗi khi load campus:", err);
    }
  };

  fetchCampuses();
}, []);

  //test vớ vẩn
  useEffect(() => {
    fetch("https://localhost:7104/api/Users/4")
      .then(res => res.json())
      .then(data => console.log("📦 GET /Users/4 result:", data))
      .catch(err => console.error(err));
  }, []);


  // ✅ Import file Excel
  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
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
  const handleAddUser = async () => {
    if (!filters.campus) {
      alert("⚠️ Vui lòng chọn campus trước khi thêm user.");
      return;
    }

    const newUser = {
      fullName: "New User",
      email: "newuser@example.com",
      studentCode: "MSSV" + Math.floor(Math.random() * 99999),
      roleName: "student",
      campusId: Number(filters.campus),
      majorName: filters.major || "Chưa có chuyên ngành",
      isActive: true,
    };

    try {
      const res = await createUser(newUser);
      alert("✅ User created successfully!");
      // Reload lại danh sách
      handleCampusChange({ target: { value: filters.campus } });
    } catch (error) {
      console.error("❌ Create user failed:", error);
      alert("❌ Không thể tạo user mới.");
    }
  };

  // ✅ Bật/tắt tài khoản
  const toggleUserStatus = async (user) => {
    try {
      if (user.isActive) await deactivateUser(user.id);
      else await activateUser(user.id);
      alert(`🔁 ${user.isActive ? "Deactivated" : "Activated"} successfully`);
      // Cập nhật lại danh sách
      handleCampusChange({ target: { value: filters.campus } });
    } catch (err) {
      console.error("❌ Update status failed:", err);
      alert("❌ Không thể thay đổi trạng thái user.");
    }
  };

  const handleSaveUser = async () => {
    try {
      if (!selectedUser) {
        alert("No user selected.");
        return;
      }

      setIsUpdating(true);

      const userId = Number(selectedUser.id);
      const payload = {
        userId: userId, // 🔥 chữ thường, để khớp với backend
        username: selectedUser.username || selectedUser.email?.split("@")[0] || "",
        email: selectedUser.email || "",
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        avatarUrl: selectedUser.avatarUrl || "",
        studentCode: selectedUser.studentCode || "",
        roles: Array.isArray(selectedUser.roles)
          ? selectedUser.roles
          : [selectedUser.roleName || "Student"],
        campusId: selectedUser.campusId ?? 0,
        majorId: selectedUser.majorId ?? 0,
        isActive:
          typeof selectedUser.isActive === "boolean"
            ? selectedUser.isActive
            : true,
      };

      console.log("🟡 PUT URL:", `/Users/${userId}`);
      console.log("🟡 Payload gửi BE:", payload);

      await updateUser(userId, payload);

      alert("✅ User updated successfully!");
      setSelectedUser(null);
      handleCampusChange({ target: { value: filters.campus } });
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err);
      alert(`❌ Update failed: ${err.response?.data?.message || "Unknown error"}`);
    } finally {
      setIsUpdating(false);
    }
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

        {filters.campus && majors.length > 0 && (
          <select
            className="border rounded p-2"
            value={filters.major}
            onChange={(e) => setFilters({ ...filters, major: e.target.value })}
          >
            <option value="">All Majors</option>
            {majors.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}

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
        {isLoading ? (
          <p className="p-4 text-center text-gray-500">Loading...</p>
        ) : filters.campus ? (
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
            <p className="p-4 text-center text-gray-500">No users found</p>
          )
        ) : (
          <p className="p-4 text-center text-gray-500">
            Please select a campus to view users
          </p>
        )}
      </div>

      {/* Modal Edit */}
      {/* Modal Edit */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold text-orange-500">Edit User</h3>

            {/* 🧍‍♂️ First Name */}
            <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="First Name"
              value={selectedUser.firstName || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, firstName: e.target.value })
              }
            />

            {/* 🧍‍♀️ Last Name */}
            <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="Last Name"
              value={selectedUser.lastName || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, lastName: e.target.value })
              }
            />

            {/* 🎓 Student Code */}
            <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="Student Code"
              value={selectedUser.studentCode || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, studentCode: e.target.value })
              }
            />

            {/* 📧 Email */}
            <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="Email"
              value={selectedUser.email || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />

            {/* 🏫 Major */}
            <select
              className="border rounded w-full p-2"
              value={selectedUser.majorName || ""}
              onChange={(e) => {
                const selectedMajor = majors.find((m) => m === e.target.value);
                const foundMajor = users.find((u) => u.majorName === selectedMajor);
                setSelectedUser({
                  ...selectedUser,
                  majorName: e.target.value,
                  majorId: foundMajor?.majorId || 0,
                });
              }}
            >
              <option value="">Chọn chuyên ngành</option>
              {majors.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* 🏢 Campus */}
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
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* 🎭 Role */}
            <select
              className="border rounded w-full p-2"
              value={selectedUser.roles?.[0] || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  roles: [e.target.value],
                })
              }
            >
              <option value="">Chọn role</option>
              <option value="Student">Student</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Admin">Admin</option>
            </select>

            {/* ⚙️ Buttons */}
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
