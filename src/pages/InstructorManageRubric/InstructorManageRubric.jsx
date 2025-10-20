import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Trash2, Loader } from 'lucide-react';
import { getAllRubrics, createRubric, updateRubric, deleteRubric, getPublicRubricTemplates } from '../../service/rubricService';
import { toast } from 'react-toastify';

const InstructorManageRubric = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [rubrics, setRubrics] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [templatesLoading, setTemplatesLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRubric, setEditingRubric] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newRubricTitle, setNewRubricTitle] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingRubric, setDeletingRubric] = useState(null);

    useEffect(() => {
        const fetchRubrics = async () => {
            try {
                setLoading(true);
                const data = await getAllRubrics();

                const formattedRubrics = data.map(rubric => ({
                    ...rubric,
                    id: rubric.id,
                    rubricId: rubric.rubricId || rubric.id,
                    title: rubric.title,
                    criteriaCount: rubric.criteriaCount || rubric.criteria?.length || 0,
                    createdDate: rubric.createdDate || new Date().toISOString()
                }));

                setRubrics(formattedRubrics);
            } catch (error) {
                console.error('Failed to fetch rubrics:', error);
                toast.error('Failed to load rubrics');
            } finally {
                setLoading(false);
            }
        };

        fetchRubrics();
    }, []);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setTemplatesLoading(true);
                const data = await getPublicRubricTemplates();

                const formattedTemplates = data.map(template => ({
                    templateId: template.templateId,
                    title: template.title,
                    major: template.majorName || 'SE',
                    majorColor: 'bg-blue-100 text-blue-600',
                    criteriaCount: template.criteriaTemplateCount || 0,
                    criteriaTemplates: template.criteriaTemplates || []
                }));

                setTemplates(formattedTemplates);
            } catch (error) {
                console.error('Failed to fetch templates:', error);
                toast.error('Failed to load rubric templates');
            } finally {
                setTemplatesLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    const filteredRubrics = rubrics.filter(rubric =>
        rubric.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateClick = () => {
        setNewRubricTitle('');
        setIsCreateModalOpen(true);
    };

    const handleSaveCreate = async () => {
        const trimmedTitle = newRubricTitle.trim();

        if (!trimmedTitle) {
            toast.error('Title cannot be empty');
            return;
        }

        try {
            const newRubric = await createRubric({ title: trimmedTitle });

            toast.success('Rubric created successfully');
            setIsCreateModalOpen(false);
            setNewRubricTitle('');

            const data = await getAllRubrics();
            const formattedRubrics = data.map(rubric => ({
                ...rubric,
                id: rubric.id,
                rubricId: rubric.rubricId || rubric.id,
                title: rubric.title,
                criteriaCount: rubric.criteriaCount || rubric.criteria?.length || 0,
                createdDate: rubric.createdDate || new Date().toISOString()
            }));
            setRubrics(formattedRubrics);
        } catch (error) {
            console.error('Failed to create rubric:', error);
            toast.error('Failed to create rubric');
        }
    };

    const handleCancelCreate = () => {
        setIsCreateModalOpen(false);
        setNewRubricTitle('');
    };

    const handleEditClick = (rubric) => {
        setEditingRubric(rubric);
        setEditTitle(rubric.title);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        const trimmedNewTitle = editTitle.trim();

        if (!trimmedNewTitle) {
            toast.error('Title cannot be empty');
            return;
        }

        if (!editingRubric?.rubricId) {
            toast.error('Could not identify rubric');
            return;
        }

        if (trimmedNewTitle === editingRubric.title.trim()) {
            toast.info('No changes made to the title');
            setIsEditModalOpen(false);
            setEditingRubric(null);
            setEditTitle('');
            return;
        }

        try {
            await updateRubric(editingRubric.rubricId, { title: trimmedNewTitle });

            setRubrics(rubrics.map(r =>
                r.rubricId === editingRubric.rubricId ? { ...r, title: editTitle.trim() } : r
            ));

            toast.success('Rubric updated successfully');
            setIsEditModalOpen(false);
            setEditingRubric(null);
            setEditTitle('');
        } catch (error) {
            console.error('Failed to update rubric:', error);
            toast.error(error.response?.data?.message || 'Failed to update rubric');
        }
    };

    const handleCancelEdit = () => {
        setIsEditModalOpen(false);
        setEditingRubric(null);
        setEditTitle('');
    };

    const handleDeleteClick = (e, rubric) => {
        e.stopPropagation();
        setDeletingRubric(rubric);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingRubric?.rubricId) {
            toast.error('Could not identify rubric');
            return;
        }

        try {
            await deleteRubric(deletingRubric.rubricId);

            setRubrics(rubrics.filter(r => r.rubricId !== deletingRubric.rubricId));

            toast.success('Rubric deleted successfully');
            setIsDeleteModalOpen(false);
            setDeletingRubric(null);
        } catch (error) {
            console.error('Failed to delete rubric:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete rubric';
            toast.error(errorMessage);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDeletingRubric(null);
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Rubrics</h1>
                    <p className="text-gray-600">Create and manage rubrics for courses</p>
                </div>

                {/* Search and Create Button */}
                <div className="flex gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search rubrics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <button
                        onClick={handleCreateClick}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Rubric
                    </button>
                </div>

                {/* Template Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Rubric Templates</h2>
                    <p className="text-gray-600 mb-6">Choose a suitable template to create rubrics quickly</p>

                    {templatesLoading ? (
                        <div className="py-12 text-center">
                            <Loader className="w-8 h-8 animate-spin mx-auto mb-3 text-orange-500" />
                            <p className="text-gray-500">Loading templates...</p>
                        </div>
                    ) : templates.length === 0 ? (
                        <div className="py-12 text-center bg-white rounded-lg border border-gray-200">
                            <p className="text-gray-500">No public templates available</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {templates.map((template) => (
                                <div key={template.templateId} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{template.title}</h3>
                                        <p className="text-sm text-gray-500">{template.criteriaCount} criteria</p>
                                    </div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${template.majorColor}`}>
                                        {template.major}
                                    </span>
                                    <ul className="space-y-2">
                                        {template.criteriaTemplates.slice(0, 4).map((criteria, idx) => (
                                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                                                <span className="text-gray-400 mr-2">•</span>
                                                {criteria.title}
                                            </li>
                                        ))}
                                        {template.criteriaTemplates.length > 4 && (
                                            <li className="text-sm text-gray-500 italic">
                                                +{template.criteriaTemplates.length - 4} more...
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* My Rubrics Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">My Rubrics</h2>
                    <p className="text-gray-600 mb-6">Rubrics you've created and are currently using</p>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm">
                            <div className="col-span-2">Title</div>
                            <div className="col-span-1 text-center">Total Criteria</div>
                            <div className="col-span-1 text-center">Actions</div>
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className="px-6 py-8 text-center">
                                <Loader className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                                <p className="text-gray-500">Loading rubrics...</p>
                            </div>
                        ) : filteredRubrics.length === 0 ? (
                            <div className="px-6 py-8 text-center">
                                <p className="text-gray-500">No rubrics found</p>
                            </div>
                        ) : (
                            /* Table Rows */
                            filteredRubrics.map((rubric) => (
                                <div key={rubric.rubricId} className="grid grid-cols-4 gap-4 px-6 py-5 border-b border-gray-200 hover:bg-gray-50 transition-colors items-center">
                                    <div className="col-span-2">
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {rubric.title}
                                        </h3>
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <span className="text-base text-gray-900">
                                            {rubric.criteriaCount || 0}
                                        </span>
                                    </div>
                                    <div className="col-span-1 flex gap-2 justify-center">
                                        <button
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="View"
                                            onClick={() => navigate(
                                                `/instructor/manage-criteria/${rubric.rubricId}`,
                                                { state: { from: '/instructor/manage-rubric' } }
                                            )}
                                        >
                                            <Eye className="w-5 h-5 text-gray-600" />
                                        </button>
                                        <button
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Edit"
                                            onClick={() => handleEditClick(rubric)}
                                        >
                                            <Pencil className="w-5 h-5 text-gray-600" />
                                        </button>
                                        <button
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                            onClick={(e) => handleDeleteClick(e, rubric)}
                                        >
                                            <Trash2 className="w-5 h-5 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Create Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Rubric</h3>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rubric Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newRubricTitle}
                                        onChange={(e) => setNewRubricTitle(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Enter rubric name..."
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={handleCancelCreate}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveCreate}
                                        disabled={!newRubricTitle.trim()}
                                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Create Rubric
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Rubric</h3>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rubric Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Enter rubric name..."
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        disabled={!editTitle.trim()}
                                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                        <Trash2 className="w-6 h-6 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Delete Rubric</h3>
                                </div>

                                {deletingRubric && (
                                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                        <p className="text-gray-600 mb-2">
                                            Are you sure you want to delete the rubric{' '}
                                            <span className="font-bold">{deletingRubric.title}</span>?
                                        </p>
                                    </div>
                                )}

                                <p className="text-sm text-red-600 mb-6">
                                    <strong>Note:</strong> You can only delete rubrics that have no criteria.
                                </p>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={handleCancelDelete}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                                    >
                                        Delete Rubric
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorManageRubric;