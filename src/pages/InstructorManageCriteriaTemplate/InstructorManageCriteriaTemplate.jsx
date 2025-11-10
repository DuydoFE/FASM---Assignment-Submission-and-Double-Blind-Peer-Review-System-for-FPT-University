import React, { useState, useEffect } from 'react';
import { Loader, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCriteriaByTemplateId } from '../../service/criteriaService';
import { toast } from 'react-toastify';

function InstructorManageCriteriaTemplate() {
    const { templateId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [criteria, setCriteria] = useState([]);
    const [templateTitle, setTemplateTitle] = useState('');

    useEffect(() => {
        const fetchCriteria = async () => {
            try {
                setLoading(true);
                const data = await getCriteriaByTemplateId(templateId);
                if (Array.isArray(data) && data.length > 0) {
                    // Map API response to match the criteria structure
                    const mappedCriteria = data.map(item => ({
                        criteriaId: item.criteriaTemplateId,
                        title: item.title,
                        description: item.description,
                        weight: item.weight,
                        maxScore: item.maxScore,
                        scoringMethod: item.scoringType,
                        items: item.scoreLabels ? item.scoreLabels.split(',').map(s => s.trim()) : []
                    }));
                    setCriteria(mappedCriteria);
                    setTemplateTitle(data[0].templateTitle || 'Template Details');
                } else {
                    setCriteria([]);
                    setTemplateTitle('Template Details');
                }
            } catch (error) {
                console.error('Failed to fetch criteria templates:', error);
                toast.error('Failed to load criteria templates');
                setCriteria([]);
                setTemplateTitle('Template Details');
            } finally {
                setLoading(false);
            }
        };

        if (templateId) {
            fetchCriteria();
        } else {
            toast.error('No template ID provided');
            setLoading(false);
        }
    }, [templateId]);

    const handleBack = () => {
        navigate(-1);
    };

    const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
    const remainingWeight = 100 - totalWeight;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading criteria templates...</p>
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
                        <span>Rubric Templates</span>
                        <span>&gt;</span>
                        <span className="font-semibold text-gray-900">{templateTitle}</span>
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

                {/* Template Summary Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Summary</h2>
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
                        <h2 className="text-xl font-semibold text-gray-900">Evaluation Criteria Templates</h2>
                        <p className="text-sm text-gray-600">View assessment criteria templates</p>
                    </div>
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
                            <p className="text-gray-500">No criteria templates found.</p>
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
        </div>
    );
}

export default InstructorManageCriteriaTemplate;