import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, User2, School, Calendar, BadgeCheck, BookOpen, Edit } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  getUserByIdDetail,
  deactivateUser,
  activateUser,
  updateUser,
  getAllCampuses,
  getAllMajors,
} from "../../service/adminService";

export default function AdminUserDetailsManagement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [campuses, setCampuses] = useState([]);
  const [majors, setMajors] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    campusId: 0,
    majorId: 0,
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    studentCode: "",
    avatarUrl: "",
  });
  const isStudent = user?.roles?.includes("STUDENT");
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

  const loadData = async () => {
    if (!id) return;
    try {
      const userRes = await getUserByIdDetail(id);
      const data = userRes?.data;
      setUser(data);
      setForm({
        campusId: data?.campusId ?? 0,
        majorId: data?.majorId ?? 0,
        username: data?.username ?? "",
        email: data?.email ?? "",
        firstName: data?.firstName ?? "",
        lastName: data?.lastName ?? "",
        studentCode: data?.studentCode ?? "",
        avatarUrl: data?.avatarUrl ?? "",
      });
    } catch (err) {
      console.error("Failed to load user detail:", err);
      toast.error("Failed to load user details.", { duration: 5000 });
    }
  };

  const loadCampusesAndMajors = async () => {
    try {
      const campusesRes = await getAllCampuses();
      setCampuses(campusesRes?.data || []);
      const majorsRes = await getAllMajors();
      setMajors(majorsRes?.data || []);
    } catch (err) {
      console.error("Failed to load campuses or majors", err);
      toast.error("Failed to load campuses or majors.", { duration: 5000 });
    }
  };

  useEffect(() => {
    loadData();
    loadCampusesAndMajors();
  }, [id]);

  if (!user || campuses.length === 0 || majors.length === 0) {
    return <div className="p-8 text-center text-gray-500">Loading user details...</div>;
  }

  const handleToggleStatus = async () => {
    try {
      if (user.isActive) await deactivateUser(id);
      else await activateUser(id);
      toast.success(`User ${user.isActive ? "deactivated" : "activated"} successfully!`, {
        duration: 4000,
        style: { background: "#f0fdf4", color: "#166534", fontWeight: "bold" },
      });
      await loadData();
    } catch (err) {
      console.error("Toggle status error:", err.response?.data || err);
      let msg = "Failed to toggle status!";
      if (err.response?.data?.message) msg = err.response.data.message;
      toast.error(msg, {
        duration: 6000,
        style: { background: "#fef2f2", color: "#b91c1c", fontWeight: "bold" },
      });
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: user.id,
        campusId: form.campusId || null,
        majorId: isStudent ? form.majorId : null,
        username: form.username,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        studentCode: form.studentCode,
        avatarUrl: form.avatarUrl,
        isActive: user.isActive,
      };

      await updateUser(user.id, payload);

      toast.success("User updated successfully!", {
        duration: 4000,
        style: { background: "#f0fdf4", color: "#166534", fontWeight: "bold" },
      });

      setEditing(false);
      await loadData();
    } catch (err) {
      console.error("Update error:", err.response?.data || err);
      let errorMessage = "Failed to update user!";
      if (err.response?.status === 400) errorMessage = "Invalid data provided. Please check the input fields.";
      else if (err.response?.data?.message) errorMessage = err.response.data.message;

      toast.error(errorMessage, {
        duration: 6000,
        style: { background: "#fef2f2", color: "#b91c1c", fontWeight: "bold" },
      });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <button
        onClick={() =>
          openConfirm({
            title: "Leave page?",
            message: "Unsaved changes will be lost. Are you sure you want to go back?",
            onConfirm: () => navigate(-1),
          })
        }
        className="flex items-center gap-2 text-orange-600 hover:text-orange-800 mb-6"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h2 className="text-4xl font-bold text-orange-600 mb-4 flex items-center gap-2">
        User Details
        <Edit
          size={24}
          className="cursor-pointer"
          onClick={() =>
            openConfirm({
              title: "Edit user?",
              message: "Are you sure you want to edit this user information?",
              onConfirm: () => setEditing(true),
            })
          }
        />
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center text-center">
            <img
              src={user.avatarUrl}
              className="w-36 h-36 rounded-full object-cover mb-4 border shadow"
              alt="avatar"
            />
            <h3 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h3>
            <p className="text-gray-500 mt-1">{user.username}</p>

            <div className="mt-3">
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${user.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <button
              onClick={() =>
                openConfirm({
                  title: user.isActive ? "Deactivate user?" : "Activate user?",
                  message: `Are you sure you want to ${user.isActive ? "deactivate" : "activate"} this user?`,
                  onConfirm: handleToggleStatus,
                })
              }
              className={`mt-5 w-full py-2 rounded-xl text-white font-semibold shadow ${user.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                }`}
            >
              {user.isActive ? "Deactivate User" : "Activate User"}
            </button>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h4 className="text-xl font-bold text-orange-600 mb-3">Roles</h4>
            <div className="flex flex-wrap gap-2">
              {user.roles?.map((r, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-bold text-orange-600 mb-6">Basic Information</h3>

            {editing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  openConfirm({
                    title: "Save changes?",
                    message: "Are you sure you want to save these changes?",
                    onConfirm: () => handleUpdateSubmit(e),
                  });
                }}
              >
                {/* Campus & Major */}
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Campus</label>
                  <select
                    value={form.campusId}
                    onChange={(e) => setForm({ ...form, campusId: Number(e.target.value) })}
                    className="w-full border rounded-lg p-2 text-gray-800 bg-white"
                  >
                    <option value={0}>Select Campus</option>
                    {campuses.map((c) => (
                      <option key={c.campusId} value={c.campusId}>{c.campusName}</option>
                    ))}
                  </select>
                </div>

                {isStudent && (
                  <div>
                    <label className="block text-gray-500 text-sm mb-1">
                      Major <span className="text-gray-400">(Required)</span>
                    </label>

                    <select
                      value={form.majorId ?? ""}
                      required
                      onChange={(e) =>
                        setForm({
                          ...form,
                          majorId: Number(e.target.value),
                        })
                      }
                      className="w-full border rounded-lg p-2 text-gray-800 bg-white"
                    >
                      <option value="">Select Major</option>

                      {majors.map((m) => (
                        <option key={m.majorId} value={m.majorId}>
                          {m.majorName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Other fields */}
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Username</label>
                  <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full border rounded-lg p-2" required />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg p-2" required />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">First Name</label>
                  <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full border rounded-lg p-2" required />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Last Name</label>
                  <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full border rounded-lg p-2" required />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">User Code</label>
                  <input type="text" value={form.studentCode} onChange={(e) => setForm({ ...form, studentCode: e.target.value })} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Avatar URL</label>
                  <input type="text" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} className="w-full border rounded-lg p-2" />
                </div>

                <div className="col-span-2 flex justify-end gap-4 mt-4">
                  <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700">Save</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard icon={<School />} label="Campus" value={campuses.find(c => c.campusId === user.campusId)?.campusName || "N/A"} />
                <InfoCard icon={<BookOpen />} label="Major" value={majors.find(m => m.majorId === user.majorId)?.majorName || "N/A"} />
                <InfoCard icon={<Mail />} label="Email" value={user.email} />
                <InfoCard icon={<User2 />} label="Username" value={user.username} />
                <InfoCard icon={<BadgeCheck />} label="User Code" value={user.studentCode} />
                <InfoCard icon={<Calendar />} label="Created At" value={new Date(user.createdAt).toLocaleString()} />
              </div>
            )}
          </div>

          {/* Enrolled Courses */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-bold text-orange-600 mb-4">Enrolled Courses</h3>
            {user.enrolledCourses?.length === 0 ? (
              <p className="text-gray-500">No enrolled courses.</p>
            ) : (
              <div className="grid gap-4">
                {user.enrolledCourses.map(course => (
                  <div key={course.courseInstanceId} className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition">
                    <p><strong>Course Name:</strong> {course.courseName}</p>
                    <p><strong>Status:</strong> {course.status}</p>
                    <p><strong>Final Grade:</strong> {course.finalGrade}</p>
                    <p><strong>Passed:</strong> <span className={course.isPassed ? "text-green-600" : "text-red-600"}>{course.isPassed ? "Yes" : "No"}</span></p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Taught Courses */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-bold text-orange-600 mb-4">Taught Courses</h3>
            {user.taughtCourses?.length === 0 ? (
              <p className="text-gray-500">No taught courses.</p>
            ) : (
              <div className="grid gap-4">
                {user.taughtCourses.map(course => (
                  <div key={course.courseInstanceId} className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition">
                    <p><strong>Course Name:</strong> {course.courseName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submissions History */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-bold text-orange-600 mb-4">Submissions History</h3>
            {user.submissionsHistory?.length === 0 ? (
              <p className="text-gray-500">No submissions history.</p>
            ) : (
              <div className="grid gap-4">
                {user.submissionsHistory.map(sub => (
                  <div key={sub.assignmentId} className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition">
                    <p><strong>Assignment:</strong> {sub.assignmentTitle}</p>
                    <p><strong>Course:</strong> {sub.courseName}</p>
                    <p><strong>Semester:</strong> {sub.semesterName}</p>
                    <p><strong>Submitted At:</strong> {new Date(sub.submittedAt).toLocaleString()}</p>
                    <p><strong>Status:</strong> {sub.status}</p>
                    <p><strong>Final Score:</strong> {sub.finalScore}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        open={confirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
}

function InfoCard({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3 p-4 border rounded-xl bg-gray-50">
      <div className="text-orange-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Modal */}
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
