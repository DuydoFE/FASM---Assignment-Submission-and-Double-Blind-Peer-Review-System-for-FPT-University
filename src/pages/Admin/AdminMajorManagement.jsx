import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  getAllMajors,
  createMajor,
  updateMajor,
  deleteMajor,
} from "../../service/adminService";

/* =========================
   Modal Wrapper (OUTSIDE)
   ========================= */
const ModalWrapper = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
      {children}
    </div>
  </div>
);

export default function AdminMajorManagement() {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newMajor, setNewMajor] = useState({
    majorCode: "",
    majorName: "",
  });

  const [editingMajor, setEditingMajor] = useState(null);

  const [confirmAction, setConfirmAction] = useState(null);
  // confirmAction = { type: "create" | "update" | "delete", payload?: any }

  /* =========================
     Load Majors
     ========================= */
  const loadMajors = async () => {
    setLoading(true);
    try {
      const res = await getAllMajors();
      setMajors(res?.data || []);
    } catch {
      toast.error("Failed to load majors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMajors();
  }, []);

  /* =========================
     Open Edit Modal
     ========================= */
  const openEdit = (major) => {
    setEditingMajor({
      majorId: major.majorId,
      majorCode: major.majorCode,
      majorName: major.majorName,
      isActive: major.isActive,
    });
    setShowEditModal(true);
  };

  /* =========================
     Confirm Action Handler
     ========================= */
  const handleConfirm = async () => {
    try {
      if (confirmAction.type === "create") {
        await createMajor(newMajor);
        toast.success("Major created successfully!");
        setNewMajor({ majorCode: "", majorName: "" });
        setShowAddModal(false);
      }

      if (confirmAction.type === "update") {
        await updateMajor(editingMajor);
        toast.success("Updated successfully!");
        setEditingMajor(null);
        setShowEditModal(false);
      }

      if (confirmAction.type === "delete") {
        await deleteMajor(confirmAction.payload);
        toast.success("Deleted successfully!");
      }

      loadMajors();
    } catch {
      toast.error("Action failed");
    } finally {
      setConfirmAction(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Major Management
      </h2>

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 mb-4"
      >
        Add New Major
      </button>

      {/* ================= ADD MODAL ================= */}
      {showAddModal && (
        <ModalWrapper>
          <h3 className="text-xl font-semibold mb-4 text-orange-600">
            Add New Major
          </h3>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Major Code"
              value={newMajor.majorCode}
              onChange={(e) =>
                setNewMajor({ ...newMajor, majorCode: e.target.value })
              }
              className="border p-2 rounded-lg"
            />

            <input
              type="text"
              placeholder="Major Name"
              value={newMajor.majorName}
              onChange={(e) =>
                setNewMajor({ ...newMajor, majorName: e.target.value })
              }
              className="border p-2 rounded-lg"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setConfirmAction({ type: "create" })}
                className="bg-green-600 text-white px-5 py-2 rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* ================= EDIT MODAL ================= */}
      {showEditModal && editingMajor && (
        <ModalWrapper>
          <h3 className="text-xl font-semibold mb-4 text-blue-600">
            Update Major
          </h3>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={editingMajor.majorCode}
              onChange={(e) =>
                setEditingMajor({
                  ...editingMajor,
                  majorCode: e.target.value,
                })
              }
              className="border p-2 rounded-lg"
            />

            <input
              type="text"
              value={editingMajor.majorName}
              onChange={(e) =>
                setEditingMajor({
                  ...editingMajor,
                  majorName: e.target.value,
                })
              }
              className="border p-2 rounded-lg"
            />

            <select
              value={editingMajor.isActive}
              onChange={(e) =>
                setEditingMajor({
                  ...editingMajor,
                  isActive: e.target.value === "true",
                })
              }
              className="border p-2 rounded-lg"
            >
              <option value="true">Active</option>
              <option value="false">Deactive</option>
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setConfirmAction({ type: "update" })}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMajor(null);
                }}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* ================= CONFIRM MODAL ================= */}
      {confirmAction && (
        <ModalWrapper>
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Are you sure?
          </h3>

          <p className="mb-6">This action cannot be undone.</p>

          <div className="flex justify-end gap-3">
            <button
              className="bg-gray-400 text-white px-5 py-2 rounded-lg"
              onClick={() => setConfirmAction(null)}
            >
              Cancel
            </button>

            <button
              className="bg-red-600 text-white px-5 py-2 rounded-lg"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-50">
              <th className="p-3 text-left border-b">Code</th>
              <th className="p-3 text-left border-b">Name</th>
              <th className="p-3 text-left border-b w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : majors.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4">
                  No majors available
                </td>
              </tr>
            ) : (
              majors.map((item) => (
                <tr
                  key={item.majorId}
                  className="border-b hover:bg-orange-50"
                >
                  <td className="p-3">{item.majorCode}</td>
                  <td className="p-3">{item.majorName}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        setConfirmAction({
                          type: "delete",
                          payload: item.majorId,
                        })
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
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
