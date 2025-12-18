import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  getAllMajors,
  createMajor,
  updateMajor,
  deleteMajor,
} from "../../service/adminService";

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
  const [originalMajor, setOriginalMajor] = useState(null);

  const [confirmAction, setConfirmAction] = useState(null);
  const validateNewMajor = () => {
    if (!newMajor.majorCode.trim()) {
      toast.error("Major Code is required");
      return false;
    }

    if (!newMajor.majorName.trim()) {
      toast.error("Major Name is required");
      return false;
    }

    return true;
  };
  const isAddFormInvalid =
    !newMajor.majorCode.trim() || !newMajor.majorName.trim();

  const loadMajors = async () => {
    setLoading(true);
    try {
      const res = await getAllMajors();
      setMajors(res?.data || []);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to load majors";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMajors();
  }, []);

  const openEdit = (major) => {
    const majorCopy = {
      majorId: major.majorId,
      majorCode: major.majorCode,
      majorName: major.majorName,
      isActive: major.isActive,
    };
    setEditingMajor(majorCopy);
    setOriginalMajor(majorCopy);
    setShowEditModal(true);
  };

  const isUnchanged =
    editingMajor &&
    originalMajor &&
    editingMajor.majorCode === originalMajor.majorCode &&
    editingMajor.majorName === originalMajor.majorName &&
    editingMajor.isActive === originalMajor.isActive;


  const getMessageFromResponse = (res) => {
    return (
      res?.data?.message ||
      res?.data?.data?.message ||
      res?.message ||
      ""
    );
  };

  const handleConfirm = async () => {
    try {
      let res;

      if (confirmAction.type === "create") {
        res = await createMajor(newMajor);
        toast.success(getMessageFromResponse(res));
        setNewMajor({ majorCode: "", majorName: "" });
        setShowAddModal(false);
      }

      if (confirmAction.type === "update") {
        res = await updateMajor(editingMajor);
        toast.success(getMessageFromResponse(res));
        setEditingMajor(null);
        setOriginalMajor(null);
        setShowEditModal(false);
      }

      if (confirmAction.type === "delete") {
        res = await deleteMajor(confirmAction.payload);
        toast.success(getMessageFromResponse(res));
      }

      await loadMajors();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.data?.message ||
        error?.message ||
        "Action failed";
      toast.error(errorMessage);
    } finally {
      setConfirmAction(null);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-bold mb-2 text-orange-600">
        Major Management
      </h2>

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="px-6 py-3 rounded-xl font-semibold transition-all bg-[#F36F21] text-white shadow-md shadow-orange-200 hover:bg-[#D95C18] hover:-translate-y-0.5 mb-2"
      >
        + Create Major
      </button>

      {/* ================= ADD MODAL ================= */}
      {showAddModal && (
        <ModalWrapper>
          <h3 className="text-xl font-semibold mb-4 text-orange-600">
            Add New Major
          </h3>

          <div className="flex flex-col gap-4">
            <label className="font-medium">Major Code</label>
            <input
              type="text"
              placeholder="Major Code"
              value={newMajor.majorCode}
              onChange={(e) =>
                setNewMajor({ ...newMajor, majorCode: e.target.value })
              }
              className="border p-2 rounded-lg"
            />

            <label className="font-medium">Major Name</label>
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
                disabled={isAddFormInvalid}
                onClick={() => {
                  if (!validateNewMajor()) return;
                  setConfirmAction({ type: "create" });
                }}
                className={`px-5 py-2 rounded-lg text-white ${isAddFormInvalid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
                  }`}
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
            <label className="font-medium">Major Code</label>
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

            <label className="font-medium">Major Name</label>
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

            <label className="font-medium">Status</label>
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
                className={`px-5 py-2 rounded-lg text-white ${isUnchanged
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
                disabled={isUnchanged}
              >
                Save
              </button>

              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMajor(null);
                  setOriginalMajor(null);
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
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-[#FFF3EB] text-[#F36F21] font-semibold border-b-2 border-[#F36F21]">
            <tr className="border-b hover:bg-orange-50 last:border-b-0">
              <th className="px-4 py-3 text-left border-b">Code</th>
              <th className="px-4 py-3 text-left border-b">Name</th>
              <th className="px-4 py-3 text-center border-b">Actions</th>
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
                  <td className="px-4 py-3">{item.majorCode}</td>
                  <td className="px-4 py-3">{item.majorName}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => openEdit(item)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5"
                      >
                        Update
                      </button>

                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "delete",
                            payload: item.majorId,
                          })
                        }
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
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
