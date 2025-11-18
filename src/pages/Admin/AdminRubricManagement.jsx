import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getAllRubricTemplates,
  createRubricTemplate,
  updateRubricTemplate,
  deleteRubricTemplate,
} from "../../service/adminService";

export default function AdminRubricManagement() {
  const navigate = useNavigate();
  const [rubrics, setRubrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRubric, setCurrentRubric] = useState(null);
  const [newRubric, setNewRubric] = useState({ title: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadRubrics();
  }, []);

  const loadRubrics = async () => {
    setLoading(true);
    try {
      const res = await getAllRubricTemplates();
      if (res?.statusCode === 200 && Array.isArray(res.data)) {
        const mapped = res.data.map((r) => ({
          id: r.templateId,
          title: r.title,
          criteria: r.criteriaTemplates?.map((c) => c.title).join(", ") || "-",
          assignmentsUsing: r.assignmentsUsingTemplate?.length || 0,
          createdBy: r.createdByUserName,
          createdAt: new Date(r.createdAt).toLocaleString(),
        }));
        setRubrics(mapped);
      } else {
        toast.error(res?.message || "Failed to load rubrics");
      }
    } catch (err) {
      toast.error("Failed to load rubrics from server");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRubric = async (e) => {
    e.preventDefault();
    if (!newRubric.title.trim()) {
      toast.error("Please enter a title.");
      return;
    }

    try {
      const payload = {
        title: newRubric.title,
        isPublic: true,
        createdByUserId: 1,
      };

      const res = await createRubricTemplate(payload);

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        toast.success("Rubric created successfully!");
        setShowCreateModal(false);
        setNewRubric({ title: "" });
        await loadRubrics();
      } else {
        toast.error(res?.message || "Failed to create rubric");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Server error creating rubric");
    }
  };

  const handleDeleteRubric = async (id) => {
    try {
      const res = await deleteRubricTemplate(id);
      if (res?.statusCode === 200) {
        toast.success("Rubric deleted!");
        setRubrics(rubrics.filter((r) => r.id !== id));
      } else {
        toast.error(res?.message || "Failed to delete rubric");
      }
    } catch (err) {
      toast.error("Server error deleting rubric");
    }
  };

  const openEditModal = (rubric) => {
    setCurrentRubric(rubric);
    setNewRubric({ title: rubric.title });
    setShowEditModal(true);
  };

  const handleUpdateRubric = async (e) => {
    e.preventDefault();
    if (!newRubric.title.trim()) {
      toast.error("Please enter a title.");
      return;
    }

    try {
      const payload = { templateId: currentRubric.id, title: newRubric.title };
      const res = await updateRubricTemplate(payload);
      if (res?.statusCode === 200) {
        toast.success("Rubric updated!");
        setShowEditModal(false);
        await loadRubrics();
      } else {
        toast.error(res?.message || "Failed to update rubric");
      }
    } catch (err) {
      toast.error("Server error updating rubric");
    }
  };

  const filteredRubrics = rubrics.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
        📋 Rubric Management
      </h2>

      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search rubrics..."
          className="border rounded p-2 flex-1 min-w-[200px] focus:outline-orange-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-medium"
        >
          + Add Rubric
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        {loading ? (
          <p className="p-4 text-center text-gray-500">Loading rubrics...</p>
        ) : filteredRubrics.length > 0 ? (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRubrics.map((r, idx) => (
                <tr
                  key={r.id}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                >
                  <td className="p-3">{r.id}</td>
                  <td className="p-3 font-medium">{r.title}</td>
                  <td className="p-3 space-x-2">
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() =>
                        (navigate(`/admin/rubrics/${r.id}`))
                      }
                    >
                      View
                    </button>
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => openEditModal(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteRubric(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-center text-gray-500">No rubrics found</p>
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              Create New Rubric
            </h3>
            <form className="space-y-3" onSubmit={handleCreateRubric}>
              <input
                type="text"
                required
                value={newRubric.title}
                onChange={(e) => setNewRubric({ title: e.target.value })}
                placeholder="Rubric Title"
                className="border rounded p-3 w-full"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowCreateModal(false)}
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

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              Edit Rubric
            </h3>
            <form className="space-y-3" onSubmit={handleUpdateRubric}>
              <input
                type="text"
                required
                value={newRubric.title}
                onChange={(e) => setNewRubric({ title: e.target.value })}
                placeholder="Rubric Title"
                className="border rounded p-3 w-full"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
