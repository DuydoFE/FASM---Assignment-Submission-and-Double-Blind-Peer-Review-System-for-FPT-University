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
  const isStudent = user?.roles?.includes("Student");
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
    <div className="p-8 bg-gradient-to-br from-orange-50 via-white to-orange-50 min-h-screen">
      <Toaster position="top-right" />

      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-8 transition-all hover:gap-3"
      >
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> Back
      </button>

      <div className="mb-8 animate-[slideDown_0.4s_ease-out]">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          User Details
          <Edit
            size={28}
            className="cursor-pointer text-gray-400 hover:text-orange-600 transition-all hover:scale-110 hover:rotate-12"
            onClick={() => setEditing(true)}
          />
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="col-span-1 space-y-6 animate-[slideRight_0.5s_ease-out]">
          <div className="group bg-white border-2 border-orange-100 shadow-lg rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-2xl hover:border-orange-200 transition-all duration-300 hover:-translate-y-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-orange-200 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img
                src={user.avatarUrl}
                className="relative w-40 h-40 rounded-full object-cover mb-4 border-4 border-orange-100 shadow-xl ring-4 ring-orange-50 group-hover:scale-105 transition-transform duration-300"
                alt="avatar"
              />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{user.firstName} {user.lastName}</h3>
            <p className="text-orange-600 font-medium mt-2">@{user.username}</p>

            <div className="mt-4 animate-pulse">
              <span
                className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-md ${user.isActive
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                  : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                  }`}
              >
                {user.isActive ? "● Active" : "○ Inactive"}
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
              className={`mt-6 w-full py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${user.isActive
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                }
`}
            >
              {user.isActive ? "🔒 Deactivate User" : "✅ Activate User"}
            </button>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 shadow-lg rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-[slideRight_0.6s_ease-out]">
            <h4 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
              <span className="text-2xl">🎭</span> Roles
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.roles?.map((r, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 rounded-full text-sm font-bold uppercase border-2 border-orange-200 hover:scale-105 transition-transform cursor-default shadow-sm"
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
          <div className="bg-white shadow-xl rounded-3xl p-8 border-2 border-orange-50 hover:shadow-2xl transition-all duration-300 hover:border-orange-100 animate-[slideLeft_0.5s_ease-out]">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <span className="text-3xl">📋</span> Basic Information
            </h3>

            {/* Khi editing = false, hiển thị info user */}
            {!editing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard icon={<School />} label="Campus" value={campuses.find(c => c.campusId === user.campusId)?.campusName || "N/A"} />
                <InfoCard icon={<BookOpen />} label="Major" value={majors.find(m => m.majorId === user.majorId)?.majorName || "N/A"} />
                <InfoCard icon={<Mail />} label="Email" value={user.email} />
                <InfoCard icon={<User2 />} label="Username" value={user.username} />
                <InfoCard icon={<BadgeCheck />} label="User Code" value={user.studentCode} />
                <InfoCard icon={<Calendar />} label="Created At" value={new Date(user.createdAt).toLocaleString()} />
              </div>
            ) : null}

            {/* Modal edit */}
            {editing && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => setEditing(false)}
                ></div>

                {/* Modal */}
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 z-10">
                  <h3 className="text-xl font-bold text-orange-600 mb-4">Edit User</h3>
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
                    {/* Campus */}
                    <div>
                      <label className="block text-gray-500 text-sm mb-1">Campus</label>
                      <select
                        value={form.campusId}
                        onChange={(e) => setForm({ ...form, campusId: Number(e.target.value) })}
                        className="w-full border rounded-lg p-2 text-gray-800 bg-white"
                      >
                        <option value={0}>Select Campus</option>
                        {campuses.map((c) => (
                          <option key={c.campusId} value={c.campusId}>
                            {c.campusName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Major (nếu student) */}
                    {isStudent && (
                      <div className="mt-2">
                        <label className="block text-gray-500 text-sm mb-1">
                          Major <span className="text-gray-400">(Required)</span>
                        </label>
                        <select
                          value={form.majorId}
                          onChange={(e) => setForm({ ...form, majorId: Number(e.target.value) })}
                          className="w-full border rounded-lg p-2 text-gray-800 bg-white"
                        >
                          <option value={0}>Select Major</option>
                          {majors.map((m) => (
                            <option key={m.majorId} value={m.majorId}>
                              {m.majorName}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Other fields */}
                    <div className="mt-2">
                      <label className="block text-gray-500 text-sm mb-1">Username</label>
                      <input
                        type="text"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="w-full p-3 border rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-gray-500 text-sm mb-1">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border rounded-lg p-2"
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-gray-500 text-sm mb-1">First Name</label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className="w-full border rounded-lg p-2"
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-gray-500 text-sm mb-1">Last Name</label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className="w-full border rounded-lg p-2"
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-gray-500 text-sm mb-1">User Code</label>
                      <input
                        type="text"
                        value={form.studentCode}
                        onChange={(e) => setForm({ ...form, studentCode: e.target.value })}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-gray-500 text-sm mb-1">Avatar URL</label>
                      <input
                        type="text"
                        value={form.avatarUrl}
                        onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-4">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={JSON.stringify(form) === JSON.stringify({
                          campusId: user.campusId ?? 0,
                          majorId: user.majorId ?? 0,
                          username: user.username ?? "",
                          email: user.email ?? "",
                          firstName: user.firstName ?? "",
                          lastName: user.lastName ?? "",
                          studentCode: user.studentCode ?? "",
                          avatarUrl: user.avatarUrl ?? "",
                        })}
                        className={`px-4 py-2 rounded-lg text-white ${JSON.stringify(form) === JSON.stringify({
                          campusId: user.campusId ?? 0,
                          majorId: user.majorId ?? 0,
                          username: user.username ?? "",
                          email: user.email ?? "",
                          firstName: user.firstName ?? "",
                          lastName: user.lastName ?? "",
                          studentCode: user.studentCode ?? "",
                          avatarUrl: user.avatarUrl ?? "",
                        })
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-700"
                          }`}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Enrolled Courses */}
          <div className="bg-white shadow-xl rounded-3xl p-8 border-2 border-orange-50 hover:shadow-2xl transition-all duration-300 hover:border-orange-100 animate-[slideLeft_0.6s_ease-out]">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <span className="text-3xl">📚</span> Enrolled Courses
            </h3>
            {user.enrolledCourses?.length === 0 ? (
              <p className="text-gray-500">No enrolled courses.</p>
            ) : (
              <div className="grid gap-4">
                {user.enrolledCourses.map((course, idx) => (
                  <div
                    key={course.courseInstanceId}
                    className="border-2 border-orange-100 rounded-2xl p-5 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-orange-200"
                    style={{animation: `slideUp 0.4s ease-out ${idx * 0.1}s backwards`}}
                  >
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
          <div className="bg-white shadow-xl rounded-3xl p-8 border-2 border-orange-50 hover:shadow-2xl transition-all duration-300 hover:border-orange-100 animate-[slideLeft_0.7s_ease-out]">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <span className="text-3xl">🎓</span> Taught Courses
            </h3>
            {user.taughtCourses?.length === 0 ? (
              <p className="text-gray-500">No taught courses.</p>
            ) : (
              <div className="grid gap-4">
                {user.taughtCourses.map((course, idx) => (
                  <div
                    key={course.courseInstanceId}
                    className="border-2 border-orange-100 rounded-2xl p-5 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-orange-200"
                    style={{animation: `slideUp 0.4s ease-out ${idx * 0.1}s backwards`}}
                  >
                    <p><strong>Course Name:</strong> {course.courseName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submissions History */}
          <div className="bg-white shadow-xl rounded-3xl p-8 border-2 border-orange-50 hover:shadow-2xl transition-all duration-300 hover:border-orange-100 animate-[slideLeft_0.8s_ease-out]">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <span className="text-3xl">📝</span> Submissions History
            </h3>
            {user.submissionsHistory?.length === 0 ? (
              <p className="text-gray-500">No submissions history.</p>
            ) : (
              <div className="grid gap-4">
                {user.submissionsHistory.map((sub, idx) => (
                  <div
                    key={sub.assignmentId}
                    className="border-2 border-orange-100 rounded-2xl p-5 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-orange-200"
                    style={{animation: `slideUp 0.4s ease-out ${idx * 0.1}s backwards`}}
                  >
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
    <div className="group flex items-start gap-4 p-5 border-2 border-orange-100 rounded-2xl bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 cursor-default">
      <div className="text-orange-500 mt-1 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">{label}</p>
        <p className="text-gray-800 font-bold mt-1">{value}</p>
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
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 z-10 border-2 border-orange-100 animate-[modalSlideIn_0.3s_ease-out]">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-3">{title}</h3>
        <p className="text-gray-600 mb-8 text-lg">{message}</p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
