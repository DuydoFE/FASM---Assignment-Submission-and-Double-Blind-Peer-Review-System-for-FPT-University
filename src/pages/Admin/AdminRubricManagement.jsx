import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  getAllMajors,
  getAllRubricTemplates,
  createRubricTemplate,
  updateRubricTemplate,
  deleteRubricTemplate,
} from "../../service/adminService";

export default function AdminRubricManagement() {
  const navigate = useNavigate();
  const [rubrics, setRubrics] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRubric, setCurrentRubric] = useState(null);
  const [newRubric, setNewRubric] = useState({ title: "", majorId: 0, isPublic: true });
  const [search, setSearch] = useState("");
  const [selectedMajorId, setSelectedMajorId] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadMajors();
        await loadRubrics();
      } catch (err) { }
    };
    fetchData();
  }, []);

  const loadMajors = async () => {
    try {
      const res = await getAllMajors();
      if (res?.statusCode === 200 && Array.isArray(res.data)) {
        setMajors(res.data);
      } else {
        toast.error(res?.message || "Failed to load majors.");
      }
    } catch (err) {
      toast.error("Server error loading majors.");
    }
  };

  const loadRubrics = async () => {
    setLoading(true);
    try {
      const res = await getAllRubricTemplates();
      if (res?.statusCode === 200 && Array.isArray(res.data)) {
        const mapped = res.data.map((r) => {
          const major = majors.find((m) => m.majorId === r.majorId);
          return {
            id: r.templateId,
            title: r.title,
            majorId: r.majorId,
            majorName: r.majorName || major?.majorName || "-",
            criteria: r.criteriaTemplates?.map((c) => c.title).join(", ") || "-",
            criteriaCount: r.criteriaTemplates?.length || 0,
            assignmentsUsing: r.assignmentsUsingTemplate?.length || 0,
            createdBy: r.createdByUserName,
            createdAt: new Date(r.createdAt).toLocaleString(),
            isPublic: r.isPublic,
          };
        });
        setRubrics(mapped);
      } else {
        toast.error(res?.message || "Failed to load rubrics.");
      }
    } catch (err) {
      toast.error("Failed to load rubrics from server.");
    } finally {
      setLoading(false);
    }
  };

  const isChanged =
    currentRubric &&
    (newRubric.title !== currentRubric.title ||
      newRubric.majorId !== currentRubric.majorId ||
      newRubric.isPublic !== currentRubric.isPublic);

  const getApiMessage = (res, defaultMsg = "Operation failed") => {
    return res?.message || defaultMsg;
  };

  const handleCreateRubric = async (e) => {
    e.preventDefault();
    if (!newRubric.title.trim()) {
      toast.error("Please enter a title."); // Vẫn giữ validation FE
      return;
    }
    if (!newRubric.majorId) {
      toast.error("Please select a major.");
      return;
    }

    try {
      const payload = {
        title: newRubric.title,
        majorId: newRubric.majorId,
        createdByUserId: 1,
      };
      const res = await createRubricTemplate(payload);

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        toast.success(getApiMessage(res, "Rubric created successfully!"));
        setShowCreateModal(false);
        setNewRubric({ title: "", majorId: 0, isPublic: true });
        await loadRubrics();
      } else {
        toast.error(getApiMessage(res, "Failed to create rubric."));
      }
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Server error creating rubric.");
    }
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
        toast.success(getApiMessage(res, "Rubric updated successfully!"));
        setShowEditModal(false);
        await loadRubrics();
      } else {
        toast.error(getApiMessage(res, "Failed to update rubric."));
      }
    } catch (err) {
      toast.error("Server error updating rubric.");
    }
  };

  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteRubric = async (id) => {
    const rubric = rubrics.find((r) => r.id === id);
    setDeleteTarget(rubric);
  };

  const confirmDeleteRubric = async () => {
    if (!deleteTarget) return;

    try {
      const res = await deleteRubricTemplate(deleteTarget.id);
      if (res?.statusCode === 200) {
        toast.success(getApiMessage(res, "Rubric deleted successfully!"));
        setRubrics(rubrics.filter((r) => r.id !== deleteTarget.id));
      } else {
        toast.error(getApiMessage(res, "Failed to delete rubric."));
      }
    } catch (err) {
      toast.error("Server error deleting rubric.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const cancelDeleteRubric = () => setDeleteTarget(null);

  const openEditModal = (rubric) => {
    setCurrentRubric(rubric);
    setNewRubric({ title: rubric.title, majorId: rubric.majorId, isPublic: rubric.isPublic });
    setShowEditModal(true);
  };

  const filteredRubrics = rubrics.filter(
    (r) =>
      (selectedMajorId === 0 || r.majorId === selectedMajorId) &&
      r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Toaster position="top-right" reverseOrder={false} /> {/* Toast container */}
      <h2 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
        📋 Rubric Management
      </h2>

      {/* Search + Major Filter + Add button */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search rubrics..."
          className="border rounded p-2 flex-1 min-w-[200px] focus:outline-orange-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded p-2 min-w-[180px]"
          value={selectedMajorId}
          onChange={(e) => setSelectedMajorId(Number(e.target.value))}
        >
          <option value={0}>-- Select Major --</option>
          {majors.map((m) => (
            <option key={m.majorId} value={m.majorId}>
              {m.majorName}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-medium"
        >
          + Add Rubric
        </button>
      </div>

      {/* Rubrics table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        {selectedMajorId === 0 ? (
          <p className="p-4 text-center text-gray-500">Please select a major to view rubrics.</p>
        ) : loading ? (
          <p className="p-4 text-center text-gray-500">Loading rubrics...</p>
        ) : filteredRubrics.length > 0 ? (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Major</th>
                <th className="p-3 text-left"># Criteria</th>
                <th className="p-3 text-left">Assignments Using</th>
                <th className="p-3 text-left">Public</th> {/* NEW */}
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRubrics.map((r, idx) => (
                <tr
                  key={r.id}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="p-3 font-medium">{r.title}</td>
                  <td className="p-3">{r.majorName}</td>
                  <td className="p-3">{r.criteriaCount}</td>
                  <td className="p-3">{r.assignmentsUsing}</td>
                  <td className="p-3 text-center">
                    {r.isPublic ? (
                      <span className="text-green-600 font-bold">✅</span>
                    ) : (
                      <span className="text-red-600 font-bold">❌</span>
                    )}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() => navigate(`/admin/rubrics/${r.id}`)}
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
          <p className="p-4 text-center text-gray-500">No rubrics found for this major.</p>
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Create New Rubric</h3>
            <form className="space-y-3" onSubmit={handleCreateRubric}>
              {/* Title */}
              <label className="block font-medium">Rubric Title</label>
              <input
                type="text"
                required
                value={newRubric.title}
                onChange={(e) => setNewRubric({ ...newRubric, title: e.target.value })}
                placeholder="Rubric Title"
                className="border rounded p-3 w-full"
              />

              {/* Major Dropdown */}
              <label className="block font-medium mt-2">Major</label>
              <select
                required
                value={newRubric.majorId}
                onChange={(e) =>
                  setNewRubric({ ...newRubric, majorId: Number(e.target.value) })
                }
                className="border rounded p-3 w-full"
              >
                <option value={0}>Select Major</option>
                {majors.map((m) => (
                  <option key={m.majorId} value={m.majorId}>
                    {m.majorName}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowCreateModal(false)}
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

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Edit Rubric</h3>
            <form className="space-y-3" onSubmit={handleUpdateRubric}>
              {/* Title */}
              <label className="block font-medium">Rubric Title</label>
              <input
                type="text"
                required
                value={newRubric.title}
                onChange={(e) => setNewRubric({ ...newRubric, title: e.target.value })}
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
                  className={`px-4 py-2 text-white rounded ${isChanged ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                    }`}
                  disabled={!isChanged}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete <span className="font-bold">{deleteTarget.title}</span>?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={cancelDeleteRubric}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteRubric}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
