import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Trash2, Loader, Edit2 } from 'lucide-react';
import { getAllRubrics, updateRubric, deleteRubric, getRubricTemplatesByUserId, createRubricTemplate, deleteRubricTemplate } from '../../service/rubricService';
import { toast } from 'react-toastify';
import { getCurrentAccount } from '../../utils/accountUtils';
import DeleteRubricTemplateModal from '../../component/Rubric/DeleteRubricTemplateModal';
import CreateRubricTemplateModal from '../../component/Rubric/CreateRubricTemplateModal';


const InstructorManageRubric = () => {
    const currentUser = getCurrentAccount();
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
    const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState(false);
    const [isDeleteTemplateModalOpen, setIsDeleteTemplateModalOpen] = useState(false);
    const [deletingTemplate, setDeletingTemplate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshTemplates, setRefreshTemplates] = useState(0);
    const itemsPerPage = 5;

    const fetchTemplates = async () => {
        try {
            setTemplatesLoading(true);
            if (!currentUser?.id) {
                console.error('No user ID found');
                return;
            }
            const response = await getRubricTemplatesByUserId(currentUser.id);

            const formattedTemplates = response.map(template => ({
                templateId: template.templateId,
                title: template.title,
                courseName: template.assignmentsUsingTemplate?.[0]?.courseName || '— Not assigned',
                className: template.assignmentsUsingTemplate?.[0]?.className || '— Not assigned',
                assignments: template.assignmentsUsingTemplate || [],
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

    useEffect(() => {
        fetchTemplates();
    }, [refreshTemplates]);

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
            const newRubric = await createRubricTemplate({ title: trimmedTitle, createdByUserId: currentUser.id });

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

    const handleDeleteTemplateClick = (e, template) => {
        e.stopPropagation();
        setDeletingTemplate(template);
        setIsDeleteTemplateModalOpen(true);
    };

    const handleConfirmDeleteTemplate = async () => {
        if (!deletingTemplate?.templateId) {
            toast.error('Could not identify template');
            return;
        }

        try {
            await deleteRubricTemplate(deletingTemplate.templateId);

            toast.success('Rubric template deleted successfully');
            setIsDeleteTemplateModalOpen(false);
            setDeletingTemplate(null);

            // Trigger refresh
            setRefreshTemplates(prev => prev + 1);
        } catch (error) {
            console.error('Failed to delete rubric template:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete rubric template';
            toast.error(errorMessage);
        }
    };

    const handleCancelDeleteTemplate = () => {
        setIsDeleteTemplateModalOpen(false);
        setDeletingTemplate(null);
    };

    const handleCreateTemplateClick = () => {
        setIsCreateTemplateModalOpen(true);
    };

    const handleConfirmCreateTemplate = async (title) => {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            toast.error('Title cannot be empty');
            return;
        }

        try {
            await createRubricTemplate({ 
                title: trimmedTitle, 
                createdByUserId: currentUser.id 
            });

            toast.success('Rubric template created successfully');
            setIsCreateTemplateModalOpen(false);

            setRefreshTemplates(prev => prev + 1);
        } catch (error) {
            console.error('Failed to create rubric template:', error);
            toast.error('Failed to create rubric template');
        }
    };

    const handleCancelCreateTemplate = () => {
        setIsCreateTemplateModalOpen(false);
    };


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTemplates = templates.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(templates.length / itemsPerPage);

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
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <Loader className="w-8 h-8 animate-spin mx-auto mb-3 text-orange-500" />
                            <p className="text-gray-500">Loading templates...</p>
                        </div>
                    ) : templates.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <p className="text-gray-500">No templates available</p>
                        </div>
                    ) : (
                        <>
                            {/* Table */}
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Rubric Name</th>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Course</th>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Class</th>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Used in Assignments</th>
                                            <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">Total Criteria</th>
                                            <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentTemplates.map((template) => (
                                            <tr key={template.templateId} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-5">
                                                    <div className="font-semibold text-gray-900">{template.title}</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-sm text-gray-900">
                                                        {template.assignments.length > 0 && template.assignments[0].courseName ? (
                                                            <>
                                                                <div>{template.assignments[0].courseName.split(' - ')[0] || template.courseName}</div>
                                                                <div className="text-xs text-gray-500 mt-0.5">
                                                                    {template.assignments[0].courseName.split(' - ')[1] || ''}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-500">{template.courseName}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-sm text-gray-900">
                                                        {template.assignments.length > 0 && template.assignments[0].className ? (
                                                            <>
                                                                <div>{template.assignments[0].className.split(' - ')[0] || template.className}</div>
                                                                <div className="text-xs text-gray-500 mt-0.5">
                                                                    {template.assignments[0].className.split(' - ')[1] || ''}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-gray-500">{template.className}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {template.assignments.length === 0 ? (
                                                        <span className="text-sm text-gray-500">— No assignments</span>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {template.assignments.slice(0, 2).map((assignment, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700 border border-teal-200"
                                                                >
                                                                    {assignment.title}
                                                                </span>
                                                            ))}
                                                            {template.assignments.length > 2 && (
                                                                <span className="text-xs text-gray-600 self-center">
                                                                    +{template.assignments.length - 2} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-center gap-2 text-blue-600">
                                                        <span className="font-semibold">{template.criteriaCount}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className="p-2 text-blue-600 rounded-lg hover:bg-blue-50 transition border border-blue-200"
                                                            title="View Template"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            className="p-2 text-yellow-600 rounded-lg hover:bg-yellow-50 transition border border-yellow-200"
                                                            title="Edit Template"
                                                        >
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            className="p-2 text-red-600 rounded-lg hover:bg-red-50 transition border border-red-200"
                                                            title="Delete Template"
                                                            onClick={(e) => handleDeleteTemplateClick(e, template)}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer with Pagination */}
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, templates.length)} of {templates.length} templates
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, idx) => (
                                        <button
                                            key={idx + 1}
                                            onClick={() => setCurrentPage(idx + 1)}
                                            className={`px-4 py-2 rounded-lg transition ${currentPage === idx + 1
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
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

                {/* Delete Rubric Confirmation Modal */}
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

                {/* Delete Template Modal */}
                <DeleteRubricTemplateModal
                    isOpen={isDeleteTemplateModalOpen}
                    template={deletingTemplate}
                    onConfirm={handleConfirmDeleteTemplate}
                    onCancel={handleCancelDeleteTemplate}
                />
                {/* Create Template Modal */}
                <CreateRubricTemplateModal
                    isOpen={isCreateTemplateModalOpen}
                    onConfirm={handleConfirmCreateTemplate}
                    onCancel={handleCancelCreateTemplate}
                />

                {/* Edit Template Modal */}
                {/* <EditRubricTemplateModal
                    isOpen={isEditTemplateModalOpen}
                    template={editingTemplate}
                    onConfirm={handleConfirmEditTemplate}
                    onCancel={handleCancelEditTemplate}
                /> */}
            </div>
        </div>
    );
};

export default InstructorManageRubric;