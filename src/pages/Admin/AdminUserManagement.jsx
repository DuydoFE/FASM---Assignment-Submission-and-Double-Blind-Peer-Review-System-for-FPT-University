import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Search } from "lucide-react";
import {
  getAllUsers,
  getAllCampuses,
  getAllMajors,
  importUsers,
} from "../../service/adminService";

export default function AdminUserManagement() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    campus: "",
    role: "",
    major: "",
    search: "",
  });

  const [users, setUsers] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [majors, setMajors] = useState([]);

  const roles = ["Student", "Instructor"];

  useEffect(() => {
    getAllUsers().then((res) => {
      setUsers(Array.isArray(res?.data) ? res.data : []);
    });

    getAllCampuses().then((res) => {
      setCampuses(Array.isArray(res?.data) ? res.data : []);
    });

    getAllMajors().then((res) => {
      setMajors(Array.isArray(res?.data) ? res.data : []);
    });
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const isAnyFilterSelected =
    filters.campus || filters.role || filters.major || filters.search;

  const filteredUsers = isAnyFilterSelected
    ? users
      .filter((u) => !u.roles?.includes("Admin"))
      .filter((u) => {
        return (
          (filters.campus ? u.campusName === filters.campus : true) &&
          (filters.role ? u.roles?.includes(filters.role) : true) &&
          (filters.major ? u.majorName === filters.major : true) &&
          (filters.search
            ? Object.values(u)
              .join(" ")
              .toLowerCase()
              .includes(filters.search.toLowerCase())
            : true)
        );
      })
    : [];

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-4xl font-bold text-orange-600">User Management</h2>

        <div className="flex gap-3">
          {/* Hidden file input */}
          <input
            type="file"
            id="excelInput"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("file", file);

              try {
                const res = await importUsers(formData);
                alert("Import users successfully!");
                const allUsers = await getAllUsers();
                setUsers(Array.isArray(allUsers?.data) ? allUsers.data : []);
              } catch (err) {
                console.error(err);
                alert("Failed to import users.");
              }
            }}
          />

          {/* Import button */}
          <button
            onClick={() => document.getElementById("excelInput").click()}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition"
          >
            Import Users
          </button>

          {/* Add user button */}
          <button
            onClick={() => navigate("/admin/users/add")}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition"
          >
            <Plus size={20} /> Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 shadow-lg rounded-xl grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <select
          name="campus"
          value={filters.campus}
          onChange={handleFilterChange}
          className="border border-orange-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 outline-none"
        >
          <option value="">Select Campus</option>
          {Array.isArray(campuses) &&
            campuses.map((c) => (
              <option key={c.id || c.campusId} value={c.name || c.campusName}>
                {c.name || c.campusName}
              </option>
            ))}
        </select>

        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="border border-orange-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 outline-none"
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          name="major"
          value={filters.major}
          onChange={handleFilterChange}
          className="border border-orange-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 outline-none"
        >
          <option value="">Select Major</option>
          {Array.isArray(majors) &&
            majors.map((m) => (
              <option key={m.majorId} value={m.majorName}>
                {m.majorName}
              </option>
            ))}
        </select>

        <div className="flex items-center border border-orange-300 rounded-lg overflow-hidden shadow-sm">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search users..."
            className="p-3 flex-1 outline-none"
          />
          <button className="px-4 bg-orange-100 border-l hover:bg-orange-200 transition">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-orange-100 text-orange-800 font-semibold">
            <tr>
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">User Code</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Campus</th>
              <th className="p-3 text-left">Major</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Detail</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-orange-50 transition-colors duration-150"
              >
                <td className="p-3 font-medium text-gray-800">{`${user.firstName} ${user.lastName}`}</td>
                <td className="p-3 text-gray-600">{user.studentCode}</td>
                <td className="p-3 text-gray-600">{user.email}</td>
                <td className="p-3 text-gray-600">{user.roles?.join(", ")}</td>
                <td className="p-3 text-gray-600">{user.campusName}</td>
                <td className="p-3 text-gray-600">{user.majorName}</td>
                <td
                  className={`p-3 font-semibold ${user.isActive ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </td>
                <td className="p-3 text-center">
                  <button
                    className="text-orange-600 hover:text-orange-800"
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {/* Khi chưa có user nào */}
            {filteredUsers.length === 0 && isAnyFilterSelected && (
              <tr>
                <td
                  colSpan={8}
                  className="p-4 text-center text-gray-500 font-medium"
                >
                  No users found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
