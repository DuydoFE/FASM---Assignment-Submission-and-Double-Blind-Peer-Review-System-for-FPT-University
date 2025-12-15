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
          className="px-4 py-2 rounded-lg bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-red-500 text-white"
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
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Academic Year Management
      </h2>

      <button
        onClick={() => setShowAddForm(true)}
        className="bg-orange-500 text-white px-6 py-3 rounded-xl mb-4"
      >
        Add New Academic Year
      </button>

      <table className="w-full mt-6 text-center">
        <thead className="bg-orange-50">
          <tr>
            <th className="p-3">Academic Year</th>
            <th className="p-3">Start Date</th>
            <th className="p-3">End Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="p-4 text-center">Loading...</td>
            </tr>
          ) : (
            years.map((y) => (
              <tr key={y.id}>
                <td className="p-3">{y.name}</td>
                <td className="p-3">{formatDate(y.startDate)}</td>
                <td className="p-3">{formatDate(y.endDate)}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(y)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(y.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
              onClick={() =>
                setConfirmConfig({
                  title: "Create Academic Year",
                  message: "Are you sure you want to create this academic year?",
                  onConfirm: async () => {
                    setConfirmConfig(null);
                    await handleAddNewYear();
                  },
                })
              }
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Submit
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
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className={`px-4 py-2 rounded-lg text-white ${hasChanges() ? "bg-green-500" : "bg-gray-400 cursor-not-allowed"
                }`}
              disabled={!hasChanges()}
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
