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

  const handleYearNameChange = (value) => {
    if (!/^\d{0,4}$/.test(value)) return;

    setNewYearData(prev => ({ ...prev, name: value }));
    if (/^\d{4}$/.test(value)) {
      const year = parseInt(value);

      const start = `${year}-01-01T00:00`;
      const end = `${year}-12-31T23:59`;

      setNewYearData(prev => ({
        ...prev,
        startDate: start,
        endDate: end
      }));
    }
  };

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
    if (!/^\d{4}$/.test(newYearData.name)) {
      toast.error("Year must be in format YYYY (e.g., 2025)");
      return;
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

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValues({});
  };

  const formatForEdit = (dateStr) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${mins}`;
  };

  const handleEdit = (year) => {
    setEditingId(year.id);
    setEditingValues({
      name: year.name,
      startDate: formatForEdit(year.startDate),
      endDate: formatForEdit(year.endDate),
    });
  };

  const handleSaveEdit = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to apply these changes to the academic year?"
    );

    if (!confirmed) return;

    const toastId = toast.loading("Updating academic year...");
    try {
      const original = years.find((y) => y.id === editingId);
      const updatedStart = new Date(original.startDate);
      const editedStart = new Date(editingValues.startDate);
      updatedStart.setDate(editedStart.getDate());
      updatedStart.setMonth(editedStart.getMonth());

      const updatedEnd = new Date(original.endDate);
      const editedEnd = new Date(editingValues.endDate);
      updatedEnd.setDate(editedEnd.getDate());
      updatedEnd.setMonth(editedEnd.getMonth());

      const body = {
        academicYearId: editingId,
        campusId: original.campusId,
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
              placeholder="Academic Year (e.g., 2025)"
              value={newYearData.name}
              onChange={(e) => handleYearNameChange(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg"
            />
            <label>
              Start Date:
              <input
                type="datetime-local"
                value={newYearData.startDate}
                disabled
                className="border border-gray-300 p-2 rounded-lg w-full bg-gray-100 cursor-not-allowed"
              />
            </label>
            <label>
              End Date:
              <input
                type="datetime-local"
                value={newYearData.endDate}
                disabled
                className="border border-gray-300 p-2 rounded-lg w-full bg-gray-100 cursor-not-allowed"
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
                        type="date"
                        className="border border-gray-300 p-2 rounded-lg"
                        value={editingValues.startDate.split("T")[0]}
                        min={`${editingValues.name}-01-01`}
                        max={`${editingValues.name}-12-31`}
                        onChange={(e) => {
                          const newDate = e.target.value;
                          setEditingValues(prev => {
                            // Auto-fix end date if it's earlier
                            if (prev.endDate.split("T")[0] < newDate) {
                              return {
                                ...prev,
                                startDate: newDate + "T00:00",
                                endDate: newDate + "T23:59"
                              };
                            }
                            return { ...prev, startDate: newDate + "T00:00" };
                          });
                        }}
                      />
                    ) : (
                      formatDate(year.startDate)
                    )}
                  </td>

                  <td className="p-3">
                    {editingId === year.id ? (
                      <input
                        type="date"
                        className="border border-gray-300 p-2 rounded-lg"
                        value={editingValues.endDate.split("T")[0]}
                        min={editingValues.startDate.split("T")[0]}
                        max={`${editingValues.name}-12-31`}
                        onChange={(e) =>
                          setEditingValues(prev => ({
                            ...prev,
                            endDate: e.target.value + "T23:59"
                          }))
                        }
                      />
                    ) : (
                      formatDate(year.endDate)
                    )}
                  </td>

                  <td className="p-3 flex gap-2">
                    {editingId === year.id ? (
                      <>
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </>
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
