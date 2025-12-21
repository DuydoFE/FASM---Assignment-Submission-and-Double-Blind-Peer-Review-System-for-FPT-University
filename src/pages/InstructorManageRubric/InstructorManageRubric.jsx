import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Eye, Loader, Pencil } from 'lucide-react';
import { Input, Pagination, Table } from 'antd';
import { getRubricTemplatesByUserId, getRubricByUserId } from '../../service/rubricService';
import { toast } from 'react-toastify';
import { getCurrentAccount } from '../../utils/accountUtils';


const InstructorManageRubric = () => {
    const currentUser = getCurrentAccount();
    const navigate = useNavigate();
    const { courseInstanceId: urlCourseInstanceId } = useParams();
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
                
                // Get courseInstanceId from URL parameter first, fallback to sessionStorage
                const courseInstanceId = urlCourseInstanceId || sessionStorage.getItem('currentCourseInstanceId');
                
                if (!courseInstanceId) {
                    console.error('No courseInstanceId found in URL or sessionStorage');
                    setLoading(false);
                    return;
                }

                const data = await getRubricByUserId(currentUser.id, courseInstanceId);

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
    }, [urlCourseInstanceId]);

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

    const handleViewCriteriaTemplateClick = (e, template) => {
        e.stopPropagation();
        navigate(`/instructor/manage-criteria-template/${template.templateId}`);
    };

    const templateColumns = [
        {
            title: 'Rubric Name',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
            render: (title) => (
                <div className="font-semibold text-gray-900">{title}</div>
            ),
        },
        {
            title: 'Course',
            key: 'course',
            width: '15%',
            render: (_, record) => (
                <div className="text-sm text-gray-900">
                    {record.assignments.length > 0 && record.assignments[0].courseName ? (
                        <>
                            <div>{record.assignments[0].courseName.split(' - ')[0] || record.courseName}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                                {record.assignments[0].courseName.split(' - ')[1] || ''}
                            </div>
                        </>
                    ) : (
                        <span className="text-gray-500">{record.courseName}</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Class',
            key: 'class',
            width: '15%',
            render: (_, record) => (
                <div className="text-sm text-gray-900">
                    {record.assignments.length > 0 && record.assignments[0].className ? (
                        <>
                            <div>{record.assignments[0].className.split(' - ')[0] || record.className}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                                {record.assignments[0].className.split(' - ')[1] || ''}
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-500">{record.className}</div>
                    )}
                </div>
            ),
        },
        {
            title: 'Used in Assignments',
            key: 'assignments',
            width: '30%',
            render: (_, record) => (
                record.assignments.length === 0 ? (
                    <span className="text-sm text-gray-500">— No assignments</span>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {record.assignments.slice(0, 2).map((assignment, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700 border border-teal-200"
                            >
                                {assignment.title}
                            </span>
                        ))}
                        {record.assignments.length > 2 && (
                            <span className="text-xs text-gray-600 self-center">
                                +{record.assignments.length - 2} more
                            </span>
                        )}
                    </div>
                )
            ),
        },
        {
            title: 'Total Criteria',
            dataIndex: 'criteriaCount',
            key: 'criteriaCount',
            width: '10%',
            align: 'center',
            render: (count) => (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                    <span className="font-semibold">{count}</span>
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '10%',
            align: 'center',
            render: (_, record) => (
                <button
                    className="p-2 text-blue-600 rounded-lg hover:bg-blue-50 transition border border-blue-200"
                    title="View Criteria Template"
                    onClick={(e) => handleViewCriteriaTemplateClick(e, record)}
                >
                    <Eye className="w-5 h-5" />
                </button>
            ),
        },
    ];

    const rubricColumns = [
        {
            title: 'Rubric Title',
            dataIndex: 'title',
            key: 'title',
            width: '30%',
            render: (title) => (
                <div className="font-semibold text-gray-900 truncate">{title}</div>
            ),
        },
        {
            title: 'Course - Class',
            key: 'courseClass',
            width: '30%',
            render: (_, record) => (
                <div className="font-semibold text-gray-700 truncate">
                    {record.assignmentsUsingTemplate?.[0]
                        ? record.assignmentsUsingTemplate[0].className
                        : "—"}
                </div>
            ),
        },
        {
            title: 'Assignment',
            dataIndex: 'assignmentTitle',
            key: 'assignmentTitle',
            width: '20%',
            render: (title) => (
                <div className="font-medium text-gray-800 truncate">{title}</div>
            ),
        },
        {
            title: 'Total Criteria',
            dataIndex: 'criteriaCount',
            key: 'criteriaCount',
            width: '10%',
            align: 'center',
            render: (count) => (
                <div className="font-semibold text-gray-800">{count || 0}</div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '10%',
            align: 'center',
            render: (_, record) => (
                <div className="flex justify-center gap-2">
                    {(record.assignmentStatus === 'Draft') ? (
                        <button
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition border border-blue-200"
                            title="Edit Rubric and Criteria"
                            onClick={() =>
                                navigate(`/instructor/manage-criteria/${record.rubricId}`, {
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
                                navigate(`/instructor/manage-criteria/${record.rubricId}`, {
                                    state: { from: "/instructor/manage-rubric" },
                                })
                            }
                        >
                            <Eye className="w-5 h-5" />
                        </button>
                    )}
                </div>
            ),
        },
    ];

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
                    <Input
                        placeholder="Search rubrics..."
                        prefix={<Search className="w-5 h-5 text-gray-400" />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="large"
                        className="flex-1"
                        style={{
                            borderRadius: '8px',
                            fontSize: '16px',
                        }}
                    />
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
                        <Table
                            columns={templateColumns}
                            dataSource={filteredTemplates}
                            rowKey="templateId"
                            loading={templatesLoading}
                            pagination={{
                                current: currentPage,
                                pageSize: itemsPerPage,
                                total: filteredTemplates.length,
                                onChange: (page) => setCurrentPage(page),
                                showSizeChanger: false,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} templates`,
                            }}
                            className="bg-white rounded-lg shadow-sm"
                        />
                    )}
                </div>

                {/* My Rubrics Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">My Rubrics</h2>
                    <p className="text-gray-600 mb-4">Rubrics you've created and are currently using</p>

                    {/* Search for My Rubrics */}
                    <div className="flex gap-4 mb-6">
                        <Input
                            placeholder="Search by title, course/class, or assignment..."
                            prefix={<Search className="w-5 h-5 text-gray-400" />}
                            value={rubricSearchQuery}
                            onChange={(e) => setRubricSearchQuery(e.target.value)}
                            size="large"
                            className="flex-1"
                            style={{
                                borderRadius: '8px',
                                fontSize: '16px',
                            }}
                        />
                    </div>

                    <Table
                        columns={rubricColumns}
                        dataSource={filteredRubrics}
                        rowKey="rubricId"
                        loading={loading}
                        pagination={{
                            current: currentRubricPage,
                            pageSize: itemsPerPage,
                            total: filteredRubrics.length,
                            onChange: (page) => setCurrentRubricPage(page),
                            showSizeChanger: false,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} rubrics`,
                        }}
                        locale={{
                            emptyText: (
                                <div className="px-6 py-10 text-center text-gray-500">
                                    No rubrics found
                                </div>
                            ),
                        }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200"
                    />
                </div>
            </div>
        </div>
    );
};

export default InstructorManageRubric;