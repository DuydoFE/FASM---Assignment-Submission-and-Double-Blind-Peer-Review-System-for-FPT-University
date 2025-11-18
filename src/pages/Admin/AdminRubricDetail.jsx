import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    getCriteriaTemplatesByTemplateId,
    createCriteriaTemplate,
    updateCriteriaTemplate,
    deleteCriteriaTemplate,
} from "../../service/adminService";

export default function AdminRubricDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [rubric, setRubric] = useState(null);
    const [loading, setLoading] = useState(true);

    // CRUD state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentCriteria, setCurrentCriteria] = useState(null);
    const [criteriaForm, setCriteriaForm] = useState({
        title: "",
        description: "",
        weight: 0,
        maxScore: 0,
        scoringType: "Scale",
        scoreLabel: "0-10",
    });

    // Load rubric + criteria
    useEffect(() => {
        const fetchRubric = async () => {
            try {
                const res = await getCriteriaTemplatesByTemplateId(id);

                if (res?.statusCode === 200) {
                    // Lấy templateTitle từ data đầu tiên nếu có, hoặc tạo mặc định
                    const templateTitle = res.data?.[0]?.templateTitle || "Untitled Rubric";
                    setRubric({
                        templateId: Number(id),
                        title: templateTitle,
                        criteriaTemplates: Array.isArray(res.data) ? res.data : [],
                    });
                } else if (res?.statusCode === 404) {
                    toast.error("Rubric not found");
                } else {
                    toast.error(res?.message || "Failed to load rubric details");
                }
            } catch (err) {
                console.error(err);
                toast.error("Server error fetching rubric details");
            } finally {
                setLoading(false);
            }
        };

        fetchRubric();
    }, [id]);

    // Reload criteria list
    const reloadCriteria = async () => {
        try {
            const res = await getCriteriaTemplatesByTemplateId(id);
            if (res?.statusCode === 200 && Array.isArray(res.data)) {
                setRubric({
                    templateId: res.data[0].templateId,
                    title: res.data[0].templateTitle,
                    criteriaTemplates: res.data,
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Create Criteria
    const handleCreateCriteria = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...criteriaForm, templateId: rubric.templateId };
            const res = await createCriteriaTemplate(payload);
            if (res?.statusCode === 201 || res?.statusCode === 200) {
                toast.success("Criteria created successfully");
                setShowCreateModal(false);
                setCriteriaForm({ title: "", description: "", weight: 0, maxScore: 0, scoringType: "Scale", scoreLabel: "0-10" });

                // Cập nhật state trực tiếp để UI phản ánh ngay
                setRubric((prev) => ({
                    ...prev,
                    criteriaTemplates: [...prev.criteriaTemplates, res.data],
                }));
            } else {
                toast.error(res?.message || "Failed to create criteria");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error creating criteria");
        }
    };

    // Edit Criteria
    const openEditModal = (criteria) => {
        setCurrentCriteria(criteria);
        setCriteriaForm({
            title: criteria.title,
            description: criteria.description,
            weight: criteria.weight,
            maxScore: criteria.maxScore,
            scoringType: criteria.scoringType || "Scale",
            scoreLabel: criteria.scoreLabel || "0-10",
        });
        setShowEditModal(true);
    };

    const handleUpdateCriteria = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                criteriaTemplateId: currentCriteria.criteriaTemplateId,
                templateId: rubric.templateId,
                ...criteriaForm,
            };
            const res = await updateCriteriaTemplate(payload);
            if (res?.statusCode === 200) {
                toast.success("Criteria updated successfully");
                setShowEditModal(false);

                // Cập nhật state trực tiếp
                setRubric((prev) => ({
                    ...prev,
                    criteriaTemplates: prev.criteriaTemplates.map((c) =>
                        c.criteriaTemplateId === currentCriteria.criteriaTemplateId ? { ...c, ...criteriaForm } : c
                    ),
                }));
            } else {
                toast.error(res?.message || "Failed to update criteria");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error updating criteria");
        }
    };

    // Delete Criteria
    const handleDeleteCriteria = async (criteriaId) => {
        if (!window.confirm("Are you sure to delete this criteria?")) return;
        try {
            const res = await deleteCriteriaTemplate(criteriaId);
            if (res?.statusCode === 200) {
                toast.success("Criteria deleted successfully");

                // Cập nhật state trực tiếp
                setRubric((prev) => ({
                    ...prev,
                    criteriaTemplates: prev.criteriaTemplates.filter(c => c.criteriaTemplateId !== criteriaId),
                }));
            } else {
                toast.error(res?.message || "Failed to delete criteria");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error deleting criteria");
        }
    };

    if (loading) return <p className="p-4 text-center text-gray-500">Loading...</p>;
    if (!rubric) return <p className="p-4 text-center text-gray-500">No rubric found</p>;

    return (
        <div className="space-y-6 p-6">
            <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <h2 className="text-3xl font-bold text-orange-500">{rubric.title}</h2>

            <div className="mt-6 flex justify-between items-center">
                <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Criteria</h3>
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Add Criteria
                </button>
            </div>

            {rubric.criteriaTemplates && rubric.criteriaTemplates.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-orange-100 text-left">
                            <tr>
                                <th className="p-3">Title</th>
                                <th className="p-3">Max Score</th>
                                <th className="p-3">Weight</th>
                                <th className="p-3">Scoring Type</th>
                                <th className="p-3">Description</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rubric.criteriaTemplates.map((c, idx) => (
                                <tr key={c.criteriaTemplateId} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="p-3 font-medium">{c.title}</td>
                                    <td className="p-3 text-center">{c.maxScore}</td>
                                    <td className="p-3 text-center">{c.weight}%</td>
                                    <td className="p-3 text-center">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                            {c.scoringType} ({c.scoreLabel})
                                        </span>
                                    </td>
                                    <td className="p-3">{c.description}</td>
                                    <td className="p-3 space-x-2">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => openEditModal(c)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => handleDeleteCriteria(c.criteriaTemplateId)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">No criteria available</p>
            )}

            {/* CREATE MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Create New Criteria</h3>
                        <form className="space-y-3" onSubmit={handleCreateCriteria}>
                            <input
                                type="text"
                                required
                                placeholder="Title"
                                className="border rounded p-3 w-full"
                                value={criteriaForm.title}
                                onChange={(e) => setCriteriaForm({ ...criteriaForm, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                className="border rounded p-3 w-full"
                                value={criteriaForm.description}
                                onChange={(e) => setCriteriaForm({ ...criteriaForm, description: e.target.value })}
                            />
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    required
                                    placeholder="Weight"
                                    className="border rounded p-3 w-1/2"
                                    value={criteriaForm.weight}
                                    onChange={(e) => setCriteriaForm({ ...criteriaForm, weight: Number(e.target.value) })}
                                />
                                <input
                                    type="number"
                                    required
                                    placeholder="Max Score"
                                    className="border rounded p-3 w-1/2"
                                    value={criteriaForm.maxScore}
                                    onChange={(e) => setCriteriaForm({ ...criteriaForm, maxScore: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    required
                                    placeholder="Scoring Type"
                                    className="border rounded p-3 w-1/2"
                                    value={criteriaForm.scoringType}
                                    onChange={(e) => setCriteriaForm({ ...criteriaForm, scoringType: e.target.value })}
                                />
                                <input
                                    type="text"
                                    required
                                    placeholder="Score Label"
                                    className="border rounded p-3 w-1/2"
                                    value={criteriaForm.scoreLabel}
                                    onChange={(e) => setCriteriaForm({ ...criteriaForm, scoreLabel: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" className="px-4 py-2 border rounded" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Edit Criteria</h3>
                        <form className="space-y-3" onSubmit={handleUpdateCriteria}>
                            <input
                                type="text"
                                required
                                placeholder="Title"
                                className="border rounded p-3 w-full"
                                value={criteriaForm.title}
                                onChange={(e) => setCriteriaForm({ ...criteriaForm, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                className="border rounded p-3 w-full"
                                value={criteriaForm.description}
                                onChange={(e) => setCriteriaForm({ ...criteriaForm, description: e.target.value })}
                            />
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    required
                                    placeholder="Weight"
                                    className="border rounded p-3 w-1/2"
                                    value={criteriaForm.weight}
                                    onChange={(e) => setCriteriaForm({ ...criteriaForm, weight: Number(e.target.value) })}
                                />
                                <input
                                    type="number"
                                    required
                                    placeholder="Max Score"
                                    className="border rounded p-3 w-1/2"
                                    value={criteriaForm.maxScore}
                                    onChange={(e) => setCriteriaForm({ ...criteriaForm, maxScore: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    required
                                    placeholder="Scoring Type"
                                    className="border rounded p-3 w-1/2"
                                    value={criteriaForm.scoringType}
                                    onChange={(e) => setCriteriaForm({ ...criteriaForm, scoringType: e.target.value })}
                                />
                                <input
                                    type="text"
                                    required
                                    placeholder="Score Label"
                                    className="border rounded p-3 w-1/2"
                                    value={criteriaForm.scoreLabel}
                                    onChange={(e) => setCriteriaForm({ ...criteriaForm, scoreLabel: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" className="px-4 py-2 border rounded" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
