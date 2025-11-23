import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import {
    createUser,
    getAllCampuses,
    getAllMajors,
} from "../../service/adminService";

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

    const handleSave = async () => {
        try {
            const res = await createUser(newUser);
            if (res?.status === 201 || res?.success) {
                alert("User created successfully!");
                navigate("/admin/users");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to create user.");
        }
    };

    return (
        <div className="p-8 bg-white min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-800 mb-6"
            >
                <ArrowLeft size={20} /> Back
            </button>

            <h2 className="text-4xl font-bold text-orange-600 mb-8">Create New User</h2>

            <div className="bg-white shadow-lg rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
