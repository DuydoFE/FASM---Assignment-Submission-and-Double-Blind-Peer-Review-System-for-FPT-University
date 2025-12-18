import React, { useState, useEffect } from "react";
import {
  getAllAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} from "../../service/adminService";
import { Toaster, toast } from "react-hot-toast";

/* ================= HELPER ================= */
const getErrorMessage = (error, defaultMsg = "Something went wrong") => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.errors) return error.response.data.errors.join(", ");
  if (error?.message) return error.message;
  return defaultMsg;
};

/* ================= MODAL ================= */
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

/* ================= MAIN COMPONENT ================= */
export default function AdminAcademicYearManagement() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [newYearData, setNewYearData] = useState({
    campusId: 1,
    name: "",
    startDate: "",
    endDate: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  const [originalValues, setOriginalValues] = useState({});

  const [confirmConfig, setConfirmConfig] = useState(null);

  /* ================= UTIL ================= */
  const mapYear = (item) => ({
    id: item.academicYearId,
    campusId: item.campusId,
    campusName: item.campusName,
    name: item.name,
    startDate: item.startDate,
    endDate: item.endDate,
    semesterCount: item.semesterCount,
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB");
  };

  const formatForEdit = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  /* ================= LOAD ================= */
  const loadYears = async () => {
    setLoading(true);
    try {
      const res = await getAllAcademicYears();
      setYears((res?.data || []).map(mapYear));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load academic years"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYears();
  }, []);

  /* ================= ADD ================= */
  const handleYearNameChange = (value, isEdit = false) => {
    if (!/^\d{0,4}$/.test(value)) return;

    const updated = { name: value };
    if (value.length === 4) {
      updated.startDate = `${value}-01-01T00:00`;
      updated.endDate = `${value}-12-31T23:59`;
    }

    if (isEdit) {
      setEditingValues((prev) => ({ ...prev, ...updated }));
    } else {
      setNewYearData((prev) => ({ ...prev, ...updated }));
    }
  };

  const handleAddNewYear = async () => {
    if (!/^\d{4}$/.test(newYearData.name)) {
      toast.error("Year must be in format YYYY (e.g., 2025)");
      return;
    }

    const toastId = toast.loading("Processing...");
    try {
      const res = await createAcademicYear(newYearData);
      const msg = res?.data?.message || "New academic year added successfully";
      toast.success(msg, { id: toastId });

      setShowAddForm(false);
      setNewYearData({ campusId: 1, name: "", startDate: "", endDate: "" });
      loadYears();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add new academic year"), { id: toastId });
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (year) => {
    setEditingId(year.id);
    const editValues = {
      name: year.name,
      startDate: formatForEdit(year.startDate),
      endDate: formatForEdit(year.endDate),
    };
    setEditingValues(editValues);
    setOriginalValues(editValues);
    setShowEditForm(true);
  };

  const hasChanges = () => {
    return (
      editingValues.name !== originalValues.name ||
      editingValues.startDate !== originalValues.startDate ||
      editingValues.endDate !== originalValues.endDate
    );
  };

  const handleSaveEdit = () => {
    if (!hasChanges()) return;

    setConfirmConfig({
      title: "Update Academic Year",
      message: "Are you sure you want to save these changes?",
      onConfirm: async () => {
        setConfirmConfig(null);

        const toastId = toast.loading("Updating academic year...");
        try {
          const original = years.find((y) => y.id === editingId);

          await updateAcademicYear({
            academicYearId: editingId,
            campusId: original.campusId,
            name: editingValues.name,
            startDate: editingValues.startDate,
            endDate: editingValues.endDate,
          });

          toast.success("Academic year updated successfully", { id: toastId });
          setEditingId(null);
          setShowEditForm(false);
          loadYears();
        } catch (error) {
          toast.error(getErrorMessage(error, "Failed to update academic year"), { id: toastId });
        }
      },
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    setConfirmConfig({
      title: "Delete Academic Year",
      message: "Are you sure you want to delete this academic year?",
      onConfirm: async () => {
        setConfirmConfig(null);

        const toastId = toast.loading("Deleting academic year...");
        try {
          await deleteAcademicYear(id);
          toast.success("Academic year deleted successfully", { id: toastId });
          loadYears();
        } catch (error) {
          toast.error(getErrorMessage(error, "Failed to delete academic year"), { id: toastId });
        }
      },
    });
  };

  /* ================= RENDER ================= */
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-orange-600">
          Academic Year Management
        </h2>

        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 rounded-xl font-semibold transition-all
      bg-[#F36F21] text-white shadow-md shadow-orange-200
      hover:bg-[#D95C18] hover:-translate-y-0.5"
        >
          + Create Academic Year
        </button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-[#FFF3EB] text-[#F36F21] font-semibold border-b-2 border-[#F36F21]">
            <tr>
              <th className="p-3 text-left uppercase text-sm">Academic Year</th>
              <th className="p-3 text-left uppercase text-sm">Start Date</th>
              <th className="p-3 text-left uppercase text-sm">End Date</th>
              <th className="p-3 text-center uppercase text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">Loading...</td>
              </tr>
            ) : (
              years.map((y) => (
                <tr
                  key={y.id}
                  className="border-b hover:bg-[#FFF3EB] transition"
                >
                  <td className="p-3">{y.name}</td>
                  <td className="p-3">{formatDate(y.startDate)}</td>
                  <td className="p-3">{formatDate(y.endDate)}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(y)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all
               bg-blue-600 text-white shadow-md shadow-blue-200
               hover:bg-blue-700 hover:-translate-y-0.5"
                      >
                        Update
                      </button>

                      <button
                        onClick={() => handleDelete(y.id)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold
               bg-red-50 text-red-700 border border-red-200
               hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= ADD FORM MODAL ================= */}
      {showAddForm && (
        <Modal onClose={() => setShowAddForm(false)}>
          <h3 className="text-xl font-bold mb-4 text-orange-600">Add Academic Year</h3>

          <label className="block text-gray-700 mb-1">Academic Year</label>
          <input
            value={newYearData.name}
            onChange={(e) => handleYearNameChange(e.target.value)}
            placeholder="Academic Year (e.g., 2025)"
            className="border p-2 rounded-lg w-full mb-3"
          />

          <label className="block text-gray-700 mb-1">Start Date</label>
          <input
            type="datetime-local"
            disabled
            value={newYearData.startDate}
            className="border p-2 rounded-lg w-full mb-3 bg-gray-100"
          />

          <label className="block text-gray-700 mb-1">End Date</label>
          <input
            type="datetime-local"
            disabled
            value={newYearData.endDate}
            className="border p-2 rounded-lg w-full mb-4 bg-gray-100"
          />

          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAddForm(false)} className="bg-gray-300 px-4 py-2 rounded-lg">
              Cancel
            </button>
            <button
              onClick={() => {
                if (!/^\d{4}$/.test(newYearData.name)) {
                  toast.error("Academic Year must be yyyy (e.g. 2025)");
                  return;
                }
                setConfirmConfig({
                  title: "Create Academic Year",
                  message: "Are you sure you want to create this academic year?",
                  onConfirm: async () => {
                    setConfirmConfig(null);
                    await handleAddNewYear();
                  },
                });
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Create
            </button>
          </div>
        </Modal>
      )}

      {/* ================= EDIT FORM MODAL ================= */}
      {showEditForm && (
        <Modal onClose={() => setShowEditForm(false)}>
          <h3 className="text-xl font-bold mb-4 text-orange-600">Edit Academic Year</h3>

          <label className="block text-gray-700 mb-1">Academic Year</label>
          <input
            value={editingValues.name}
            onChange={(e) => handleYearNameChange(e.target.value, true)}
            placeholder="Academic Year (e.g., 2025)"
            className="border p-2 rounded-lg w-full mb-3"
          />

          <label className="block text-gray-700 mb-1">Start Date</label>
          <input
            type="datetime-local"
            disabled
            value={editingValues.startDate}
            className="border p-2 rounded-lg w-full mb-3 bg-gray-100"
          />

          <label className="block text-gray-700 mb-1">End Date</label>
          <input
            type="datetime-local"
            disabled
            value={editingValues.endDate}
            className="border p-2 rounded-lg w-full mb-4 bg-gray-100"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowEditForm(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!hasChanges()}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${hasChanges()
                ? "bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {confirmConfig && (
        <ConfirmModal
          title={confirmConfig.title}
          message={confirmConfig.message}
          onCancel={() => setConfirmConfig(null)}
          onConfirm={confirmConfig.onConfirm}
        />
      )}
    </div>
  );
}
