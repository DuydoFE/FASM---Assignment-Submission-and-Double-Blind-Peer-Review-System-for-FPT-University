import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { createUser, getAllCampuses, getAllMajors } from "../../service/adminService";
import { Toaster } from "react-hot-toast";
import { toast } from "react-toastify";

export default function AdminCreateUser() {
    const navigate = useNavigate();

    const [campuses, setCampuses] = useState([]);
    const [majors, setMajors] = useState([]);

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

    const generateUsernameFromFirstName = (firstName) => {
        return firstName
            ?.trim()
            .toLowerCase()
            .replace(/\s+/g, "");
    };

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
        try {
            const payload = {
                ...newUser,
                username:
                    newUser.role === "Instructor"
                        ? generateUsernameFromFirstName(newUser.firstName)
                        : newUser.username,
            };

            await createUser(payload);

            toast.success("User created successfully");

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
                role: "",
                isActive: true,
            });
        } catch {
            toast.error("Create user failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() =>
                        openConfirm({
                            title: "Leave page?",
                            message: "All entered information will be lost. Are you sure you want to go back?",
                            onConfirm: () => navigate(-1),
                        })
                    }
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                    <ArrowLeft size={18} /> Back
                </button>
                <h1 className="text-3xl font-bold text-gray-800">
                    Create New User
                </h1>
            </div>

            <div className="max-w-6xl mx-auto space-y-8">

                {/* ROLE CARD */}
                <div className="bg-white rounded-2xl shadow-sm border p-6 max-w-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        1. Select User Role
                    </h3>

                    <select
                        name="role"
                        value={newUser.role}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
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

                {/* FORM CARD */}
                {newUser.role && (
                    <div className="bg-white rounded-2xl shadow-sm border p-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-6">
                            2. User Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* STUDENT ONLY */}
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
                                options={campuses.map(c => ({
                                    value: c.id || c.campusId,
                                    label: c.name || c.campusName
                                }))}
                            />

                            {newUser.role === "Student" && (
                                <Select
                                    label="Major"
                                    name="majorId"
                                    value={newUser.majorId || 0}
                                    onChange={handleChange}
                                    options={majors.map(m => ({
                                        value: m.majorId,
                                        label: m.majorName
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
                                    { value: false, label: "Inactive" }
                                ]}
                            />
                        </div>
                    </div>
                )}

                {/* ACTION */}
                <div className="flex justify-end">
                    <button
                        onClick={() =>
                            openConfirm({
                                title: "Create new user?",
                                message: "Are you sure you want to create this user with the provided information?",
                                onConfirm: handleSave,
                            })
                        }
                        disabled={!newUser.role}
                        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl shadow-md disabled:opacity-50 transition"
                    >
                        <Save size={18} /> Save User
                    </button>
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

/* ---------- Small UI Components ---------- */

function Input({ label, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
                {label}
            </label>
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
            <label className="block text-sm font-medium text-gray-600 mb-1">
                {label}
            </label>
            <select
                {...props}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            >
                <option value={0}>Select {label}</option>
                {options.map(o => (
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
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {title}
                </h3>
                <p className="text-gray-600 mb-6">
                    {message}
                </p>

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
