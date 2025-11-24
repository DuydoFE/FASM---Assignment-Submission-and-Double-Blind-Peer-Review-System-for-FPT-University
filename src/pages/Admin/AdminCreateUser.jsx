import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { createUser, getAllCampuses, getAllMajors } from "../../service/adminService";
import toast, { Toaster } from "react-hot-toast";

export default function AdminCreateUser() {
    const navigate = useNavigate();

    const [campuses, setCampuses] = useState([]);
    const [majors, setMajors] = useState([]);

    const [newUser, setNewUser] = useState({
        campusId: 0,
        majorId: 0,
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

    const roles = ["Student", "Instructor"];

    useEffect(() => {
        getAllCampuses().then((res) => {
            setCampuses(Array.isArray(res?.data) ? res.data : []);
        });

        getAllMajors().then((res) => {
            setMajors(Array.isArray(res?.data) ? res.data : []);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const resetForm = () => {
        setNewUser({
            campusId: 0,
            majorId: 0,
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
    };

    const handleSave = async () => {
        try {
            await createUser(newUser);

            toast.success("User created successfully!", {
                style: {
                    borderRadius: "10px",
                    background: "#fff7ed",
                    color: "#9a3412",
                    border: "1px solid #fdba74",
                    padding: "16px 24px",
                    fontWeight: "500",
                },
                iconTheme: {
                    primary: "#ea580c",
                    secondary: "#fff",
                },
            });

            resetForm();

        } catch (error) {
            const status = error.response?.status;

            const messages = {
                400: "Invalid data. Please check all required fields.",
                409: "Email or username already exists.",
            };

            toast.error(messages[status] || "An unexpected error occurred. Please try again.", {
                style: {
                    borderRadius: "10px",
                    background: "#fef2f2",
                    color: "#b91c1c",
                    border: "1px solid #fca5a5",
                    padding: "16px 24px",
                    fontWeight: "500",
                },
                iconTheme: {
                    primary: "#b91c1c",
                    secondary: "#fff",
                },
            });
        }
    };

    return (
        <div className="p-8 bg-white min-h-screen">
            {/* Toaster hiển thị toast */}
            <Toaster position="top-right" reverseOrder={false} />

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-800 mb-6"
            >
                <ArrowLeft size={20} /> Back
            </button>

            <h2 className="text-4xl font-bold text-orange-600 mb-8">
                Create New User
            </h2>

            <div className="bg-white shadow-lg rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                    <label className="text-gray-600 font-semibold">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={newUser.username}
                        onChange={handleChange}
                        className="mt-1 w-full p-3 border rounded-lg shadow-sm"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="text-gray-600 font-semibold">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleChange}
                        className="mt-1 w-full p-3 border rounded-lg shadow-sm"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="text-gray-600 font-semibold">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleChange}
                        className="mt-1 w-full p-3 border rounded-lg shadow-sm"
                    />
                </div>

                {/* First Name */}
                <div>
                    <label className="text-gray-600 font-semibold">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={newUser.firstName}
                        onChange={handleChange}
                        className="mt-1 w-full p-3 border rounded-lg shadow-sm"
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label className="text-gray-600 font-semibold">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={newUser.lastName}
                        onChange={handleChange}
                        className="mt-1 w-full p-3 border rounded-lg shadow-sm"
                    />
                </div>

                {/* Student Code */}
                <div>
                    <label className="text-gray-600 font-semibold">User Code</label>
                    <input
                        type="text"
                        name="studentCode"
                        value={newUser.studentCode}
                        onChange={handleChange}
                        className="mt-1 w-full p-3 border rounded-lg shadow-sm"
                    />
                </div>

                {/* Avatar URL */}
                <div>
                    <label className="text-gray-600 font-semibold">Avatar URL</label>
                    <input
                        type="text"
                        name="avatarUrl"
                        value={newUser.avatarUrl}
                        onChange={handleChange}
                        className="mt-1 w-full p-3 border rounded-lg shadow-sm"
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="text-gray-600 font-semibold">Role</label>
                    <select
                        name="role"
                        value={newUser.role}
                        onChange={handleChange}
                        className="mt-1 w-full p-3 border rounded-lg shadow-sm"
                    >
                        <option value="">Select Role</option>
                        {roles.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                {/* Campus */}
                <div>
                    <label className="text-gray-600 font-semibold">Campus</label>
                    <select
                        name="campusId"
                        value={newUser.campusId}
                        onChange={handleChange}
                        className="mt-1 w-full p-3 border rounded-lg shadow-sm"
                    >
                        <option value={0}>Select Campus</option>
                        {campuses.map((c) => (
                            <option key={c.id || c.campusId} value={c.id || c.campusId}>
                                {c.name || c.campusName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Major */}
                <div>
                    <label className="text-gray-600 font-semibold">Major</label>
                    <select
                        name="majorId"
                        value={newUser.majorId}
                        onChange={handleChange}
                        className="mt-1 w-full p-3 border rounded-lg shadow-sm"
                    >
                        <option value={0}>Select Major</option>
                        {majors.map((m) => (
                            <option key={m.majorId} value={m.majorId}>
                                {m.majorName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="text-gray-600 font-semibold">Status</label>
                    <select
                        name="isActive"
                        value={newUser.isActive}
                        onChange={handleChange}
                        className="mt-1 w-full p-3 border rounded-lg shadow-sm"
                    >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                    </select>
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition"
                >
                    <Save size={20} /> Save
                </button>
            </div>
        </div>
    );
}
