import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminClassManagement() {
    const navigate = useNavigate();

    // Fake data
    const [classes, setClasses] = useState([
        {
            id: 1,
            name: "SE101 - Group A",
            semester: "Spring 2025",
            major: "Software Engineering",
            course: "SE101",
            campus: "Hanoi",
        },
        {
            id: 2,
            name: "AI202 - Group B",
            semester: "Fall 2025",
            major: "Artificial Intelligence",
            course: "AI202",
            campus: "HCM",
        },
    ]);

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

    const isFiltering =
        filters.semester || filters.major || filters.course || filters.campus;

    const filteredClasses = isFiltering
        ? classes.filter((c) => {
              return (
                  (filters.semester ? c.semester === filters.semester : true) &&
                  (filters.major ? c.major === filters.major : true) &&
                  (filters.course ? c.course === filters.course : true) &&
                  (filters.campus ? c.campus === filters.campus : true)
              );
          })
        : [];

    // Fake import handler
    const handleImport = () => {
        alert("Import class list from file (feature under development)");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-orange-500">🏫 Class Management</h2>

            {/* Filter & Actions */}
            <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center">
                {/* Campus filter always visible */}
                <select
                    className="border rounded p-2"
                    value={filters.campus}
                    onChange={(e) =>
                        setFilters({ ...filters, campus: e.target.value })
                    }
                >
                    <option value="">Select Campus</option>
                    <option value="Hanoi">Hanoi</option>
                    <option value="HCM">HCM</option>
                </select>

                {/* Other filters only show after campus is chosen */}
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

                        <select
                            className="border rounded p-2"
                            value={filters.major}
                            onChange={(e) =>
                                setFilters({ ...filters, major: e.target.value })
                            }
                        >
                            <option value="">Major</option>
                            <option value="Software Engineering">
                                Software Engineering
                            </option>
                            <option value="Artificial Intelligence">
                                Artificial Intelligence
                            </option>
                        </select>

                        <select
                            className="border rounded p-2"
                            value={filters.course}
                            onChange={(e) =>
                                setFilters({ ...filters, course: e.target.value })
                            }
                        >
                            <option value="">Course</option>
                            <option value="SE101">SE101</option>
                            <option value="AI202">AI202</option>
                        </select>
                    </>
                )}

                {/* Buttons */}
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
                {isFiltering ? (
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
                                    <td
                                        colSpan={6}
                                        className="p-4 text-center text-gray-500"
                                    >
                                        No classes found
                                    </td>
                                </tr>
                            ) : (
                                filteredClasses.map((c) => (
                                    <tr
                                        key={c.id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-2">{c.name}</td>
                                        <td className="p-2">{c.semester}</td>
                                        <td className="p-2">{c.major}</td>
                                        <td className="p-2">{c.course}</td>
                                        <td className="p-2">{c.campus}</td>
                                        <td className="p-2 space-x-2">
                                            <button
                                                onClick={() =>
                                                    navigate(`/admin/classes/${c.id}`)
                                                }
                                                className="text-orange-500 hover:underline"
                                            >
                                                View Detail
                                            </button>
                                            <button className="text-blue-500 hover:underline">
                                                View Assignments
                                            </button>
                                            <button className="text-red-500 hover:underline">
                                                Delete
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

            {/* Modal Create Semester */}
            {showCreateSemester && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">
                        <h3 className="text-lg font-semibold">Create Semester</h3>
                        <select
                            className="border rounded w-full p-2"
                            value={newSemester.term}
                            onChange={(e) =>
                                setNewSemester({
                                    ...newSemester,
                                    term: e.target.value,
                                })
                            }
                        >
                            <option value="">Select Term</option>
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                            <option value="Fall">Fall</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Year (e.g. 2025)"
                            className="border rounded w-full p-2"
                            value={newSemester.year}
                            onChange={(e) =>
                                setNewSemester({
                                    ...newSemester,
                                    year: e.target.value,
                                })
                            }
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowCreateSemester(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    console.log(
                                        "Created semester:",
                                        `${newSemester.term} ${newSemester.year}`
                                    );
                                    setShowCreateSemester(false);
                                }}
                                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Create Class */}
            {showCreateClass && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">
                        <h3 className="text-lg font-semibold">Create Class</h3>
                        <select
                            className="border rounded w-full p-2"
                            value={newClass.semester}
                            onChange={(e) =>
                                setNewClass({
                                    ...newClass,
                                    semester: e.target.value,
                                })
                            }
                        >
                            <option value="">Select Semester</option>
                            <option value="Spring 2025">Spring 2025</option>
                            <option value="Fall 2025">Fall 2025</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Major"
                            className="border rounded w-full p-2"
                            value={newClass.major}
                            onChange={(e) =>
                                setNewClass({ ...newClass, major: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Course"
                            className="border rounded w-full p-2"
                            value={newClass.course}
                            onChange={(e) =>
                                setNewClass({ ...newClass, course: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Campus"
                            className="border rounded w-full p-2"
                            value={newClass.campus}
                            onChange={(e) =>
                                setNewClass({ ...newClass, campus: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Class Name"
                            className="border rounded w-full p-2"
                            value={newClass.name}
                            onChange={(e) =>
                                setNewClass({ ...newClass, name: e.target.value })
                            }
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowCreateClass(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    console.log("Created class:", newClass);
                                    setShowCreateClass(false);
                                }}
                                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
