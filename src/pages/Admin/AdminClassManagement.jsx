import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClasses } from "../../service/adminService";

export default function AdminClassManagement() {
    const navigate = useNavigate();

    // ✅ Không dùng dữ liệu giả nữa
    const [classes, setClasses] = useState([]);
    const [filters, setFilters] = useState({
        semester: "",
        major: "",
        course: "",
        campus: "",
    });

    const [showCreateSemester, setShowCreateSemester] = useState(false);
    const [showCreateClass, setShowCreateClass] = useState(false);

    const [newSemester, setNewSemester] = useState({ year: "", term: "" });
    const [newClass, setNewClass] = useState({
        semester: "",
        major: "",
        course: "",
        campus: "",
        name: "",
    });

    // ✅ Khi chọn campus → gọi API lấy danh sách lớp
    // ✅ Khi chọn campus → gọi API tất cả lớp, rồi lọc theo campus
    const handleCampusChange = async (e) => {
        const campusId = e.target.value;
        setFilters({ ...filters, campus: campusId });

        if (!campusId) {
            setClasses([]);
            return;
        }

        try {
            const res = await getAllClasses(); // ✅ gọi API thật

            console.log("📦 API Response:", res);

            // ✅ Lấy đúng dữ liệu từ BaseResponse
            const raw = Array.isArray(res?.data?.data)
                ? res.data.data
                : Array.isArray(res?.data)
                    ? res.data
                    : [];

            // ✅ Lọc theo campusId vì API trả toàn bộ lớp
            const filteredByCampus = raw.filter(
                (c) => c.campusId?.toString() === campusId.toString()
            );

            // ✅ Chuẩn hóa dữ liệu để hiển thị đúng
            const formatted = filteredByCampus.map((c) => ({
                id: c.courseInstanceId,
                name: `${c.courseName || "-"} - ${c.sectionCode || ""}`,
                semester: c.semesterName || "-",
                major: c.courseName || "-", // Nếu BE chưa trả major riêng, tạm hiển thị courseName
                course: c.courseCode || "-",
                campus: c.campusName || "-",
            }));

            console.log("✅ Formatted classes:", formatted);
            setClasses(formatted);
        } catch (error) {
            console.error("❌ Failed to fetch classes:", error);
            setClasses([]);
        }
    };

    // ✅ Lọc dữ liệu trong FE (như cũ)
    // ❌ KHÔNG cần dùng isFiltering để quyết định có hiển thị không
    const filteredClasses =
        filters.semester || filters.major || filters.course
            ? classes.filter((c) => {
                return (
                    (filters.semester
                        ? c.semester?.toLowerCase().includes(filters.semester.toLowerCase())
                        : true) &&
                    (filters.major
                        ? c.major?.toLowerCase().includes(filters.major.toLowerCase())
                        : true) &&
                    (filters.course
                        ? c.course?.toLowerCase().includes(filters.course.toLowerCase())
                        : true)
                );
            })
            : classes;

    // 🧩 Giữ nguyên hàm import file
    const handleImport = () => {
        alert("Import class list from file (feature under development)");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-orange-500">🏫 Class Management</h2>

            {/* Filter & Actions */}
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

                {filters.campus && (
                    <>
                        <select
                            className="border rounded p-2"
                            value={filters.semester}
                            onChange={(e) =>
                                setFilters({ ...filters, semester: e.target.value })
                            }
                        >
                            <option value="">Semester</option>
                            <option value="Spring 2025">Spring 2025</option>
                            <option value="Fall 2025">Fall 2025</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Filter by Major"
                            className="border rounded p-2"
                            value={filters.major}
                            onChange={(e) =>
                                setFilters({ ...filters, major: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Filter by Course"
                            className="border rounded p-2"
                            value={filters.course}
                            onChange={(e) =>
                                setFilters({ ...filters, course: e.target.value })
                            }
                        />
                    </>
                )}

                <div className="ml-auto flex flex-wrap gap-2">
                    <button
                        onClick={handleImport}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                    >
                        📂 Import Class List
                    </button>

                    <button
                        onClick={() => setShowCreateSemester(true)}
                        className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
                    >
                        + Create Semester
                    </button>
                    <button
                        onClick={() => setShowCreateClass(true)}
                        className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
                    >
                        + Create Class
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                {classes.length > 0 ? (
                    <table className="w-full text-sm">
                        <thead className="bg-orange-500 text-white">
                            <tr>
                                <th className="p-2 text-left">Class Name</th>
                                <th className="p-2 text-left">Semester</th>
                                <th className="p-2 text-left">Major</th>
                                <th className="p-2 text-left">Course</th>
                                <th className="p-2 text-left">Campus</th>
                                <th className="p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClasses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500">
                                        No classes found
                                    </td>
                                </tr>
                            ) : (
                                filteredClasses.map((c) => (
                                    <tr key={c.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{c.name}</td>
                                        <td className="p-2">{c.semester}</td>
                                        <td className="p-2">{c.major}</td>
                                        <td className="p-2">{c.course}</td>
                                        <td className="p-2">{c.campus}</td>
                                        <td className="p-2 space-x-2">
                                            <button
                                                className="text-orange-500 hover:underline"
                                                onClick={() => console.log("View detail:", c.id)}
                                            >
                                                View Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                ) : (
                    <p className="p-4 text-center text-gray-500">
                        Please select a campus to start filtering classes
                    </p>
                )}
            </div>


            {/* ✅ Giữ nguyên 2 modal tạo mới */}
            {/* Modal Create Semester + Modal Create Class (như code cũ của cậu) */}
        </div>
    );
}
