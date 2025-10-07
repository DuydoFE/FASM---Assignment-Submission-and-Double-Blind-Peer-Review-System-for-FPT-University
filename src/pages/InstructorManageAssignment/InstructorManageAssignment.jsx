import React, { useState, useEffect } from 'react';
import { Plus, FileText, Clock, Lock, Calendar, X, Trash2, Upload, ChevronDown } from 'lucide-react';

import { useParams } from 'react-router-dom';
import { getAssignments } from '../../service/courseInstructor';

const InstructorManageAssignment = () => {
  const { id: courseInstanceId } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGradingScale, setSelectedGradingScale] = useState('percentage');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    allowedExtensions: '',
    maxFiles: 1,
    courseWeight: 0
  });

  const [rubricCriteria, setRubricCriteria] = useState([]);

  const gradingScales = {
    '100-point': { name: '100-Point Scale (0-100)', showWeight: true },
    'letter': { name: 'Letter Grade (A, B, C, D, F)', showWeight: false },
    'percentage': { name: 'Percentage Scale (0-100%)', showWeight: true },
    'pass-fail': { name: 'Pass/Fail Scale', showWeight: false }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateCriteriaWeight = (id, weight) => {
    setRubricCriteria(prev =>
      prev.map(criteria =>
        criteria.id === id ? { ...criteria, weight: parseInt(weight) || 0 } : criteria
      )
    );
  };

  const deleteCriteria = (id) => {
    setRubricCriteria(prev => prev.filter(criteria => criteria.id !== id));
  };

  const addNewCriteria = () => {
    const newId = rubricCriteria.length > 0 ? Math.max(...rubricCriteria.map(c => c.id)) + 1 : 1;
    setRubricCriteria(prev => [...prev, {
      id: newId,
      name: '',
      description: '',
      weight: 0,
      details: ['', '', '']
    }]);
  };

  const addDetailToCriteria = (criteriaId) => {
    setRubricCriteria(prev =>
      prev.map(c =>
        c.id === criteriaId
          ? { ...c, details: [...c.details, ''] }
          : c
      )
    );
  };

  const removeDetailFromCriteria = (criteriaId, detailIndex) => {
    setRubricCriteria(prev =>
      prev.map(c =>
        c.id === criteriaId
          ? { ...c, details: c.details.filter((_, index) => index !== detailIndex) }
          : c
      )
    );
  };

  const getTotalWeight = () => {
    return rubricCriteria.reduce((sum, criteria) => sum + criteria.weight, 0);
  };

  // Fetch assignments when component mounts
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await getAssignments(courseInstanceId);

        // Map the API response to match our UI structure
        const mappedAssignments = response.map(assignment => ({
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          guidelines: assignment.guidelines,
          deadline: new Date(assignment.deadline).toLocaleDateString(),
          time: new Date(assignment.deadline).toLocaleTimeString(),
          weight: assignment.courseWeight || 0,
          submitted: assignment.reviewCount,
          total: assignment.submissionCount,
          status: new Date(assignment.deadline) > new Date() ? "Open" : "Closed",
          statusColor: new Date(assignment.deadline) > new Date()
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }));

        setAssignments(mappedAssignments);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
        // You might want to show an error message to the user
      } finally {
        setLoading(false);
      }
    };

    if (courseInstanceId) {
      fetchAssignments();
    }
  }, [courseInstanceId]);

  const handleStatusClick = () => {
    if (statusFilter === 'All') setStatusFilter('Open');
    else if (statusFilter === 'Open') setStatusFilter('Closed');
    else setStatusFilter('All');
  };

  const filteredAssignments = statusFilter === 'All'
    ? assignments
    : assignments.filter(a => a.status === statusFilter);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading assignments...</p>
      </div>
    );
  }

  const getDeadlineColor = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline.split('/').reverse().join('-'));
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-500";
    if (diffDays <= 3) return "text-orange-500";
    return "text-gray-900";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignment Management</h1>
          <div className="flex items-center space-x-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              WDU391
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              SE1718
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Assignments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">4</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Open</p>
              <p className="text-3xl font-bold text-green-600 mt-1">3</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Closed</p>
              <p className="text-3xl font-bold text-red-600 mt-1">1</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="col-span-3">Assignment Name</div>
          <div className="col-span-2 text-center">Weight</div>
          <div className="col-span-2 text-center">Deadline</div>
          <div className="col-span-2 text-center">Submissions</div>
          <div className="col-span-1 text-center cursor-pointer select-none hover:text-orange-600 transition flex items-center justify-center gap-1">
            Status
            <ChevronDown size={16} />
          </div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 items-center transition-colors"
          >
            <div className="col-span-3 space-y-1">
              <h3 className="font-semibold text-gray-900 text-base truncate">{assignment.title}</h3>
              {/* <p className="text-sm text-gray-600 line-clamp-2">{assignment.description}</p> */}
            </div>
            <div className="col-span-2 text-center">
              <span className="font-medium text-gray-900">{assignment.weight}%</span>
            </div>
            <div className="col-span-2 text-center space-y-1">
              <div className={`font-medium text-base ${getDeadlineColor(assignment.deadline)}`}>
                {assignment.deadline}
              </div>
              <div className="text-sm text-gray-500">{assignment.time}</div>
            </div>
            <div className="col-span-2 text-center">
              <div className="font-bold text-lg text-gray-900">
                {assignment.submitted}/{assignment.total}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((assignment.submitted / assignment.total) * 100)}% completed
              </div>
            </div>
            <div className="col-span-1 flex justify-center">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${assignment.statusColor} flex items-center space-x-1`}
              >
                {assignment.status === "Open" ? (
                  <Clock className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                <span>{assignment.status}</span>
              </span>
            </div>
            <div className="col-span-2 flex justify-center items-center space-x-2">
              <button
                className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Schedule"
              >
                <Calendar className="w-5 h-5" />
              </button>
              <button
                className="text-green-600 hover:text-green-800 p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                title="View Details"
              >
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assignment Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full my-8">
            {/* Popup Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-gray-900">Create New Assignment</h2>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter assignment title..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Detailed description of the assignment, requirements and instructions..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deadline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignment Weight <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={formData.courseWeight}
                          onChange={(e) => handleInputChange('courseWeight', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          max="100"
                          step="0.1"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-600 font-medium">%</span>
                      </div>
                    </div>
                  </div>

                  {/* File Upload Settings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submission File Settings <span className="text-red-500">*</span>
                    </label>

                    <div className="space-y-4">
                      {/* Allowed Extensions */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">
                          Allowed File Extensions
                        </label>
                        <input
                          type="text"
                          value={formData.allowedExtensions}
                          onChange={(e) => handleInputChange('allowedExtensions', e.target.value)}
                          placeholder="example: .pdf, .docx, .py, .java, .zip or leave empty for all types"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grading Scale Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Grading Rubric</h3>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800 font-medium mb-3">Select grading scale type:</p>
                  <div className="space-y-2">
                    {Object.entries(gradingScales).map(([key, scale]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="radio"
                          name="gradingScale"
                          value={key}
                          checked={selectedGradingScale === key}
                          onChange={(e) => setSelectedGradingScale(e.target.value)}
                          className="mr-3 text-orange-500"
                        />
                        <span className="text-sm text-blue-800">{scale.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Criteria Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Grading Criteria</h4>

                  {rubricCriteria.map((criteria, index) => (
                    <div key={criteria.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={criteria.name}
                            onChange={(e) => {
                              setRubricCriteria(prev =>
                                prev.map(c =>
                                  c.id === criteria.id ? { ...c, name: e.target.value } : c
                                )
                              );
                            }}
                            placeholder="Criteria name"
                            className="flex-1 font-medium text-gray-900 bg-transparent border-none p-0 focus:ring-0"
                          />
                        </div>

                        <div className="flex items-center space-x-3">
                          {(selectedGradingScale === '100-point' || selectedGradingScale === 'percentage') && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={criteria.weight}
                                onChange={(e) => updateCriteriaWeight(criteria.id, e.target.value)}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                                min="0"
                                max="100"
                              />
                              <span className="text-sm text-gray-500">%</span>
                            </div>
                          )}
                          <button
                            onClick={() => deleteCriteria(criteria.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={criteria.description}
                        onChange={(e) => {
                          setRubricCriteria(prev =>
                            prev.map(c =>
                              c.id === criteria.id ? { ...c, description: e.target.value } : c
                            )
                          );
                        }}
                        placeholder="Detailed description of this criteria"
                        className="w-full text-sm text-gray-600 bg-transparent border-none p-0 focus:ring-0 mb-3"
                      />

                      <div className="space-y-2">
                        {criteria.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center space-x-2">
                            <span className="text-gray-400">•</span>
                            <input
                              type="text"
                              value={detail}
                              onChange={(e) => {
                                setRubricCriteria(prev =>
                                  prev.map(c =>
                                    c.id === criteria.id
                                      ? {
                                        ...c,
                                        details: c.details.map((d, i) =>
                                          i === detailIndex ? e.target.value : d
                                        )
                                      }
                                      : c
                                  )
                                );
                              }}
                              placeholder="Requirement detail"
                              className="flex-1 text-sm text-gray-700 bg-transparent border-none p-0 focus:ring-0"
                            />
                            {criteria.details.length > 1 && (
                              <button
                                onClick={() => removeDetailFromCriteria(criteria.id, detailIndex)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addDetailToCriteria(criteria.id)}
                          className="text-sm text-orange-500 hover:text-orange-600 ml-6"
                        >
                          + Add detail
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addNewCriteria}
                    className="w-full border-2 border-dashed border-orange-300 rounded-lg p-4 text-orange-500 hover:border-orange-400 hover:text-orange-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add new grading criteria</span>
                  </button>

                  {/* Weight Summary Table */}
                  {(selectedGradingScale === '100-point' || selectedGradingScale === 'percentage') && rubricCriteria.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-blue-800 font-medium">Weight Summary</h5>
                        <span className={`font-bold ${getTotalWeight() === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                          Total: {getTotalWeight()}%
                        </span>
                      </div>
                      <div className="space-y-1">
                        {rubricCriteria.map((criteria, index) => (
                          <div key={criteria.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">
                              {criteria.name || `Criteria ${index + 1}`}
                            </span>
                            <span className="font-medium text-gray-900">
                              {criteria.weight}%
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-blue-200 pt-2 mt-2">
                          <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-blue-800">Total</span>
                            <span className={`${getTotalWeight() === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                              {getTotalWeight()}%
                            </span>
                          </div>
                        </div>
                        {getTotalWeight() > 100 && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                            <div className="flex items-center space-x-2">
                              <div className="text-red-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-red-800 text-sm font-medium">
                                Warning: Total weight exceeds 100%!
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Save Draft
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorManageAssignment;