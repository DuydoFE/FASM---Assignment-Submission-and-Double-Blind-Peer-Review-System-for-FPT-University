import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Loader, Pencil } from 'lucide-react';
import { getRubricTemplatesByUserId, getRubricByUserId } from '../../service/rubricService';
import { toast } from 'react-toastify';
import { getCurrentAccount } from '../../utils/accountUtils';


const InstructorManageRubric = () => {
    const currentUser = getCurrentAccount();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [rubricSearchQuery, setRubricSearchQuery] = useState('');
    const [rubrics, setRubrics] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [templatesLoading, setTemplatesLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentRubricPage, setCurrentRubricPage] = useState(1);
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
        } finally {
            setTemplatesLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    useEffect(() => {
        const fetchRubrics = async () => {
            try {
                setLoading(true);
                const data = await getRubricByUserId(currentUser.id);

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
            } finally {
                setLoading(false);
            }
        };

        fetchRubrics();
    }, []);

    const filteredRubrics = rubrics.filter(rubric => {
        const query = rubricSearchQuery.toLowerCase();
        const title = rubric.title?.toLowerCase() || '';
        const courseClass = rubric.assignmentsUsingTemplate?.[0]?.className?.toLowerCase() || '';
        const assignment = rubric.assignmentTitle?.toLowerCase() || '';
        
        return title.includes(query) || courseClass.includes(query) || assignment.includes(query);
    });

    const filteredTemplates = templates.filter(template =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Reset template pagination when template search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Reset rubric pagination when rubric search query changes
    useEffect(() => {
        setCurrentRubricPage(1);
    }, [rubricSearchQuery]);

    const handleViewCriteriaTemplateClick = (e, template) => {
        e.stopPropagation();
        navigate(`/instructor/manage-criteria-template/${template.templateId}`);
    };

    // Template pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTemplates = filteredTemplates.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);

    // Rubric pagination
    const indexOfLastRubric = currentRubricPage * itemsPerPage;
    const indexOfFirstRubric = indexOfLastRubric - itemsPerPage;
    const currentRubrics = filteredRubrics.slice(indexOfFirstRubric, indexOfLastRubric);
    const totalRubricPages = Math.ceil(filteredRubrics.length / itemsPerPage);

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Rubrics</h1>
                    <p className="text-gray-600">Create and manage rubrics for courses</p>
                </div>

                {/* Search */}
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
                </div>

                {/* Template Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Rubric Templates</h2>
                    <p className="text-gray-600 mb-6">Choose a suitable template to create rubrics</p>

                    {templatesLoading ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <Loader className="w-8 h-8 animate-spin mx-auto mb-3 text-orange-500" />
                            <p className="text-gray-500">Loading templates...</p>
                        </div>
                    ) : filteredTemplates.length === 0 ? (
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
                                                            title="View Criteria Template"
                                                            onClick={(e) => handleViewCriteriaTemplateClick(e, template)}
                                                        >
                                                            <Eye className="w-5 h-5" />
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
                                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTemplates.length)} of {filteredTemplates.length} templates
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
                    <p className="text-gray-600 mb-4">Rubrics you've created and are currently using</p>

                    {/* Search for My Rubrics */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by title, course/class, or assignment..."
                                value={rubricSearchQuery}
                                onChange={(e) => setRubricSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-10 px-6 py-3 bg-gray-100 border-b border-gray-200 text-sm font-semibold text-gray-700">
                            <div className="col-span-3">Rubric Title</div>
                            <div className="col-span-3">Course - Class</div>
                            <div className="col-span-2">Assignment</div>
                            <div className="col-span-1 text-center">Total Criteria</div>
                            <div className="col-span-1 text-center">Actions</div>
                        </div>

                        {/* Loading / Empty / Data */}
                        {loading ? (
                            <div className="px-6 py-10 text-center text-gray-500">
                                <Loader className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                                Loading rubrics...
                            </div>
                        ) : currentRubrics.length === 0 ? (
                            <div className="px-6 py-10 text-center text-gray-500">No rubrics found</div>
                        ) : (
                            currentRubrics.map((rubric, index) => (
                                <div
                                    key={rubric.rubricId}
                                    className={`grid grid-cols-10 px-6 py-4 text-sm items-center border-b border-gray-100 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        } hover:bg-orange-50/40`}
                                >
                                    {/* Rubric Title */}
                                    <div className="col-span-3 font-semibold text-gray-900 truncate">
                                        {rubric.title}
                                    </div>

                                    {/* Course - Class */}
                                    <div className="col-span-3 font-semibold text-gray-700 truncate">
                                        {rubric.assignmentsUsingTemplate?.[0]
                                            ? rubric.assignmentsUsingTemplate[0].className
                                            : "—"}
                                    </div>

                                    {/* Assignment */}
                                    <div className="col-span-2 font-medium text-gray-800 truncate">
                                        {rubric.assignmentTitle}
                                    </div>

                                    {/* Criteria Count */}
                                    <div className="col-span-1 text-center font-semibold text-gray-800">
                                        {rubric.criteriaCount || 0}
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 flex justify-center gap-2">
                                        {(rubric.assignmentStatus === 'Draft') ? (
                                            <button
                                                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition border border-blue-200"
                                                title="Edit Rubric and Criteria"
                                                onClick={() =>
                                                    navigate(`/instructor/manage-criteria/${rubric.rubricId}`, {
                                                        state: { from: "/instructor/manage-rubric" },
                                                    })
                                                }
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                        ) : (
                                            <button
                                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition border border-gray-200"
                                                title="View Rubric and Criteria"
                                                onClick={() =>
                                                    navigate(`/instructor/manage-criteria/${rubric.rubricId}`, {
                                                        state: { from: "/instructor/manage-rubric" },
                                                    })
                                                }
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Rubric Pagination */}
                    {!loading && filteredRubrics.length > itemsPerPage && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {indexOfFirstRubric + 1}-{Math.min(indexOfLastRubric, filteredRubrics.length)} of {filteredRubrics.length} rubrics
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentRubricPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentRubricPage === 1}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {[...Array(totalRubricPages)].map((_, idx) => (
                                    <button
                                        key={idx + 1}
                                        onClick={() => setCurrentRubricPage(idx + 1)}
                                        className={`px-4 py-2 rounded-lg transition ${currentRubricPage === idx + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentRubricPage(prev => Math.min(totalRubricPages, prev + 1))}
                                    disabled={currentRubricPage === totalRubricPages}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorManageRubric;