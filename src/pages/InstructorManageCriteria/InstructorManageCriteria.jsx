import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Loader, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCriteriaByRubricId, deleteCriterion, createCriterion, updateCriterion } from '../../service/criteriaService';
import AddCriterionModal from '../../component/Criteria/AddCriterionModal';
import EditCriterionModal from '../../component/Criteria/EditCriterionModal';
import { toast } from 'react-toastify';

function InstructorManageCriteria() {
    const { rubricId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [criteria, setCriteria] = useState([]);
    const [rubricTitle, setRubricTitle] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, criterionId: null, criterionTitle: '' });
    const [deleting, setDeleting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCriterion, setEditingCriterion] = useState(null);

    useEffect(() => {
        const fetchCriteria = async () => {
            try {
                setLoading(true);
                const data = await getCriteriaByRubricId(rubricId);
                if (Array.isArray(data) && data.length > 0) {
                    setCriteria(data);
                    setRubricTitle(data[0].rubricTitle || 'Rubric Details');
                } else {
                    setCriteria([]);
                    setRubricTitle('Rubric Details');
                }
            } catch (error) {
                console.error('Failed to fetch criteria:', error);
                toast.error('Failed to load criteria');
                setCriteria([]);
                setRubricTitle('Rubric Details');
            } finally {
                setLoading(false);
            }
        };

        if (rubricId) {
            fetchCriteria();
        } else {
            toast.error('No rubric ID provided');
            setLoading(false);
        }
    }, [rubricId]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleDeleteClick = (criterionId, criterionTitle) => {
        setDeleteConfirm({ show: true, criterionId, criterionTitle });
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ show: false, criterionId: null, criterionTitle: '' });
    };

    const handleDeleteConfirm = async () => {
        try {
            if (!deleteConfirm.criterionId) {
                toast.error('Invalid criterion ID');
                return;
            }
            setDeleting(true);
            await deleteCriterion(deleteConfirm.criterionId);

            setCriteria(prev => prev.filter(c => c.criteriaId !== deleteConfirm.criterionId));

            toast.success('Criterion deleted successfully');
            setDeleteConfirm({ show: false, criterionId: null, criterionTitle: '' });
        } catch (error) {
            console.error('Failed to delete criterion:', error);
            toast.error('Failed to delete criterion');
        } finally {
            setDeleting(false);
        }
    };

    const handleAddCriterion = async (criterionData) => {
        try {
            setSubmitting(true);
            await createCriterion(criterionData);

            const data = await getCriteriaByRubricId(rubricId);
            if (Array.isArray(data) && data.length > 0) {
                setCriteria(data);
                setRubricTitle(data[0].rubricTitle || 'Rubric Details');
            } else {
                setCriteria([]);
            }

            toast.success('Criterion added successfully');
            setShowAddModal(false);
        } catch (error) {
            console.error('Failed to add criterion:', error);
            toast.error(error.response?.data?.message || 'Failed to add criterion');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (criterion) => {
        setEditingCriterion(criterion);
        setShowEditModal(true);
    };

    const handleUpdateCriterion = async (criterionData) => {
        try {
            setSubmitting(true);
            await updateCriterion(criterionData.criteriaId, criterionData);

            // Refresh danh sách
            const data = await getCriteriaByRubricId(rubricId);
            if (Array.isArray(data) && data.length > 0) {
                setCriteria(data);
                setRubricTitle(data[0].rubricTitle || 'Rubric Details');
            }

            toast.success('Criterion updated successfully');
            setShowEditModal(false);
            setEditingCriterion(null);
        } catch (error) {
            console.error('Failed to update criterion:', error);
            toast.error(error.response?.data?.message || 'Failed to update criterion');
        } finally {
            setSubmitting(false);
        }
    };

    const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
    const remainingWeight = 100 - totalWeight;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading criteria...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Rubrics</span>
                        <span>&gt;</span>
                        <span className="font-semibold text-gray-900">{rubricTitle}</span>
                    </div>

                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                        type="button"
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                </div>

                {/* Rubric Summary Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Rubric Summary</h2>
                    <div className="flex gap-12">
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Total Weight</div>
                            <div className="text-3xl font-bold text-gray-900">{totalWeight}%</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Total Criteria</div>
                            <div className="text-3xl font-bold text-gray-900">{criteria.length || 0}</div>
                        </div>
                        {/* <div>
                            <div className="text-sm text-gray-600 mb-1">Scoring Methods</div>
                            <div className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                {criteria.length > 0 && criteria[0].scoringMethod ? criteria[0].scoringMethod : 'Not set'}
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Evaluation Criteria Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Evaluation Criteria</h2>
                        <p className="text-sm text-gray-600">Manage and configure assessment criteria</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add Criteria
                    </button>
                </div>

                {/* Criteria Cards */}
                <div className="space-y-6">
                    {criteria.length > 0 ? (
                        criteria.map((criterion, index) => (
                            <div
                                key={criterion.criteriaId}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{criterion.title}</h3>
                                            {criterion.description && (
                                                <p className="text-sm text-gray-600 mt-1">{criterion.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-blue-600 font-semibold text-base">Weight: {criterion.weight}%</span>
                                        <span className="text-blue-600 font-semibold text-base">Max Score: {criterion.maxScore}</span>
                                        <button
                                            onClick={() => handleEditClick(criterion)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(criterion.criteriaId, criterion.title);
                                            }}
                                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <ul className="ml-12 space-y-2">
                                    {criterion.items && criterion.items.map((item, idx) => (
                                        <li key={idx} className="text-gray-600 text-base flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-gray-200">
                            <p className="text-gray-500">No criteria found for this rubric.</p>
                        </div>
                    )}
                </div>

                {/* Weight Warning */}
                {remainingWeight !== 0 && (
                    <div className={`mt-4 p-4 rounded-lg ${remainingWeight > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
                        <p className={`text-sm ${remainingWeight > 0 ? 'text-yellow-800' : 'text-red-800'}`}>
                            {remainingWeight > 0
                                ? `Note: ${remainingWeight}% weight remaining to be allocated.`
                                : `Warning: Total weight exceeds 100% by ${Math.abs(remainingWeight)}%.`}
                        </p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Criterion</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <span className="font-medium">{deleteConfirm.criterionTitle}</span> criterion?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleDeleteCancel}
                                disabled={deleting}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Criterion Modal */}
            <AddCriterionModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddCriterion}
                rubricId={rubricId}
                isSubmitting={submitting}
            />
            <EditCriterionModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingCriterion(null);
                }}
                onSubmit={handleUpdateCriterion}
                criterion={editingCriterion}
                isSubmitting={submitting}
            />
        </div>
    );
}

export default InstructorManageCriteria;