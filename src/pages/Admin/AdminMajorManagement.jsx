import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  getAllMajors,
  createMajor,
  updateMajor,
  deleteMajor,
} from "../../service/adminService";

export default function AdminMajorManagement() {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMajor, setNewMajor] = useState({
    majorCode: "",
    majorName: "",
  });

  const [editingMajor, setEditingMajor] = useState(null);

  // ------------------------------------------------------------
  // Load Majors
  // ------------------------------------------------------------
  const loadMajors = async () => {
    setLoading(true);
    try {
      const res = await getAllMajors();
      setMajors(res?.data || []);
    } catch (err) {
      toast.error("Failed to load majors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMajors();
  }, []);

  // ------------------------------------------------------------
  // Create Major
  // ------------------------------------------------------------
  const handleCreateMajor = async () => {
    if (!newMajor.majorCode.trim() || !newMajor.majorName.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    const toastId = toast.loading("Creating major...");

    try {
      await createMajor(newMajor);
      toast.success("Major created successfully!", { id: toastId });

      setNewMajor({ majorCode: "", majorName: "" });
      setShowAddForm(false);
      loadMajors();
    } catch (err) {
      toast.error("Failed to create major", { id: toastId });
    }
  };

  // ------------------------------------------------------------
  // Open Edit Form
  // ------------------------------------------------------------
  const openEdit = (major) => {
    setEditingMajor({
      majorId: major.majorId,
      majorCode: major.majorCode,
      majorName: major.majorName,
      isActive: major.isActive,
    });
  };

  // ------------------------------------------------------------
  // Update Major
  // ------------------------------------------------------------
  const handleUpdateMajor = () => {
    toast(
      (t) => (
        <div>
          <p className="font-semibold mb-2">Are you sure you want to make this change?</p>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={async () => {
                toast.dismiss(t.id);

                const toastId = toast.loading("Updating major...");
                try {
                  await updateMajor(editingMajor);
                  toast.success("Updated successfully!", { id: toastId });
                  setEditingMajor(null);
                  loadMajors();
                } catch {
                  toast.error("Update failed", { id: toastId });
                }
              }}
            >
              Yes
            </button>

            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  // ------------------------------------------------------------
  // Delete Major
  // ------------------------------------------------------------
  const handleDeleteMajor = (id) => {
    toast(
      (t) => (
        <div>
          <p className="font-semibold">Are you sure you want to delete?</p>

          <div className="flex gap-3 mt-3">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
              onClick={async () => {
                toast.dismiss(t.id);

                const toastId = toast.loading("Deleting...");

                try {
                  await deleteMajor(id);
                  toast.success("Deleted successfully!", { id: toastId });
                  loadMajors();
                } catch {
                  toast.error("Delete failed", { id: toastId });
                }
              }}
            >
              Yes
            </button>

            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  // ------------------------------------------------------------

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-bold mb-6 text-orange-600">Major Management</h2>

      {/* Add Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 shadow-sm mb-4"
      >
        Add New Major
      </button>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-300 rounded-xl bg-orange-50">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Major Code"
              value={newMajor.majorCode}
              onChange={(e) =>
                setNewMajor({ ...newMajor, majorCode: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg"
            />

            <input
              type="text"
              placeholder="Major Name"
              value={newMajor.majorName}
              onChange={(e) =>
                setNewMajor({ ...newMajor, majorName: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg"
            />

            <div className="flex gap-3 mt-2">
              <button
                onClick={handleCreateMajor}
                className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700"
              >
                Save
              </button>

              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editingMajor && (
        <div className="mb-6 p-4 border border-gray-300 rounded-xl bg-blue-50">
          <h3 className="text-xl font-semibold mb-3 text-blue-700">Update Major</h3>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={editingMajor.majorCode}
              onChange={(e) =>
                setEditingMajor({ ...editingMajor, majorCode: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg"
            />

            <input
              type="text"
              value={editingMajor.majorName}
              onChange={(e) =>
                setEditingMajor({ ...editingMajor, majorName: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg"
            />

            <select
              value={editingMajor.isActive}
              onChange={(e) =>
                setEditingMajor({
                  ...editingMajor,
                  isActive: e.target.value === "true",
                })
              }
              className="border border-gray-300 p-2 rounded-lg"
            >
              <option value="true">Active</option>
              <option value="false">Deactive</option>
            </select>

            <div className="flex gap-3 mt-2">
              <button
                onClick={handleUpdateMajor}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>

              <button
                onClick={() => setEditingMajor(null)}
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-50">
              <th className="p-3 text-left border-b font-semibold text-gray-700">
                Code
              </th>
              <th className="p-3 text-left border-b font-semibold text-gray-700">
                Name
              </th>
              <th className="p-3 text-left border-b font-semibold w-40">
                Actions
              </th>
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
                <tr key={item.majorId} className="border-b hover:bg-orange-50">
                  <td className="p-3">{item.majorCode}</td>
                  <td className="p-3">{item.majorName}</td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteMajor(item.majorId)}
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
