import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Search, Save } from "lucide-react";
import {
  getAllUsers,
  getAllCampuses,
  getAllMajors,
  importUsers,
  createUser,
} from "../../service/adminService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ===================== BASIC INPUT ===================== */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full p-3 rounded-xl border border-gray-300
        focus:border-orange-500 focus:ring-2 focus:ring-orange-200
        outline-none transition"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <select
        {...props}
        className="w-full p-3 rounded-xl border border-gray-300
        focus:border-orange-500 focus:ring-2 focus:ring-orange-200
        outline-none transition"
      >
        <option value={0}>Select {label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ===================== CONFIRM MODAL ===================== */
function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300
            text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-4 py-2 rounded-lg bg-orange-600 text-white
            hover:bg-orange-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== CREATE USER FORM ===================== */
function AdminCreateUserForm({ campuses, majors, onClose, onUserCreated }) {
  const [newUser, setNewUser] = useState({
    campusId: 0,
    majorId: null,
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    studentCode: "",
    avatarUrl: "",
    role: "",
    isActive: true,
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  const openConfirm = ({ title, message, onConfirm }) => {
    setConfirmConfig({ title, message, onConfirm });
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmConfig({ title: "", message: "", onConfirm: null });
  };

  const generateUsernameFromFirstName = (firstName) =>
    firstName?.trim().toLowerCase().replace(/\s+/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setNewUser({
        campusId: 0,
        majorId: null,
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        studentCode: "",
        avatarUrl: "",
        role: value,
        isActive: true,
      });
      return;
    }
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSave = async () => {
    const payload = {
      ...newUser,
      username:
        newUser.role === "Instructor"
          ? generateUsernameFromFirstName(newUser.firstName)
          : newUser.username,
    };

    try {
      const res = await createUser(payload);
      toast.success(res?.data?.message || "User created successfully");
      const allUsers = await getAllUsers();
      onUserCreated?.(Array.isArray(allUsers?.data) ? allUsers.data : []);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Create user failed");
    }
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Create New User
        </h1>
        <button
          onClick={onClose}
          className="ml-auto text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 border rounded-2xl p-6 max-w-md">
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">
            Step 1
          </h3>
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            Select User Role
          </h4>

          <select
            name="role"
            value={newUser.role}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-300
            focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          >
            <option value="">Choose role...</option>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
          </select>

          {!newUser.role && (
            <p className="text-sm text-gray-400 mt-3">
              Please select a role to continue
            </p>
          )}
        </div>

        {newUser.role && (
          <div className="bg-white border rounded-2xl p-8">
            <div className="border-l-4 border-orange-500 pl-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Step 2: User Information
              </h3>
              <p className="text-sm text-gray-500">
                Fill in user details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newUser.role === "Student" && (
                <>
                  <Input label="Username" name="username" value={newUser.username} onChange={handleChange} />
                  <Input label="Password" type="password" name="password" value={newUser.password} onChange={handleChange} />
                </>
              )}
              <Input label="Email" name="email" value={newUser.email} onChange={handleChange} />
              <Input label="First Name" name="firstName" value={newUser.firstName} onChange={handleChange} />
              <Input label="Last Name" name="lastName" value={newUser.lastName} onChange={handleChange} />
              <Input label="User Code" name="studentCode" value={newUser.studentCode} onChange={handleChange} />
              <Input label="Avatar URL" name="avatarUrl" value={newUser.avatarUrl} onChange={handleChange} />

              <Select
                label="Campus"
                name="campusId"
                value={newUser.campusId}
                onChange={handleChange}
                options={campuses.map((c) => ({
                  value: c.id || c.campusId,
                  label: c.name || c.campusName,
                }))}
              />

              {newUser.role === "Student" && (
                <Select
                  label="Major"
                  name="majorId"
                  value={newUser.majorId || 0}
                  onChange={handleChange}
                  options={majors.map((m) => ({
                    value: m.majorId,
                    label: m.majorName,
                  }))}
                />
              )}

              <Select
                label="Status"
                name="isActive"
                value={newUser.isActive}
                onChange={handleChange}
                options={[
                  { value: true, label: "Active" },
                  { value: false, label: "Inactive" },
                ]}
              />
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() =>
                  openConfirm({
                    title: "Create new user?",
                    message: "Are you sure you want to create this user?",
                    onConfirm: handleSave,
                  })
                }
                className="flex items-center gap-2 bg-orange-600 text-white
                px-8 py-3 rounded-xl font-semibold
                shadow-md shadow-orange-200
                hover:bg-orange-700 hover:-translate-y-0.5 transition-all"
              >
                <Save size={18} /> Create User
              </button>
            </div>
          </div>
        )}

        <ConfirmModal
          open={confirmOpen}
          title={confirmConfig.title}
          message={confirmConfig.message}
          onConfirm={confirmConfig.onConfirm}
          onCancel={closeConfirm}
        />
      </div>
    </div>
  );
}

/* ===================== MAIN PAGE ===================== */
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
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const roles = ["Student", "Instructor"];

  useEffect(() => {
    getAllUsers().then((res) => setUsers(Array.isArray(res?.data) ? res.data : []));
    getAllCampuses().then((res) => setCampuses(Array.isArray(res?.data) ? res.data : []));
    getAllMajors().then((res) => setMajors(Array.isArray(res?.data) ? res.data : []));
  }, []);

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

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
    <div className="p-8 bg-gray-50 min-h-screen">
      <ToastContainer />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900">
            User Management
          </h2>
          <p className="text-gray-500 mt-1">
            Manage students and instructors
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="file"
            id="excelInput"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              try {
                await importUsers(file);
                const allUsers = await getAllUsers();
                setUsers(Array.isArray(allUsers?.data) ? allUsers.data : []);
                toast.success("Users imported successfully");
              } catch {
                toast.error("Failed to import users");
              } finally {
                e.target.value = "";
              }
            }}
          />

          <button
            onClick={() => document.getElementById("excelInput").click()}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold
            shadow-md shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all"
          >
            Import Users
          </button>

          <button
            onClick={() => setShowCreateUserModal(true)}
            className="flex items-center gap-2 bg-orange-600 text-white
            px-6 py-3 rounded-xl font-semibold
            shadow-md shadow-orange-200 hover:bg-orange-700 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={20} /> Create User
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white border rounded-2xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
          Filters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <select name="campus" value={filters.campus} onChange={handleFilterChange} className="p-3 rounded-xl border border-gray-300">
            <option value="">Select Campus</option>
            {campuses.map((c) => (
              <option key={c.id || c.campusId} value={c.name || c.campusName}>
                {c.name || c.campusName}
              </option>
            ))}
          </select>

          <select name="role" value={filters.role} onChange={handleFilterChange} className="p-3 rounded-xl border border-gray-300">
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select name="major" value={filters.major} onChange={handleFilterChange} className="p-3 rounded-xl border border-gray-300">
            <option value="">Select Major</option>
            {majors.map((m) => (
              <option key={m.majorId} value={m.majorName}>{m.majorName}</option>
            ))}
          </select>

          <div className="flex items-center border rounded-xl overflow-hidden">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search users..."
              className="p-3 flex-1 outline-none"
            />
            <button className="px-4 bg-gray-100 hover:bg-gray-200 transition">
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      {isAnyFilterSelected && (
        <div className="bg-white border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#FFF3EB] text-[#F36F21] text-sm uppercase font-semibold border-b-2 border-[#F36F21]">
              <tr>
                <th className="p-4 text-left">Full Name</th>
                <th className="p-4 text-left">User Code</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Campus</th>
                <th className="p-4 text-left">Major</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Detail</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">
                    {`${user.firstName} ${user.lastName}`}
                  </td>
                  <td className="p-4 text-gray-600">{user.studentCode}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-lg text-xs font-medium">
                      {user.roles?.join(", ")}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{user.campusName}</td>
                  <td className="p-4 text-gray-600">{user.majorName}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                ${user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      className="text-orange-600 hover:text-orange-800"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateUserModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 z-10 overflow-y-auto max-h-[90vh]">
            <AdminCreateUserForm
              campuses={campuses}
              majors={majors}
              onClose={() => setShowCreateUserModal(false)}
              onUserCreated={(updatedUsers) => setUsers(updatedUsers)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
