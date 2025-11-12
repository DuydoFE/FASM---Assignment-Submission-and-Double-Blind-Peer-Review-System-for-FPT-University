import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCourseInstancesByCampusId,
  createCourseInstance,
  importStudentsFromMultipleSheets,
} from "../../service/adminService";
import toast from "react-hot-toast";

export default function AdminClassManagement() {
  const navigate = useNavigate();

  // Data
  const [classes, setClasses] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    campus: "",
    search: "",
  });

  // UI states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);

  // Form create class
  const [newClass, setNewClass] = useState({
    courseId: "",
    semesterId: "",
    campusId: "",
    sectionCode: "",
    enrollmentPassword: "",
    requiresApproval: true,
  });

  // 🧠 Load lớp học theo campus khi campus được chọn
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!filters.campus) {
          setClasses([]);
          return;
        }
        const res = await getCourseInstancesByCampusId(Number(filters.campus));
        setClasses(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Fetch classes error:", err);
        toast.error("Failed to load classes");
      }
    };
    fetchData();
  }, [filters.campus]);

  const handleCampusChange = (e) => {
    setFilters({ ...filters, campus: e.target.value });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleViewDetail = (id) => {
    navigate(`/admin/classes/${id}`);
  };

  // ✅ Tạo lớp học mới (FE)
  const handleCreateClass = async (e) => {
    e.preventDefault();

    // Validate
    if (!newClass.courseId || !newClass.semesterId || !newClass.campusId) {
      toast.error("Please select campus, course, and semester.");
      return;
    }
    if (!newClass.sectionCode.trim()) {
      toast.error("Please enter section code.");
      return;
    }
    if (!newClass.enrollmentPassword.trim()) {
      toast.error("Please enter enrollment password.");
      return;
    }

    const payload = {
      courseId: Number(newClass.courseId),
      semesterId: Number(newClass.semesterId),
      campusId: Number(newClass.campusId),
      sectionCode: newClass.sectionCode.trim(),           // 🔹 Thay className bằng sectionCode
      enrollmentPassword: newClass.enrollmentPassword.trim(), // 🔹 Thêm enrollmentPassword
      requiresApproval: Boolean(newClass.requiresApproval),    // 🔹 Thêm requiresApproval
    };

    console.log("🚀 Payload gửi lên BE:", payload);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Missing token. Please log in again.");
        return;
      }

      const res = await createCourseInstance(payload);
      console.log("📥 Response từ BE sau khi tạo class:", res);

      if (res?.statusCode === 100 || res?.status === 201) {
        toast.success("Class created successfully!");
      } else {
        console.warn("⚠️ Unexpected response từ BE:", res);
        toast.error(res?.message || "Unexpected response from server.");
      }

      setShowCreateModal(false);
      setNewClass({
        courseId: "",
        semesterId: "",
        campusId: "",
        sectionCode: "",
        enrollmentPassword: "",
        requiresApproval: true,
      });

      if (filters.campus) {
        const updated = await getCourseInstancesByCampusId(
          Number(filters.campus)
        );
        setClasses(Array.isArray(updated?.data) ? updated.data : []);
      }
    } catch (err) {
      console.error("❌ Create class error:", err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create class. Please check the server logs.";
      toast.error(errorMsg);
    }
  };

  const handleImportClasses = async () => {
    if (!filters.campus) return toast.error("Please select a campus first");
    if (!importFile) return toast.error("Please select a file first");

    try {
      console.log("🚀 Importing students for campus:", filters.campus);
      const res = await importStudentsFromMultipleSheets(filters.campus, importFile, 1);
      console.log("📥 Response từ BE khi import:", res);

      if (res?.statusCode === 200 || res?.success === true) {
        toast.success("Import successfully!");
      } else {
        toast.error(res?.message || "Import failed!");
      }

      setShowImportModal(false);

      // Reload danh sách lớp sau khi import
      const updated = await getCourseInstancesByCampusId(Number(filters.campus));
      setClasses(Array.isArray(updated?.data) ? updated.data : []);
    } catch (err) {
      console.error("❌ Import class list error:", err);
      toast.error(err?.response?.data?.message || "Import failed. Please check the file or server.");
    }
  };

  const displayedClasses = classes.filter((c) => {
    const matchSearch =
      c.courseName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.sectionCode?.toLowerCase().includes(filters.search.toLowerCase());
    return matchSearch;
  });

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

        <input
          type="text"
          placeholder="Search by class name"
          className="border rounded p-2 flex-1 min-w-[200px]"
          value={filters.search}
          onChange={handleSearchChange}
        />

        <div className="ml-auto flex flex-wrap gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
          >
            📂 Import Class List
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
          >
            + Add Class
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        {filters.campus ? (
          displayedClasses.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="p-2 text-left">Class Name</th>
                  <th className="p-2 text-left">Course</th>
                  <th className="p-2 text-left">Semester</th>
                  <th className="p-2 text-left">Campus</th>
                  <th className="p-2 text-left">Students</th>
                  <th className="p-2 text-left">Assignments</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedClasses.map((c) => (
                  <tr
                    key={c.courseInstanceId}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-2">{c.sectionCode || c.courseName}</td>
                    <td className="p-2">{c.courseName}</td>
                    <td className="p-2">{c.semesterName}</td>
                    <td className="p-2">{c.campusName}</td>
                    <td className="p-2">{c.studentCount}</td>
                    <td className="p-2">{c.assignmentCount}</td>
                    <td className="p-2 space-x-2">
                      <button
                        className="text-orange-500 hover:underline"
                        onClick={() => handleViewDetail(c.courseInstanceId)}
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 text-center text-gray-500">No classes found</p>
          )
        ) : (
          <p className="p-4 text-center text-gray-500">
            Please select a campus first
          </p>
        )}
      </div>

      {/* IMPORT Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Import Class List (Excel)
            </h3>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setImportFile(e.target.files[0])}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleImportClasses}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Create New Class</h3>
            <form className="space-y-3" onSubmit={handleCreateClass}>
              <div className="grid grid-cols-2 gap-3">
                <select
                  required
                  value={newClass.campusId}
                  onChange={(e) =>
                    setNewClass({ ...newClass, campusId: e.target.value })
                  }
                  className="border rounded p-2"
                >
                  <option value="">Select Campus</option>
                  <option value="1">Hồ Chí Minh</option>
                  <option value="2">Hà Nội</option>
                </select>

                <select
                  required
                  value={newClass.courseId}
                  onChange={(e) =>
                    setNewClass({ ...newClass, courseId: e.target.value })
                  }
                  className="border rounded p-2"
                >
                  <option value="">Select Course</option>
                  <option value="1">Object-Oriented Programming</option>
                  <option value="2">Data Structures and Algorithms</option>
                </select>

                <select
                  required
                  value={newClass.semesterId}
                  onChange={(e) =>
                    setNewClass({ ...newClass, semesterId: e.target.value })
                  }
                  className="border rounded p-2"
                >
                  <option value="">Select Semester</option>
                  <option value="1">Fall 2025</option>
                  <option value="2">Spring 2026</option>
                </select>

                <input
                  type="text"
                  required
                  value={newClass.sectionCode}
                  onChange={(e) =>
                    setNewClass({ ...newClass, sectionCode: e.target.value })
                  }
                  placeholder="Section Code"
                  className="border rounded p-2"
                />

                <input
                  type="text"
                  required
                  value={newClass.enrollmentPassword}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      enrollmentPassword: e.target.value,
                    })
                  }
                  placeholder="Enrollment Password"
                  className="border rounded p-2"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={newClass.requiresApproval}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      requiresApproval: e.target.checked,
                    })
                  }
                />
                <label>Requires Approval</label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
