import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAllRubricTemplates } from "../../service/adminService";

export default function AdminRubricManagement() {
  const [rubrics, setRubrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRubric, setNewRubric] = useState({ title: "", description: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRubrics = async () => {
      setLoading(true);
      try {
        const res = await getAllRubricTemplates();
        console.log("API response:", res);
        if (res?.statusCode === 200 && Array.isArray(res.data)) {
          const mapped = res.data.map((r) => ({
            id: r.templateId,
            title: r.title,
            criteria: r.criteriaTemplates?.map(c => c.title).join(", ") || "-",
            assignmentsUsing: r.assignmentsUsingTemplate?.length || 0,
            createdBy: r.createdByUserName,
            createdAt: new Date(r.createdAt).toLocaleString(),
          }));
          setRubrics(mapped);
        } else {
          toast.error(res?.message || "Failed to load rubrics");
        }
      } catch (err) {
        console.error("❌ Fetch rubrics error:", err);
        toast.error("Failed to load rubrics from server");
      } finally {
        setLoading(false);
      }
    };

    fetchRubrics();
  }, []);

  const handleCreateRubric = (e) => {
    e.preventDefault();
    if (!newRubric.title.trim()) {
      toast.error("Please enter a title.");
      return;
    }
    const id = rubrics.length > 0 ? rubrics[rubrics.length - 1].id + 1 : 1;
    setRubrics([...rubrics, { id, title: newRubric.title, criteria: newRubric.description }]);
    toast.success("Rubric created successfully!");
    setShowCreateModal(false);
    setNewRubric({ title: "", description: "" });
  };

  const handleDeleteRubric = (id) => {
    setRubrics(rubrics.filter((r) => r.id !== id));
    toast.success("Rubric deleted!");
  };

  const filteredRubrics = rubrics.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.criteria?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500 flex items-center gap-2">📋 Rubric Management</h2>

      {/* Actions & Search */}
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        {loading ? (
          <p className="p-4 text-center text-gray-500">Loading rubrics...</p>
        ) : filteredRubrics.length > 0 ? (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Criteria</th>
                <th className="p-3 text-left">Assignments Using</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRubrics.map((r, idx) => (
                <tr
                  key={r.id}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-colors`}
                >
                  <td className="p-3">{r.id}</td>
                  <td className="p-3 font-medium">{r.title}</td>
                  <td className="p-3">{r.criteria || "-"}</td>
                  <td className="p-3">{r.assignmentsUsing}</td>
                  <td className="p-3 space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
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

      {/* CREATE Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg animate-slide-down">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Create New Rubric</h3>
            <form className="space-y-3" onSubmit={handleCreateRubric}>
              <input
                type="text"
                required
                value={newRubric.title}
                onChange={(e) => setNewRubric({ ...newRubric, title: e.target.value })}
                placeholder="Rubric Title"
                className="border rounded p-3 w-full focus:outline-orange-500 focus:ring-1 focus:ring-orange-300"
              />
              <textarea
                value={newRubric.description}
                onChange={(e) => setNewRubric({ ...newRubric, description: e.target.value })}
                placeholder="Rubric Description"
                className="border rounded p-3 w-full h-24 focus:outline-orange-500 focus:ring-1 focus:ring-orange-300"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-medium"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
