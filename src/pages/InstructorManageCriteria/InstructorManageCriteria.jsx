import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Loader, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCriteriaByRubricId, deleteCriterion, createCriterion, updateCriterion } from '../../service/criteriaService';
import { updateRubric } from '../../service/rubricService';
import AddCriterionModal from '../../component/Criteria/AddCriterionModal';
import EditCriterionModal from '../../component/Criteria/EditCriterionModal';
import DeleteCriterionModal from '../../component/Criteria/DeleteCriterionModal';
import EditRubricModal from '../../component/Rubric/EditRubricModal';
import { toast } from 'react-toastify';

function InstructorManageCriteria() {
    const { rubricId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [criteria, setCriteria] = useState([]);
    const [rubricTitle, setRubricTitle] = useState('');
    const [courseName, setCourseName] = useState('');
    const [className, setClassName] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, criterionId: null, criterionTitle: '' });
    const [deleting, setDeleting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCriterion, setEditingCriterion] = useState(null);
    const [showEditRubricModal, setShowEditRubricModal] = useState(false);
    const [updatingRubric, setUpdatingRubric] = useState(false);

    useEffect(() => {
        const fetchCriteria = async () => {
            try {
                setLoading(true);
                const data = await getCriteriaByRubricId(rubricId);
                if (Array.isArray(data) && data.length > 0) {
                    setCriteria(data);
                    setRubricTitle(data[0].rubricTitle || 'Rubric Details');
                    setCourseName(data[0].courseName || '');
                    setClassName(data[0].className || '');
                } else {
                    setCriteria([]);
                    setRubricTitle('Rubric Details');
                    setCourseName('');
                    setClassName('');
                }
            } catch (error) {
                console.error('Failed to fetch criteria:', error);
                toast.error('Failed to load criteria');
                setCriteria([]);
                setRubricTitle('Rubric Details');
                setCourseName('');
                setClassName('');
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

    const handleEditRubric = () => {
        // Open edit rubric modal
        setShowEditRubricModal(true);
    };

    const handleUpdateRubric = async (rubricData) => {
        try {
            setUpdatingRubric(true);
            await updateRubric(rubricData.rubricId, { title: rubricData.title });

            // Update local state
            setRubricTitle(rubricData.title);

            toast.success('Rubric updated successfully');
            setShowEditRubricModal(false);
        } catch (error) {
            console.error('Failed to update rubric:', error);
            toast.error(error.response?.data?.message || 'Failed to update rubric');
        } finally {
            setUpdatingRubric(false);
        }
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
                setCourseName(data[0].courseName || '');
                setClassName(data[0].className || '');
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
                setCourseName(data[0].courseName || '');
                setClassName(data[0].className || '');
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
                
                {/* Header Section */}
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium mb-4"
                        type="button"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Rubrics</span>
                    </button>
                    
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-indigo-600 text-sm mb-2 font-medium">
                                    <span>Rubric Management</span>
                                    <span>/</span>
                                    <span>Criteria</span>
                                </div>
                                <h1 className="text-3xl font-bold mb-2 text-gray-900">{rubricTitle}</h1>
                                <p className="text-gray-600">Manage evaluation criteria for this rubric</p>
                            </div>
                            <button
                                onClick={handleEditRubric}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                            >
                                <Pencil size={18} />
                                <span>Edit Rubric</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Course and Class Information Card */}
                {(courseName || className) && (
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-6">
                            {courseName && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-600">Course:</span>
                                    <span className="text-base font-semibold text-indigo-700">{courseName}</span>
                                </div>
                            )}
                            {className && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-600">Class:</span>
                                    <span className="text-base font-semibold text-indigo-700">{className}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

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
                <div className="space-y-4">
                    {criteria.length > 0 ? (
                        criteria.map((criterion, index) => (
                            <div
                                key={criterion.criteriaId}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Number Badge */}
                                        <span className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-base">
                                            {index + 1}
                                        </span>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900">{criterion.title}</h3>
                                                
                                                {/* Stats and Actions */}
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <div className="text-xs text-gray-500 mb-0.5">Weight:</div>
                                                            <div className="text-base font-semibold text-indigo-600">{criterion.weight}%</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-xs text-gray-500 mb-0.5">Max Score:</div>
                                                            <div className="text-base font-semibold text-indigo-600">{criterion.maxScore}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 ml-2">
                                                        <button
                                                            onClick={() => handleEditClick(criterion)}
                                                            className="text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-indigo-50"
                                                            title="Edit criterion"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(criterion.criteriaId, criterion.title);
                                                            }}
                                                            className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                                                            title="Delete criterion"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            {criterion.description && (
                                                <p className="text-sm text-gray-600 leading-relaxed">{criterion.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
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
            <DeleteCriterionModal
                isOpen={deleteConfirm.show}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                criterionTitle={deleteConfirm.criterionTitle}
                isDeleting={deleting}
            />
            <EditRubricModal
                isOpen={showEditRubricModal}
                onClose={() => setShowEditRubricModal(false)}
                onSubmit={handleUpdateRubric}
                rubric={{ rubricId, title: rubricTitle }}
                isSubmitting={updatingRubric}
            />
        </div>
    );
}

export default InstructorManageCriteria;