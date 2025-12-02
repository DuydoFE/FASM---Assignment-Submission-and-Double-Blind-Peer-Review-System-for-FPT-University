import React, { useState, useEffect } from "react";
import {
  getAllAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} from "../../service/adminService";
import { Toaster, toast } from "react-hot-toast";

export default function AdminAcademicYearManagement() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newYearData, setNewYearData] = useState({
    campusId: 1,
    name: "",
    startDate: "",
    endDate: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  const mapYear = (item) => ({
    id: item.academicYearId,
    campusId: item.campusId,
    campusName: item.campusName,
    name: item.name,
    startDate: item.startDate,
    endDate: item.endDate,
    semesterCount: item.semesterCount,
  });

  const loadYears = async () => {
    setLoading(true);
    try {
      const response = await getAllAcademicYears();
      const list = response?.data || [];
      setYears(list.map(mapYear));
    } catch (e) {
      console.error(e);
      toast.error("Failed to load academic years");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYears();
  }, []);

  const handleAddNewYear = async () => {
    if (!newYearData.name || !newYearData.startDate || !newYearData.endDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const toastId = toast.loading("Adding new academic year...");
    try {
      const body = { ...newYearData };
      await createAcademicYear(body);
      toast.success("New academic year added successfully", { id: toastId });
      setNewYearData({ campusId: 1, name: "", startDate: "", endDate: "" });
      setShowAddForm(false);
      loadYears();
    } catch (e) {
      console.error(e);
      toast.error("Failed to add new academic year", { id: toastId });
    }
  };

  const handleDelete = async (academicYearId) => {
    if (!window.confirm("Are you sure you want to delete this academic year?")) return;

    const toastId = toast.loading("Deleting academic year...");
    try {
      await deleteAcademicYear(academicYearId);
      toast.success("Academic year deleted successfully", { id: toastId });
      loadYears();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete academic year", { id: toastId });
    }
  };

  const handleEdit = (year) => {
    setEditingId(year.id);
    setEditingValues({
      name: year.name,
      startDate: year.startDate,
      endDate: year.endDate,
    });
  };

  const handleSaveEdit = async () => {
    const toastId = toast.loading("Updating academic year...");
    try {
      const year = years.find((y) => y.id === editingId);
      const body = {
        academicYearId: editingId,
        campusId: year.campusId,
        name: editingValues.name,
        startDate: editingValues.startDate,
        endDate: editingValues.endDate,
      };
      await updateAcademicYear(body);
      toast.success("Academic year updated successfully", { id: toastId });
      setEditingId(null);
      loadYears();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update academic year", { id: toastId });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Academic Year Management
      </h2>

      <button
        type="button"
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 shadow-sm mb-4"
      >
        Add New Academic Year
      </button>

      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-300 rounded-xl bg-orange-50">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Academic Year Name (e.g., 2024 - 2025)"
              value={newYearData.name}
              onChange={(e) =>
                setNewYearData({ ...newYearData, name: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg"
            />
            <label>
              Start Date:
              <input
                type="datetime-local"
                value={newYearData.startDate}
                onChange={(e) =>
                  setNewYearData({ ...newYearData, startDate: e.target.value })
                }
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
            </label>
            <label>
              End Date:
              <input
                type="datetime-local"
                value={newYearData.endDate}
                onChange={(e) =>
                  setNewYearData({ ...newYearData, endDate: e.target.value })
                }
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
            </label>
            <button
              type="button"
              onClick={handleAddNewYear}
              className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-50 text-left">
              <th className="p-3 border-b font-semibold text-gray-700">Academic Year</th>
              <th className="p-3 border-b font-semibold text-gray-700">Start Date</th>
              <th className="p-3 border-b font-semibold text-gray-700">End Date</th>
              <th className="p-3 border-b font-semibold w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : years.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No academic years found
                </td>
              </tr>
            ) : (
              years.map((year) => (
                <tr key={year.id} className="border-b hover:bg-orange-50 transition">
                  <td className="p-3">
                    {editingId === year.id ? (
                      <input
                        type="text"
                        className="border border-gray-300 p-2 rounded-lg w-full"
                        value={editingValues.name}
                        onChange={(e) =>
                          setEditingValues({ ...editingValues, name: e.target.value })
                        }
                      />
                    ) : (
                      year.name
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === year.id ? (
                      <input
                        type="datetime-local"
                        className="border border-gray-300 p-2 rounded-lg"
                        value={editingValues.startDate.slice(0, 16)}
                        onChange={(e) =>
                          setEditingValues({ ...editingValues, startDate: e.target.value })
                        }
                      />
                    ) : (
                      formatDate(year.startDate)
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === year.id ? (
                      <input
                        type="datetime-local"
                        className="border border-gray-300 p-2 rounded-lg"
                        value={editingValues.endDate.slice(0, 16)}
                        onChange={(e) =>
                          setEditingValues({ ...editingValues, endDate: e.target.value })
                        }
                      />
                    ) : (
                      formatDate(year.endDate)
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    {editingId === year.id ? (
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleEdit(year)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      type="button"
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
