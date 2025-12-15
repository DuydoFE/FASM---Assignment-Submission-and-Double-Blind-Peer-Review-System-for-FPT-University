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

/* ---------- Small UI Components ---------- */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <input
        {...props}
        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <select
        {...props}
        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
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
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Admin Create User Form ---------- */
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
  const [confirmConfig, setConfirmConfig] = useState({ title: "", message: "", onConfirm: null });

  const openConfirm = ({ title, message, onConfirm }) => {
    setConfirmConfig({ title, message, onConfirm });
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmConfig({ title: "", message: "", onConfirm: null });
  };

  const generateUsernameFromFirstName = (firstName) => firstName?.trim().toLowerCase().replace(/\s+/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setNewUser({ campusId: 0, majorId: null, username: "", password: "", email: "", firstName: "", lastName: "", studentCode: "", avatarUrl: "", role: value, isActive: true });
      return;
    }
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSave = async () => {
    const payload = {
      ...newUser,
      username: newUser.role === "Instructor" ? generateUsernameFromFirstName(newUser.firstName) : newUser.username,
    };

    try {
      await createUser(payload);
      const res = await createUser(payload);
      toast.success(res?.data?.message || "User created successfully");
      const allUsers = await getAllUsers();
      const updatedUsers = Array.isArray(allUsers?.data) ? allUsers.data : [];
      onUserCreated?.(updatedUsers);
      onClose();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Create user failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Create New User</h1>
        <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-700">X</button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6 max-w-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">1. Select User Role</h3>
          <select name="role" value={newUser.role} onChange={handleChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none">
            <option value="">Choose role...</option>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
          </select>
          {!newUser.role && <p className="text-sm text-gray-400 mt-3">Please select a role to continue</p>}
        </div>

        {newUser.role && (
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">2. User Information</h3>
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
              <Select label="Campus" name="campusId" value={newUser.campusId} onChange={handleChange} options={campuses.map((c) => ({ value: c.id || c.campusId, label: c.name || c.campusName }))} />
              {newUser.role === "Student" && <Select label="Major" name="majorId" value={newUser.majorId || 0} onChange={handleChange} options={majors.map((m) => ({ value: m.majorId, label: m.majorName }))} />}
              <Select label="Status" name="isActive" value={newUser.isActive} onChange={handleChange} options={[{ value: true, label: "Active" }, { value: false, label: "Inactive" }]} />
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => openConfirm({ title: "Create new user?", message: "Are you sure you want to create this user with the provided information?", onConfirm: handleSave })}
                disabled={!newUser.role}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl shadow-md disabled:opacity-50 transition"
              >
                <Save size={18} /> Save User
              </button>
            </div>
          </div>
        )}

        <ConfirmModal open={confirmOpen} title={confirmConfig.title} message={confirmConfig.message} onConfirm={confirmConfig.onConfirm} onCancel={closeConfirm} />
      </div>
    </div>
  );
}

/* ---------- Main Admin User Management Page ---------- */
export default function AdminUserManagement() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ campus: "", role: "", major: "", search: "" });
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

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const isAnyFilterSelected = filters.campus || filters.role || filters.major || filters.search;

  const filteredUsers = isAnyFilterSelected
    ? users
      .filter((u) => !u.roles?.includes("Admin"))
      .filter((u) => {
        return (
          (filters.campus ? u.campusName === filters.campus : true) &&
          (filters.role ? u.roles?.includes(filters.role) : true) &&
          (filters.major ? u.majorName === filters.major : true) &&
          (filters.search ? Object.values(u).join(" ").toLowerCase().includes(filters.search.toLowerCase()) : true)
        );
      })
    : [];

  return (
    <div className="p-8 bg-white min-h-screen">
      <ToastContainer />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-4xl font-bold text-orange-600">User Management</h2>
        <div className="flex gap-3">
          <input type="file" id="excelInput" accept=".xlsx, .xls" className="hidden" onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
              const beforeImportCount = users.length;
              await importUsers(file);
              const allUsers = await getAllUsers();
              const updatedUsers = Array.isArray(allUsers?.data) ? allUsers.data : [];
              setUsers(updatedUsers);
              const newUsersAdded = updatedUsers.length - beforeImportCount;
              const res = await importUsers(file);
              const message = res?.data?.message || `New users added: ${newUsersAdded}`;
              toast.success(message, { position: "top-right", autoClose: 4000 });
            } catch (err) {
              console.error(err);
              toast.error("Failed to import users.", { position: "top-right", autoClose: 4000 });
            } finally { e.target.value = ""; }
          }} />
          <button onClick={() => document.getElementById("excelInput").click()} className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition">Import Users</button>
          <button onClick={() => setShowCreateUserModal(true)} className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition"><Plus size={20} /> Add User</button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 shadow-lg rounded-xl grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <select name="campus" value={filters.campus} onChange={handleFilterChange} className="border border-orange-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 outline-none">
          <option value="">Select Campus</option>
          {campuses.map((c) => <option key={c.id || c.campusId} value={c.name || c.campusName}>{c.name || c.campusName}</option>)}
        </select>
        <select name="role" value={filters.role} onChange={handleFilterChange} className="border border-orange-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 outline-none">
          <option value="">Select Role</option>
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select name="major" value={filters.major} onChange={handleFilterChange} className="border border-orange-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 outline-none">
          <option value="">Select Major</option>
          {majors.map((m) => <option key={m.majorId} value={m.majorName}>{m.majorName}</option>)}
        </select>
        <div className="flex items-center border border-orange-300 rounded-lg overflow-hidden shadow-sm">
          <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search users..." className="p-3 flex-1 outline-none" />
          <button className="px-4 bg-orange-100 border-l hover:bg-orange-200 transition"><Search size={18} /></button>
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
              <tr key={user.id} className="border-b hover:bg-orange-50 transition-colors duration-150">
                <td className="p-3 font-medium text-gray-800">{`${user.firstName} ${user.lastName}`}</td>
                <td className="p-3 text-gray-600">{user.studentCode}</td>
                <td className="p-3 text-gray-600">{user.email}</td>
                <td className="p-3 text-gray-600">{user.roles?.join(", ")}</td>
                <td className="p-3 text-gray-600">{user.campusName}</td>
                <td className="p-3 text-gray-600">{user.majorName}</td>
                <td className={`p-3 font-semibold ${user.isActive ? "text-green-600" : "text-red-600"}`}>{user.isActive ? "Active" : "Inactive"}</td>
                <td className="p-3 text-center">
                  <button className="text-orange-600 hover:text-orange-800" onClick={() => navigate(`/admin/users/${user.id}`)}><Eye size={18} /></button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && isAnyFilterSelected && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500 font-medium">No users found for selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal Create User */}
        {showCreateUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateUserModal(false)}></div>
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
    </div>
  );
}
