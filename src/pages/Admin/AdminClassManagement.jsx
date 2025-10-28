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

  // data
  const [classes, setClasses] = useState([]);

  // cascading filters state
  const [filters, setFilters] = useState({
    campus: "",
    search: "",
  });

  // UI states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);

  // create form
  const [newClass, setNewClass] = useState({
    courseId: "",
    semesterId: "",
    campusId: "",
    name: "",
    startDate: "",
    endDate: "",
  });

  // load danh sách lớp theo campus
  useEffect(() => {
    if (!filters.campus) {
      setClasses([]);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getCourseInstancesByCampusId(filters.campus);
        setClasses(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load classes");
      }
    };
    fetchData();
  }, [filters.campus]);

  // handlers
  const handleCampusChange = (e) => {
    setFilters({ campus: e.target.value, search: "" });
  };

  const handleSearchChange = (e) => setFilters({ ...filters, search: e.target.value });

  const handleViewDetail = (id) => {
    navigate(`/admin/classes/${id}/users`);
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await createCourseInstance(newClass);
      toast.success("Class created successfully!");
      setShowCreateModal(false);
      setNewClass({
        courseId: "",
        semesterId: "",
        campusId: "",
        name: "",
        startDate: "",
        endDate: "",
      });

      if (filters.campus) {
        const res = await getCourseInstancesByCampusId(filters.campus);
        setClasses(res);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create class");
    }
  };

  const handleImportClasses = async () => {
    if (!filters.campus) return toast.error("Please select a campus first");
    if (!importFile) return toast.error("Please select a file first");

    try {
      await importStudentsFromMultipleSheets(filters.campus, importFile, 1); // 1 là userId tạm
      toast.success("Import successfully!");
      setShowImportModal(false);
      const res = await getCourseInstancesByCampusId(filters.campus);
      setClasses(res);
    } catch (err) {
      console.error(err);
      toast.error("Import failed");
    }
  };

  // filtered classes by search
  const filteredClasses = classes.filter((c) =>
    c.name?.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">🏫 Class Management</h2>

      {/* Filter & Actions */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center">
        <select className="border rounded p-2" value={filters.campus} onChange={handleCampusChange}>
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
        {filteredClasses.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-2 text-left">Class Name</th>
                <th className="p-2 text-left">Course</th>
                <th className="p-2 text-left">Semester</th>
                <th className="p-2 text-left">Campus</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.courseName}</td>
                  <td className="p-2">{c.semesterName}</td>
                  <td className="p-2">{c.campusName}</td>
                  <td className="p-2">{c.status}</td>
                  <td className="p-2 space-x-2">
                    <button
                      className="text-orange-500 hover:underline"
                      onClick={() => handleViewDetail(c.id)}
                    >
                      View Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-center text-gray-500">
            {filters.campus ? "No classes found" : "Please select a campus to start filtering classes"}
          </p>
        )}
      </div>

      {/* IMPORT Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Import Class List (Excel)</h3>
            <input type="file" accept=".xlsx,.xls" onChange={(e) => setImportFile(e.target.files[0])} />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-2 border rounded">
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
                  onChange={(e) => setNewClass({ ...newClass, campusId: e.target.value })}
                  className="border rounded p-2"
                >
                  <option value="">Select Campus</option>
                  <option value="1">Hồ Chí Minh</option>
                  <option value="2">Hà Nội</option>
                </select>

                <input
                  required
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  placeholder="Class name"
                  className="border rounded p-2"
                />

                <input
                  type="text"
                  required
                  value={newClass.courseId}
                  onChange={(e) => setNewClass({ ...newClass, courseId: e.target.value })}
                  placeholder="Course ID"
                  className="border rounded p-2"
                />

                <input
                  type="text"
                  required
                  value={newClass.semesterId}
                  onChange={(e) => setNewClass({ ...newClass, semesterId: e.target.value })}
                  placeholder="Semester ID"
                  className="border rounded p-2"
                />

                <input
                  type="date"
                  required
                  value={newClass.startDate}
                  onChange={(e) => setNewClass({ ...newClass, startDate: e.target.value })}
                  className="border rounded p-2"
                />

                <input
                  type="date"
                  required
                  value={newClass.endDate}
                  onChange={(e) => setNewClass({ ...newClass, endDate: e.target.value })}
                  className="border rounded p-2"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded">
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
