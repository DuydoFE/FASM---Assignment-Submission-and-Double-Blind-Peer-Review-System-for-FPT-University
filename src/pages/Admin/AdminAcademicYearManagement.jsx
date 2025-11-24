import React, { useState, useEffect } from "react";
import {
  getAllAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} from "../../service/adminService";
import toast from "react-hot-toast";

export default function AdminAcademicYearManagement() {
  const [years, setYears] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [loading, setLoading] = useState(true);

  // Convert response object to FE simplified object
  const mapYear = (item) => ({
    id: item.academicYearId,
    name: item.name,
    campusId: item.campusId,
    campusName: item.campusName,
    startDate: item.startDate,
    endDate: item.endDate,
    semesterCount: item.semesterCount,
  });

  // ================================
  // LOAD DATA
  // ================================
  const loadYears = async () => {
    try {
      setLoading(true);

      const response = await getAllAcademicYears();

      // FIX: API returns { message, statusCode, data: [...] }
      const list = response?.data || [];

      setYears(list.map(mapYear));
    } catch (e) {
      toast.error("Failed to load academic years");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYears();
  }, []);

  // ================================
  // ADD
  // ================================
  const handleAdd = async () => {
    if (!newYear.trim()) {
      toast.error("Academic year cannot be empty");
      return;
    }

    try {
      const today = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(today.getFullYear() + 1);

      const body = {
        campusId: 1, // tạm fix vì UI chưa có campus
        name: newYear,
        startDate: today.toISOString(),
        endDate: nextYear.toISOString(),
      };

      await createAcademicYear(body);

      toast.success("New academic year added");
      setNewYear("");
      loadYears();
    } catch (e) {
      toast.error("Failed to add academic year");
    }
  };

  // ================================
  // DELETE
  // ================================
  const handleDelete = async (academicYearId) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      await deleteAcademicYear(academicYearId);
      toast.success("Academic year deleted");
      loadYears();
    } catch (e) {
      toast.error("Failed to delete academic year");
    }
  };

  // ================================
  // EDIT
  // ================================
  const handleEdit = (year) => {
    setEditingId(year.id);
    setEditingValue(year.name);
  };

  const handleSaveEdit = async () => {
    if (!editingValue.trim()) {
      toast.error("Academic year cannot be empty");
      return;
    }

    try {
      const now = new Date();
      const next = new Date();
      next.setFullYear(now.getFullYear() + 1);

      const year = years.find((y) => y.id === editingId);

      const body = {
        academicYearId: editingId,
        campusId: year.campusId,
        name: editingValue,
        startDate: year.startDate || now.toISOString(),
        endDate: year.endDate || next.toISOString(),
      };

      await updateAcademicYear(body);

      toast.success("Academic year updated");
      setEditingId(null);
      setEditingValue("");
      loadYears();
    } catch (e) {
      toast.error("Failed to update academic year");
    }
  };

  // ================================
  // UI
  // ================================
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Academic Year Management
      </h2>

      {/* Add New Academic Year */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
          placeholder="Enter academic year (e.g., 2024 - 2025)"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 shadow-sm"
        >
          Add
        </button>
      </div>

      {/* List Academic Years */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-50 text-left">
              <th className="p-3 border-b font-semibold text-gray-700">ID</th>
              <th className="p-3 border-b font-semibold text-gray-700">
                Academic Year
              </th>
              <th className="p-3 border-b font-semibold w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : years.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No academic years found
                </td>
              </tr>
            ) : (
              years.map((year) => (
                <tr
                  key={year.id}
                  className="border-b hover:bg-orange-50 transition"
                >
                  <td className="p-3">{year.id}</td>

                  <td className="p-3">
                    {editingId === year.id ? (
                      <input
                        type="text"
                        className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                      />
                    ) : (
                      year.name
                    )}
                  </td>

                  <td className="p-3 flex gap-2">
                    {editingId === year.id ? (
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(year)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(year.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
