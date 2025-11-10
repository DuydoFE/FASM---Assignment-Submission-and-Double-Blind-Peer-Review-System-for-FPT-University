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
                
                {/* Header Section */}
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium mb-4"
                        type="button"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Templates</span>
                    </button>
                    
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-indigo-600 text-sm mb-2 font-medium">
                                    <span>Template Management</span>
                                    <span>/</span>
                                    <span>Criteria</span>
                                </div>
                                <h1 className="text-3xl font-bold mb-2 text-gray-900">{templateTitle}</h1>
                                <p className="text-gray-600">View evaluation criteria template details</p>
                            </div>
                        </div>
                    </div>
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
                        <h2 className="text-xl font-semibold text-gray-900">Evaluation Criteria</h2>
                        <p className="text-sm text-gray-600">View assessment criteria templates</p>
                    </div>
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
                                                
                                                {/* Stats */}
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
                                                </div>
                                            </div>

                                            {/* Description */}
                                            {criterion.description && (
                                                <p className="text-sm text-gray-600 leading-relaxed mb-3">{criterion.description}</p>
                                            )}

                                            {/* Score Labels */}
                                            {criterion.items && criterion.items.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <div className="text-xs font-medium text-gray-500 mb-2">Score Labels:</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {criterion.items.map((item, idx) => (
                                                            <span 
                                                                key={idx}
                                                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
                                                            >
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
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