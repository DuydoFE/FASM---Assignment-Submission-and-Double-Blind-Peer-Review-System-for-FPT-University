import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
    getRubricTemplateById,
    createCriteriaTemplate,
    updateCriteriaTemplate,
    deleteCriteriaTemplate,
    toggleRubricTemplatePublicStatus,
} from "../../service/adminService";

export default function AdminRubricDetail() {

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingToggle, setPendingToggle] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [rubric, setRubric] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentCriteria, setCurrentCriteria] = useState(null);
    const [criteriaForm, setCriteriaForm] = useState({
        title: "",
        description: "",
        weight: 0,
        maxScore: 10,
        scoringType: "Scale",
        scoreLabel: "0-10",
    });
    const [confirmConfig, setConfirmConfig] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: null,
    });

    const fetchRubric = async () => {
        try {
            const res = await getRubricTemplateById(id);

            if (res?.statusCode === 200 || res?.statusCode === 100) {
                setRubric(prev => ({
                    ...prev,
                    templateId: res.data.templateId,
                    title: res.data.title,
                    isPublic: res.data.isPublic,
                    criteriaTemplates: res.data.criteriaTemplates || [],
                }));
                setLoading(false);
            } else {
                toast.error(res?.message || "Failed to load rubric details");
            }
        } catch (err) {
            toast.error("Server error fetching rubric details");
        }
    };

    useEffect(() => {
        fetchRubric();
    }, [id]);

    const usedWeight = useMemo(() => {
        return (rubric?.criteriaTemplates || []).reduce((s, it) => s + (Number(it.weight) || 0), 0);
    }, [rubric]);

    const availableWeight = Math.max(0, 100 - usedWeight);

    const reloadCriteria = async () => {
        try {
            const res = await getRubricTemplateById(id);
            if (res?.statusCode === 200) {
                setRubric(prev => ({
                    ...prev,
                    templateId: res.data.templateId,
                    title: res.data.title,
                    isPublic: res.data.isPublic,
                    criteriaTemplates: res.data.criteriaTemplates || [],
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateCriteria = async (e) => {
        e.preventDefault();

        if (criteriaForm.maxScore < 0 || criteriaForm.maxScore > 10) {
            toast.error("Max Score must be between 0 and 10");
            return;
        }

        if (criteriaForm.weight < 0 || criteriaForm.weight > availableWeight) {
            toast.error(`Weight must be between 0 and ${availableWeight}`);
            return;
        }

        try {
            const payload = { ...criteriaForm, templateId: rubric.templateId, maxScore: 10 };
            const res = await createCriteriaTemplate(payload);
            if (res?.statusCode === 201 || res?.statusCode === 200) {
                toast.success("Criteria created successfully");
                setShowCreateModal(false);
                setCriteriaForm({ title: "", description: "", weight: 0, maxScore: 0, scoringType: "Scale", scoreLabel: "0-10" });

                setRubric((prev) => ({
                    ...prev,
                    criteriaTemplates: [...(prev.criteriaTemplates || []), res.data],
                }));
            } else {
                toast.error(res?.message || "Failed to create criteria");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error creating criteria");
        }
    };

    const openEditModal = (criteria) => {
        setCurrentCriteria(criteria);
        setCriteriaForm({
            title: criteria.title || "",
            description: criteria.description || "",
            weight: criteria.weight || 0,
            maxScore: criteria.maxScore || 0,
            scoringType: criteria.scoringType || "Scale",
            scoreLabel:
                criteria.scoreLabel ||
                (criteria.scoringType === "Pass/Not Pass" ? "Pass-Not Pass" : "0-10"),
        });
        setShowEditModal(true);
    };

    const handleUpdateCriteria = (e) => {
        e.preventDefault();

        setConfirmConfig({
            open: true,
            title: "Save Changes",
            message: "Are you sure you want to save these changes?",
            onConfirm: async () => {
                await confirmUpdateCriteria();
                setConfirmConfig({ open: false });
            },
        });
    };

    const handleDeleteCriteria = (criteriaId) => {
        setConfirmConfig({
            open: true,
            title: "Delete Criteria",
            message: "Are you sure you want to delete this criteria?",
            onConfirm: async () => {
                try {
                    const res = await deleteCriteriaTemplate(criteriaId);
                    if (res?.statusCode === 200) {
                        toast.success("Criteria deleted successfully");
                        setRubric((prev) => ({
                            ...prev,
                            criteriaTemplates: prev.criteriaTemplates.filter(
                                (c) => c.criteriaTemplateId !== criteriaId
                            ),
                        }));
                    } else {
                        toast.error(res?.message || "Failed to delete criteria");
                    }
                } catch (err) {
                    toast.error("Server error deleting criteria");
                }
                setConfirmConfig({ open: false });
            },
        });
    };

    const confirmUpdateCriteria = async () => {
        const currentWeight = Number(currentCriteria?.weight) || 0;
        const usedWithoutCurrent = Math.max(0, usedWeight - currentWeight);
        const editAvailable = Math.max(0, 100 - usedWithoutCurrent);

        if (criteriaForm.maxScore < 0 || criteriaForm.maxScore > 10) {
            toast.error("Max Score must be between 0 and 10");
            return;
        }

        if (criteriaForm.weight < 0 || criteriaForm.weight > editAvailable) {
            toast.error(`Weight must be between 0 and ${editAvailable}`);
            return;
        }

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
                setRubric((prev) => ({
                    ...prev,
                    criteriaTemplates: prev.criteriaTemplates.map((c) =>
                        c.criteriaTemplateId === currentCriteria.criteriaTemplateId
                            ? { ...c, ...criteriaForm }
                            : c
                    ),
                }));
            } else {
                toast.error(res?.message || "Failed to update criteria");
            }
        } catch (err) {
            toast.error("Server error updating criteria");
        }
    };

    if (loading) return <p className="p-4 text-center text-gray-500">Loading...</p>;
    if (!rubric) return <p className="p-4 text-center text-gray-500">No rubric found</p>;

    return (
        <div className="space-y-6 p-6">
            <Toaster position="top-right" reverseOrder={false} />
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <h2 className="text-3xl font-bold text-orange-500">{rubric.title}</h2>

            <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm 
        ${rubric.isPublic ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                    {rubric.isPublic ? "Public" : "Private"}
                </span>

                <button
                    className={`px-4 py-2 rounded text-white 
    ${rubric.isPublic ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                    onClick={() => {
                        if (!rubric.isPublic && usedWeight < 100) {
                            toast.error("You can only public a rubric when the total weight is exactly 100%.");
                            return;
                        }

                        setPendingToggle({
                            templateId: rubric.templateId,
                            newStatus: !rubric.isPublic
                        });

                        setShowConfirmModal(true);
                    }}
                >
                    {rubric.isPublic ? "Set to Private" : "Set to Public"}
                </button>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <h3 className="text-2xl font-semibold mb-4 border-b pb-2">
                    Criteria
                    <span className="ml-3 text-sm text-gray-600">
                        Available weight: <b className={`ml-1 ${availableWeight > 0 ? "text-green-600" : "text-red-600"}`}>{availableWeight}%</b>
                    </span>
                </h3>

                <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => {
                        if (rubric.isPublic) {
                            toast.error("The rubric is currently PUBLIC, so criteria cannot be added. Please switch it back to PRIVATE first.");
                            return;
                        }
                        if (availableWeight <= 0) {
                            toast.error("No weight available. Please adjust existing criteria before adding new one.");
                            return;
                        }
                        setShowCreateModal(true);
                    }}
                >
                    + Add Criteria
                </button>
            </div>

            {rubric.criteriaTemplates && rubric.criteriaTemplates.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden table-fixed">
                        <thead className="bg-orange-100">
                            <tr>
                                <th className="p-3 w-[20%] text-left">Title</th>
                                <th className="p-3 w-[10%] text-center">Max Score</th>
                                <th className="p-3 w-[10%] text-center">Weight</th>
                                <th className="p-3 w-[40%] text-left">Description</th>
                                <th className="p-3 w-[20%] text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rubric.criteriaTemplates.map((c, idx) => (
                                <tr
                                    key={c.criteriaTemplateId}
                                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="p-3 font-medium break-words">
                                        {c.title}
                                    </td>

                                    <td className="p-3 text-center">
                                        {c.maxScore}
                                    </td>

                                    <td className="p-3 text-center">
                                        {c.weight}%
                                    </td>

                                    <td className="p-3 break-words">
                                        {c.description || "-"}
                                    </td>

                                    <td className="p-3 text-center space-x-3">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => {
                                                if (rubric.isPublic) {
                                                    toast.error("The rubric is currently PUBLIC, so criteria cannot be edited. Please switch it back to PRIVATE first.");
                                                    return;
                                                }
                                                openEditModal(c);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => {
                                                if (rubric.isPublic) {
                                                    toast.error("The rubric is currently PUBLIC, so criteria cannot be deleted. Please switch it back to PRIVATE first.");
                                                    return;
                                                }
                                                handleDeleteCriteria(c.criteriaTemplateId);
                                            }}
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
                        <form className="space-y-4" onSubmit={handleCreateCriteria}>
                            {/* Title */}
                            <div>
                                <label className="font-medium">Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter title"
                                    className="border rounded p-3 w-full mt-1"
                                    value={criteriaForm.title}
                                    onChange={(e) => setCriteriaForm({ ...criteriaForm, title: e.target.value })}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="font-medium">Description</label>
                                <textarea
                                    placeholder="Enter description"
                                    className="border rounded p-3 w-full mt-1"
                                    value={criteriaForm.description}
                                    onChange={(e) => setCriteriaForm({ ...criteriaForm, description: e.target.value })}
                                />
                            </div>

                            {/* Weight + Max Score */}
                            <div className="flex gap-3">
                                <div className="w-1/2">
                                    <label className="font-medium">Weight (%)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Weight"
                                        className="border rounded p-3 w-full mt-1"
                                        min={0}
                                        max={availableWeight}
                                        value={criteriaForm.weight}
                                        onChange={(e) => {
                                            let val = Number(e.target.value);
                                            if (isNaN(val)) val = 0;
                                            if (val > availableWeight) val = availableWeight;
                                            if (val < 0) val = 0;
                                            setCriteriaForm({ ...criteriaForm, weight: val });
                                        }}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">You can use up to <b>{availableWeight}%</b> weight.</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" className="px-4 py-2 border rounded" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
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
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Edit Criteria</h3>
                        <form className="space-y-4" onSubmit={handleUpdateCriteria}>
                            {/* Title */}
                            <div>
                                <label className="font-medium">Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter title"
                                    className="border rounded p-3 w-full mt-1"
                                    value={criteriaForm.title}
                                    onChange={(e) =>
                                        setCriteriaForm({ ...criteriaForm, title: e.target.value })
                                    }
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="font-medium">Description</label>
                                <textarea
                                    placeholder="Enter description"
                                    className="border rounded p-3 w-full mt-1"
                                    value={criteriaForm.description}
                                    onChange={(e) =>
                                        setCriteriaForm({ ...criteriaForm, description: e.target.value })
                                    }
                                />
                            </div>

                            {/* Weight */}
                            <div className="w-1/2">
                                <label className="font-medium">Weight (%)</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="Weight"
                                    className="border rounded p-3 w-full mt-1"
                                    min={0}
                                    max={Math.min(100, availableWeight + (currentCriteria?.weight || 0))}
                                    value={criteriaForm.weight}
                                    onChange={(e) => {
                                        let val = Number(e.target.value);
                                        const maxAllowed = Math.min(
                                            100,
                                            availableWeight + (currentCriteria?.weight || 0)
                                        );
                                        if (isNaN(val)) val = 0;
                                        if (val > maxAllowed) val = maxAllowed;
                                        if (val < 0) val = 0;
                                        setCriteriaForm({ ...criteriaForm, weight: val });
                                    }}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    You can use up to{" "}
                                    <b>{Math.min(100, availableWeight + (currentCriteria?.weight || 0))}%</b>{" "}
                                    for this item.
                                </p>
                            </div>

                            {/* Actions */}
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
                                    className={`px-4 py-2 bg-blue-600 text-white rounded ${criteriaForm.title === currentCriteria?.title &&
                                            criteriaForm.description === currentCriteria?.description &&
                                            criteriaForm.weight === currentCriteria?.weight
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                        }`}
                                    disabled={
                                        criteriaForm.title === currentCriteria?.title &&
                                        criteriaForm.description === currentCriteria?.description &&
                                        criteriaForm.weight === currentCriteria?.weight
                                    }
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-3">Confirm Action</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to change the public status of this rubric?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    try {
                                        const res = await toggleRubricTemplatePublicStatus(
                                            pendingToggle.templateId,
                                            pendingToggle.newStatus
                                        );

                                        if (res.statusCode === 100 || res.statusCode === 200) {
                                            toast.success("Status updated successfully!");
                                            await fetchRubric();
                                        } else {
                                            toast.error(res.message || "Failed to update status.");
                                        }
                                    } catch (err) {
                                        toast.error("Error updating status.");
                                    }

                                    setShowConfirmModal(false);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {confirmConfig.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-3">
                            {confirmConfig.title}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {confirmConfig.message}
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmConfig({ open: false })}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmConfig.onConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
